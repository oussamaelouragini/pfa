import mongoose from 'mongoose';
export declare const Transaction: mongoose.Model<{
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    type: "expense" | "income";
    date: NativeDate;
    userId: mongoose.Types.ObjectId;
    amount: number;
    isRecurring: boolean;
    categoryId?: mongoose.Types.ObjectId | null;
    note?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=transaction.d.ts.map