import mongoose from 'mongoose';
export declare const Goal: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
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
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: mongoose.Types.ObjectId;
    name: string;
    duration: string;
    frequency: string;
    category: mongoose.Types.ObjectId;
    target: number;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=goal.d.ts.map