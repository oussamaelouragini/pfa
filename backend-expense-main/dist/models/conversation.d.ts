import mongoose, { Document } from 'mongoose';
export interface IToolCall {
    id: string;
    name: string;
    arguments: Record<string, any>;
}
export interface IMessage {
    role: 'user' | 'assistant' | 'tool' | 'system';
    content: string;
    toolCallId?: string;
    toolName?: string;
    toolCalls?: IToolCall[];
    timestamp: Date;
}
export interface IPendingAction {
    toolName: string;
    args: Record<string, any>;
    confirmationMessage: string;
    rawToolCallId: string;
}
export interface IConversation extends Document {
    userId: mongoose.Types.ObjectId;
    messages: IMessage[];
    detectedLanguage: string;
    userContext: {
        preferredLanguage?: string;
        financialGoals?: string[];
        notes?: string;
    };
    pendingAction?: IPendingAction;
    lastActivity: Date;
}
declare const _default: mongoose.Model<IConversation, {}, {}, {}, mongoose.Document<unknown, {}, IConversation, {}, mongoose.DefaultSchemaOptions> & IConversation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IConversation>;
export default _default;
//# sourceMappingURL=conversation.d.ts.map