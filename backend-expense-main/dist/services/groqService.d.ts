export interface AIResponse {
    type: 'message' | 'confirmation_required' | 'action_completed' | 'error';
    message: string;
    pendingAction?: {
        toolName: string;
        args: Record<string, any>;
        confirmationMessage: string;
        rawToolCallId: string;
    };
    executedAction?: {
        toolName: string;
        result: any;
    };
}
export declare function processChat(userId: string, userMessage: string, userName?: string): Promise<AIResponse>;
export declare function executeConfirmedAction(userId: string, toolName: string, args: Record<string, any>): Promise<AIResponse>;
//# sourceMappingURL=groqService.d.ts.map