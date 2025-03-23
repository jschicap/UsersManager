import { Schema, Document } from 'mongoose';

export interface User extends Document {
  id: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema<User>({
  id: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});