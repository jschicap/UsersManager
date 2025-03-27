import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { User } from '../interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserModel } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserModel>) {}

  // Registro de usuarios
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();

    // Enviar email de verificación
    await this.sendVerificationEmail(savedUser.email, savedUser.id);

    return this.mapToUserInterface(savedUser);
  }


    async findAll(): Promise<User[]> {
      return (await this.userModel.find().exec()).map(usuario => this.mapToUserInterface(usuario));
    }
  
    async findOne(id: string): Promise<User> {
      return this.mapToUserInterface(this.userModel.findById(id).exec());
    }
  
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
     const usuario = this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
     return this.mapToUserInterface((usuario));
    }
  
    async delete(id: string): Promise<void> {
      const deletedUser = this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
    }
  // Autenticación con JWT
  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    const accessToken = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
    return { accessToken };
  }

  // Cambio de contraseña
  async changePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword }).exec();
  }

  
  // Verificación por email
  private async sendVerificationEmail(email: string, userId: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'jschicap@gmail.com',
        pass: 'nizw dqrb basw xsvb',
      },
    });

    const verificationLink = `http://localhost:3001/verify?userId=${userId}`;
    await transporter.sendMail({
      to: email,
      subject: "Código de verificación para tu cuenta",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Verificación de cuenta</h2>
          <p>Hola ${fullname},</p>
          <p>Gracias por registrarte. Para completar tu registro, por favor utiliza el siguiente código de verificación:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>Este código expirará en 15 minutos.</p>
          <p>Si no has solicitado este código, por favor ignora este correo.</p>
          <p>Saludos,<br>El equipo de soporte</p>
        </div>
      `,
    });
  }

  // Otros métodos (findAll, findOne, update, delete) permanecen iguales

  private mapToUserInterface(userDocument: any): User {
    return {
      id: userDocument._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      isVerified: userDocument.isVerified,
      role: userDocument.role,
      createdAt: userDocument.createdAt,
      updatedAt: userDocument.updatedAt,
    };
  }
}