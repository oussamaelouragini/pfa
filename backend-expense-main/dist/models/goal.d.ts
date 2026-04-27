import mongoose from 'mongoose';
export declare const Goal: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
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
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: mongoose.Types.ObjectId;
    title: string;
    targetAmount: number;
    savedAmount: number;
    status: "active" | "completed" | "paused";
    imageUrl?: string | null;
    deadline?: NativeDate | null;
    aiAnalysis?: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=goal.d.ts.map