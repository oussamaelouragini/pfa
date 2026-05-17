import { IMessage, IPendingAction } from '../models/conversation';
export declare function getOrCreateConversation(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../models/conversation").IConversation, {}, import("mongoose").DefaultSchemaOptions> & import("../models/conversation").IConversation & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare function getContextMessages(userId: string): Promise<IMessage[]>;
export declare function appendMessage(userId: string, message: IMessage): Promise<void>;
export declare function appendMessages(userId: string, messages: IMessage[]): Promise<void>;
export declare function setPendingAction(userId: string, action: IPendingAction): Promise<void>;
export declare function getPendingAction(userId: string): Promise<IPendingAction | undefined>;
export declare function clearPendingAction(userId: string): Promise<void>;
export declare function updateDetectedLanguage(userId: string, language: string): Promise<void>;
export declare function updateUserContext(userId: string, context: Partial<{
    preferredLanguage: string;
    financialGoals: string[];
    notes: string;
}>): Promise<void>;
export declare function clearConversation(userId: string): Promise<void>;
export declare function getUserContext(userId: string): Promise<{
    preferredLanguage: string | undefined;
    financialGoals: string[];
    notes: string | undefined;
    detectedLanguage: string;
}>;
//# sourceMappingURL=memoryService.d.ts.map