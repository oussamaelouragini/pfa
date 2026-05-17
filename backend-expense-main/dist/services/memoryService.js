"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateConversation = getOrCreateConversation;
exports.getContextMessages = getContextMessages;
exports.appendMessage = appendMessage;
exports.appendMessages = appendMessages;
exports.setPendingAction = setPendingAction;
exports.getPendingAction = getPendingAction;
exports.clearPendingAction = clearPendingAction;
exports.updateDetectedLanguage = updateDetectedLanguage;
exports.updateUserContext = updateUserContext;
exports.clearConversation = clearConversation;
exports.getUserContext = getUserContext;
const conversation_1 = __importDefault(require("../models/conversation"));
const MAX_CONTEXT_MESSAGES = 20;
async function getOrCreateConversation(userId) {
    let conversation = await conversation_1.default.findOne({ userId });
    if (!conversation) {
        conversation = new conversation_1.default({ userId, messages: [] });
        await conversation.save();
    }
    return conversation;
}
async function getContextMessages(userId) {
    const conv = await conversation_1.default.findOne({ userId });
    if (!conv || !conv.messages.length)
        return [];
    // Return the most recent N messages for context window
    return conv.messages.slice(-MAX_CONTEXT_MESSAGES);
}
async function appendMessage(userId, message) {
    await conversation_1.default.findOneAndUpdate({ userId }, {
        $push: { messages: message },
        $set: { lastActivity: new Date() },
    }, { upsert: true });
}
async function appendMessages(userId, messages) {
    await conversation_1.default.findOneAndUpdate({ userId }, {
        $push: { messages: { $each: messages } },
        $set: { lastActivity: new Date() },
    }, { upsert: true });
}
async function setPendingAction(userId, action) {
    await conversation_1.default.findOneAndUpdate({ userId }, { $set: { pendingAction: action } }, { upsert: true });
}
async function getPendingAction(userId) {
    const conv = await conversation_1.default.findOne({ userId });
    return conv?.pendingAction;
}
async function clearPendingAction(userId) {
    await conversation_1.default.findOneAndUpdate({ userId }, { $unset: { pendingAction: '' } });
}
async function updateDetectedLanguage(userId, language) {
    await conversation_1.default.findOneAndUpdate({ userId }, { $set: { detectedLanguage: language } }, { upsert: true });
}
async function updateUserContext(userId, context) {
    const update = {};
    if (context.preferredLanguage)
        update['userContext.preferredLanguage'] = context.preferredLanguage;
    if (context.financialGoals)
        update['userContext.financialGoals'] = context.financialGoals;
    if (context.notes)
        update['userContext.notes'] = context.notes;
    await conversation_1.default.findOneAndUpdate({ userId }, { $set: update }, { upsert: true });
}
async function clearConversation(userId) {
    await conversation_1.default.findOneAndUpdate({ userId }, { $set: { messages: [], pendingAction: undefined } });
}
async function getUserContext(userId) {
    const conv = await conversation_1.default.findOne({ userId });
    return {
        preferredLanguage: conv?.userContext?.preferredLanguage,
        financialGoals: conv?.userContext?.financialGoals || [],
        notes: conv?.userContext?.notes,
        detectedLanguage: conv?.detectedLanguage || 'en',
    };
}
//# sourceMappingURL=memoryService.js.map