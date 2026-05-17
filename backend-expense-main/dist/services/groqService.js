"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processChat = processChat;
exports.executeConfirmedAction = executeConfirmedAction;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const index_1 = require("../ai/tools/index");
const toolExecutor_1 = require("../ai/toolExecutor");
const systemPrompt_1 = require("../ai/systemPrompt");
const memoryService_1 = require("./memoryService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOOL_ITERATIONS = 5;
function buildConfirmationMessage(toolName, args, language) {
    const isArabic = language === 'ar' || language === 'ar-TN';
    const isFrench = language === 'fr';
    if (toolName === 'create_expense') {
        if (isArabic) {
            return `فهمت التالي:\n• **المبلغ:** ${args.amount} دينار\n• **الفئة:** ${args.categoryName || 'غير محدد'}\n• **الملاحظة:** ${args.note || '-'}\n• **التاريخ:** ${args.date || 'اليوم'}\n\nهل تأكد الإضافة؟`;
        }
        if (isFrench) {
            return `J'ai compris:\n• **Montant:** ${args.amount} TND\n• **Catégorie:** ${args.categoryName || 'Non défini'}\n• **Note:** ${args.note || '-'}\n• **Date:** ${args.date || "Aujourd'hui"}\n\nConfirmer l'ajout?`;
        }
        return `I understood:\n• **Amount:** ${args.amount} TND\n• **Category:** ${args.categoryName || 'Uncategorized'}\n• **Note:** ${args.note || '-'}\n• **Date:** ${args.date || 'Today'}\n\nShall I add this expense?`;
    }
    if (toolName === 'create_income') {
        if (isArabic) {
            return `تسجيل دخل:\n• **المبلغ:** ${args.amount} دينار\n• **المصدر:** ${args.categoryName || 'غير محدد'}\n• **التاريخ:** ${args.date || 'اليوم'}\n\nتأكيد؟`;
        }
        if (isFrench) {
            return `Enregistrement d'un revenu:\n• **Montant:** ${args.amount} TND\n• **Source:** ${args.categoryName || 'Non défini'}\n• **Date:** ${args.date || "Aujourd'hui"}\n\nConfirmer?`;
        }
        return `Recording income:\n• **Amount:** ${args.amount} TND\n• **Source:** ${args.categoryName || 'Uncategorized'}\n• **Date:** ${args.date || 'Today'}\n\nConfirm?`;
    }
    if (toolName === 'delete_transaction') {
        if (isArabic)
            return `⚠️ هل أنت متأكد من حذف هذه المعاملة نهائياً؟`;
        if (isFrench)
            return `⚠️ Êtes-vous sûr de vouloir supprimer définitivement cette transaction?`;
        return `⚠️ Are you sure you want to permanently delete this transaction?`;
    }
    if (toolName === 'create_goal') {
        if (isArabic) {
            return `إنشاء هدف مالي:\n• **الاسم:** ${args.name}\n• **المبلغ المستهدف:** ${args.target} دينار\n• **المدة:** ${args.duration || 'غير محدد'}\n\nتأكيد؟`;
        }
        if (isFrench) {
            return `Création d'un objectif financier:\n• **Nom:** ${args.name}\n• **Montant cible:** ${args.target} TND\n• **Durée:** ${args.duration || 'Non défini'}\n\nConfirmer?`;
        }
        return `Creating financial goal:\n• **Name:** ${args.name}\n• **Target:** ${args.target} TND\n• **Duration:** ${args.duration || 'Not specified'}\n\nConfirm?`;
    }
    // Generic fallback
    return `Confirm action: **${toolName}** with: ${JSON.stringify(args, null, 2)}`;
}
async function processChat(userId, userMessage, userName) {
    try {
        // Load user context and conversation history
        const [contextMessages, userCtx] = await Promise.all([
            (0, memoryService_1.getContextMessages)(userId),
            (0, memoryService_1.getUserContext)(userId),
        ]);
        const promptOptions = {};
        if (userName)
            promptOptions.userName = userName;
        if (userCtx.preferredLanguage)
            promptOptions.preferredLanguage = userCtx.preferredLanguage;
        if (userCtx.financialGoals.length)
            promptOptions.financialGoals = userCtx.financialGoals;
        if (userCtx.notes)
            promptOptions.notes = userCtx.notes;
        const systemPrompt = (0, systemPrompt_1.buildSystemPrompt)(promptOptions);
        // Build message history for Groq
        const historyForGroq = contextMessages
            .filter((m) => m.role !== 'system')
            .map((m) => {
            if (m.role === 'assistant' && m.toolCalls?.length) {
                return {
                    role: 'assistant',
                    content: m.content || null,
                    tool_calls: m.toolCalls.map((tc) => ({
                        id: tc.id,
                        type: 'function',
                        function: { name: tc.name, arguments: JSON.stringify(tc.arguments) },
                    })),
                };
            }
            if (m.role === 'tool') {
                return {
                    role: 'tool',
                    content: m.content,
                    tool_call_id: m.toolCallId,
                };
            }
            return {
                role: m.role,
                content: m.content,
            };
        });
        const newUserMessage = {
            role: 'user',
            content: userMessage,
        };
        let messages = [
            { role: 'system', content: systemPrompt },
            ...historyForGroq,
            newUserMessage,
        ];
        const messagesToSave = [
            { role: 'user', content: userMessage, timestamp: new Date() },
        ];
        let finalResponse = '';
        let iterations = 0;
        // Agentic loop: keep processing until no more tool calls
        while (iterations < MAX_TOOL_ITERATIONS) {
            iterations++;
            const response = await groq.chat.completions.create({
                model: MODEL,
                messages,
                tools: index_1.AI_TOOLS,
                tool_choice: 'auto',
                temperature: 0.6,
                max_tokens: 1024,
            });
            const choice = response.choices[0];
            if (!choice)
                break;
            const assistantMsg = choice.message;
            // No tool calls → this is the final text response
            if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
                finalResponse = assistantMsg.content || '';
                messagesToSave.push({
                    role: 'assistant',
                    content: finalResponse,
                    timestamp: new Date(),
                });
                await (0, memoryService_1.appendMessages)(userId, messagesToSave);
                return { type: 'message', message: finalResponse };
            }
            // Check if any tool call is destructive (requires confirmation)
            const destructiveCalls = assistantMsg.tool_calls.filter((tc) => index_1.DESTRUCTIVE_TOOLS.has(tc.function.name));
            if (destructiveCalls.length > 0) {
                // Take the first destructive action for confirmation
                const targetCall = destructiveCalls[0];
                const parsedArgs = JSON.parse(targetCall.function.arguments);
                const confirmationMsg = buildConfirmationMessage(targetCall.function.name, parsedArgs, userCtx.detectedLanguage);
                const pendingAction = {
                    toolName: targetCall.function.name,
                    args: parsedArgs,
                    confirmationMessage: confirmationMsg,
                    rawToolCallId: targetCall.id,
                };
                const currentToolCalls = assistantMsg.tool_calls ?? [];
                // Save user message + assistant's intent to memory
                messagesToSave.push({
                    role: 'assistant',
                    content: confirmationMsg,
                    toolCalls: currentToolCalls.map((tc) => ({
                        id: tc.id,
                        name: tc.function.name,
                        arguments: JSON.parse(tc.function.arguments),
                    })),
                    timestamp: new Date(),
                });
                await Promise.all([
                    (0, memoryService_1.appendMessages)(userId, messagesToSave),
                    (0, memoryService_1.setPendingAction)(userId, pendingAction),
                ]);
                return {
                    type: 'confirmation_required',
                    message: confirmationMsg,
                    pendingAction,
                };
            }
            // All tools are read-only → execute immediately
            const toolResultMessages = [];
            const toolMemoryMessages = [];
            // Save assistant's tool-call message
            toolMemoryMessages.push({
                role: 'assistant',
                content: assistantMsg.content || '',
                toolCalls: assistantMsg.tool_calls.map((tc) => ({
                    id: tc.id,
                    name: tc.function.name,
                    arguments: JSON.parse(tc.function.arguments),
                })),
                timestamp: new Date(),
            });
            // Execute all read-only tools in parallel
            const toolExecutions = await Promise.all(assistantMsg.tool_calls.map(async (tc) => {
                const args = JSON.parse(tc.function.arguments);
                const result = await (0, toolExecutor_1.executeTool)(tc.function.name, args, userId);
                return { tc, args, result };
            }));
            for (const { tc, result } of toolExecutions) {
                const resultContent = result.success
                    ? JSON.stringify(result.data)
                    : JSON.stringify({ error: result.error });
                toolResultMessages.push({
                    role: 'tool',
                    content: resultContent,
                    tool_call_id: tc.id,
                });
                toolMemoryMessages.push({
                    role: 'tool',
                    content: resultContent,
                    toolCallId: tc.id,
                    toolName: tc.function.name,
                    timestamp: new Date(),
                });
            }
            // Add assistant + tool result messages to history for next iteration
            messages = [
                ...messages,
                {
                    role: 'assistant',
                    content: assistantMsg.content || null,
                    tool_calls: assistantMsg.tool_calls ?? [],
                },
                ...toolResultMessages,
            ];
            messagesToSave.push(...toolMemoryMessages);
        }
        // Fallback if loop exhausted
        finalResponse = 'I processed your request. Let me know if you need anything else.';
        messagesToSave.push({ role: 'assistant', content: finalResponse, timestamp: new Date() });
        await (0, memoryService_1.appendMessages)(userId, messagesToSave);
        return { type: 'message', message: finalResponse };
    }
    catch (err) {
        console.error('[GroqService] processChat error:', err.message);
        return {
            type: 'error',
            message: 'I encountered an issue processing your request. Please try again.',
        };
    }
}
async function executeConfirmedAction(userId, toolName, args) {
    try {
        const result = await (0, toolExecutor_1.executeTool)(toolName, args, userId);
        if (!result.success) {
            return {
                type: 'error',
                message: `Action failed: ${result.error}`,
                executedAction: { toolName, result },
            };
        }
        // Build a success message using Groq to keep language consistency
        const userCtx = await (0, memoryService_1.getUserContext)(userId);
        const successContext = `Tool ${toolName} executed successfully. Result: ${JSON.stringify(result.data)}`;
        const summaryResponse = await groq.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'system',
                    content: `You are a financial assistant. Generate a brief, friendly confirmation message in ${userCtx.detectedLanguage} language for this action. Be warm and concise. Use appropriate emoji.`,
                },
                { role: 'user', content: successContext },
            ],
            temperature: 0.7,
            max_tokens: 150,
        });
        const confirmMsg = summaryResponse.choices[0]?.message.content || 'Action completed successfully! ✅';
        // Append confirmed action result to memory
        await (0, memoryService_1.appendMessages)(userId, [
            {
                role: 'assistant',
                content: confirmMsg,
                toolName,
                timestamp: new Date(),
            },
        ]);
        return {
            type: 'action_completed',
            message: confirmMsg,
            executedAction: { toolName, result: result.data },
        };
    }
    catch (err) {
        console.error('[GroqService] executeConfirmedAction error:', err.message);
        return { type: 'error', message: 'Failed to execute the action. Please try again.' };
    }
}
//# sourceMappingURL=groqService.js.map