export interface ToolResult {
    success: boolean;
    data?: any;
    error?: string;
}
export declare function executeTool(toolName: string, args: Record<string, any>, userId: string): Promise<ToolResult>;
//# sourceMappingURL=toolExecutor.d.ts.map