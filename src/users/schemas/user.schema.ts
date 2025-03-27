import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserModel & Document;

@Schema({
  timestamps: true, // Esto añadirá automáticamente createdAt y updatedAt
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class UserModel {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'usuario' })
  role: string;

  @Prop({ required: false })
    refreshToken?: string;
  
  @Prop({ required: false })
    createdAt: Date;

  @Prop({ required: false })
    updatedAt: Date;
  
  

}

export const userSchema = SchemaFactory.createForClass(UserModel);