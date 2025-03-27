// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/user.dto';
import { UserModel } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserModel>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const savedUser = await createdUser.save();
    return this.mapToTaskInterface(savedUser);
  }

  async findAll(): Promise<User[]> {
    return (await this.userModel.find().exec()).map(usuario => this.mapToTaskInterface(usuario));
  }

  async findOne(id: string): Promise<User> {
    return this.mapToTaskInterface(this.userModel.findById(id).exec());
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
   const usuario = this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
   return this.mapToTaskInterface((usuario));
  }

  async delete(id: string): Promise<void> {
    const deletedUser = this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
  }
  private mapToTaskInterface(userDocument: any): User {
    return {
      id: userDocument._id ? userDocument._id.toString() : userDocument.id,
      name: userDocument.name,
      email: userDocument.email,
      isVerified: userDocument.isVerified,
      role: userDocument.role,
      refreshToken: userDocument.refreshToken,
      createdAt: userDocument.createdAt,
      updatedAt: userDocument.updatedAt,
      
    };
  }
}