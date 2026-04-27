// modules/users/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
}

const UserSchema = new Schema<IUser>({
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },  // bcrypt hash
  name:      { type: String, required: true, maxlength: 100 },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
