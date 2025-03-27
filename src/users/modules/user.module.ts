import { Module } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { UsersController } from '../controllers/users.controller';
import { Mongoose } from 'mongoose';
import { UserModel, userSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: userSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UsersController]
})
export class UsersModule {}
