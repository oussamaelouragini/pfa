import mongoose from 'mongoose';
export declare const Category: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
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
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
    isDefault: boolean;
    icon?: string | null;
    color?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
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
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
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
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense";
    name: string;
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