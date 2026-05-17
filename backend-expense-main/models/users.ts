import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  phone?: string | null;
  countryCode?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  primaryCurrency?: string | null;
  memberType?: string | null;
  authProvider?: string | null;
}

const UserSchema = new Schema<IUser>({
  email:           { type: String, required: true, unique: true, lowercase: true },
  password:        { type: String },
  name:            { type: String, required: true, maxlength: 100 },
  phone:           { type: String, default: '' },
  countryCode:     { type: String, default: '+216' },
  address:         { type: String, default: '' },
  avatarUrl:       { type: String, default: null },
  primaryCurrency: { type: String, default: 'TND' },
  memberType:      { type: String, default: 'STANDARD MEMBER' },
  authProvider:    { type: String, default: null },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
