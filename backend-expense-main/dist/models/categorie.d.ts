import mongoose from 'mongoose';
export declare const Category: mongoose.Model<{
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    userId: mongoose.Types.ObjectId;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=categorie.d.ts.map