"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = exports.resetConversation = exports.voice = exports.confirm = exports.chat = void 0;
const groqService_1 = require("../services/groqService");
const transcriptionService_1 = require("../services/transcriptionService");
const memoryService_1 = require("../services/memoryService");
const users_1 = require("../models/users");
// ─── Rate limiting (simple in-memory, per user) ───────────────────────────────
const rateLimitMap = new Map();
function checkRateLimit(userId) {
    const now = Date.now();
    const window = 60_000; // 1 minute
    const maxRequests = 30;
    const entry = rateLimitMap.get(userId);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(userId, { count: 1, resetAt: now + window });
        return true;
    }
    if (entry.count >= maxRequests)
        return false;
    entry.count++;
    return true;
}
// ─── POST /ai/chat ────────────────────────────────────────────────────────────
const chat = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!checkRateLimit(userId)) {
            res.status(429).json({ message: 'Too many requests. Please wait a moment.' });
            return;
        }
        const { message } = req.body;
        if (!message || typeof message !== 'string' || !message.trim()) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }
        if (message.length > 2000) {
            res.status(400).json({ message: 'Message too long (max 2000 characters)' });
            return;
        }
        // Fetch user name for personalization
        const user = await users_1.User.findById(userId).select('name').lean();
        const aiResponse = await (0, groqService_1.processChat)(userId, message.trim(), user?.name);
        res.status(200).json({
            type: aiResponse.type,
            message: aiResponse.message,
            ...(aiResponse.pendingAction && {
                pendingAction: {
                    toolName: aiResponse.pendingAction.toolName,
                    confirmationMessage: aiResponse.pendingAction.confirmationMessage,
                },
            }),
            ...(aiResponse.executedAction && { executedAction: aiResponse.executedAction }),
        });
    }
    catch (err) {
        console.error('[AIController] chat error:', err.message);
        res.status(500).json({ message: 'AI service error. Please try again.' });
    }
};
exports.chat = chat;
// ─── POST /ai/confirm ─────────────────────────────────────────────────────────
const confirm = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { confirmed } = req.body;
        const pending = await (0, memoryService_1.getPendingAction)(userId);
        if (!pending) {
            res.status(404).json({ message: 'No pending action found. Please start a new request.' });
            return;
        }
        await (0, memoryService_1.clearPendingAction)(userId);
        if (!confirmed) {
            res.status(200).json({
                type: 'cancelled',
                message: 'Action cancelled. What else can I help you with?',
            });
            return;
        }
        const result = await (0, groqService_1.executeConfirmedAction)(userId, pending.toolName, pending.args);
        res.status(200).json({
            type: result.type,
            message: result.message,
            ...(result.executedAction && { executedAction: result.executedAction }),
        });
    }
    catch (err) {
        console.error('[AIController] confirm error:', err.message);
        res.status(500).json({ message: 'Failed to execute action. Please try again.' });
    }
};
exports.confirm = confirm;
// ─── POST /ai/voice ───────────────────────────────────────────────────────────
const voice = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!checkRateLimit(userId)) {
            res.status(429).json({ message: 'Too many requests. Please wait a moment.' });
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: 'Audio file is required' });
            return;
        }
        // Transcribe the audio
        const { text: transcribedText, detectedLanguage } = await (0, transcriptionService_1.transcribeAudio)(file.path);
        if (!transcribedText.trim()) {
            res.status(400).json({ message: 'Could not transcribe audio. Please try again.' });
            return;
        }
        // Update detected language in memory
        if (detectedLanguage) {
            await (0, memoryService_1.updateUserContext)(userId, { preferredLanguage: detectedLanguage });
        }
        // Process the transcribed text through AI
        const user = await users_1.User.findById(userId).select('name').lean();
        const aiResponse = await (0, groqService_1.processChat)(userId, transcribedText, user?.name);
        res.status(200).json({
            transcription: transcribedText,
            detectedLanguage,
            type: aiResponse.type,
            message: aiResponse.message,
            ...(aiResponse.pendingAction && {
                pendingAction: {
                    toolName: aiResponse.pendingAction.toolName,
                    confirmationMessage: aiResponse.pendingAction.confirmationMessage,
                },
            }),
            ...(aiResponse.executedAction && { executedAction: aiResponse.executedAction }),
        });
    }
    catch (err) {
        console.error('[AIController] voice error:', err.message);
        res.status(500).json({ message: 'Voice processing error. Please try again.' });
    }
};
exports.voice = voice;
// ─── DELETE /ai/conversation ──────────────────────────────────────────────────
const resetConversation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await (0, memoryService_1.clearConversation)(userId);
        res.status(200).json({ message: 'Conversation history cleared.' });
    }
    catch (err) {
        console.error('[AIController] reset error:', err.message);
        res.status(500).json({ message: 'Failed to clear conversation.' });
    }
};
exports.resetConversation = resetConversation;
// ─── GET /ai/context ──────────────────────────────────────────────────────────
const getContext = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const context = await (0, memoryService_1.getUserContext)(userId);
        res.status(200).json({ data: context });
    }
    catch (err) {
        console.error('[AIController] getContext error:', err.message);
        res.status(500).json({ message: 'Failed to get context.' });
    }
};
exports.getContext = getContext;
//# sourceMappingURL=aiController.js.map