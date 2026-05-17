import mongoose, { Document } from 'mongoose';
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
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=users.d.ts.map