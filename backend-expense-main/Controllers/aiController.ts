import { Request, Response } from 'express';
import path from 'path';
import { processChat, executeConfirmedAction } from '../services/groqService';
import { transcribeAudio } from '../services/transcriptionService';
import {
  getPendingAction,
  clearPendingAction,
  clearConversation,
  updateUserContext,
  getUserContext,
} from '../services/memoryService';
import { User } from '../models/users';

// ─── Rate limiting (simple in-memory, per user) ───────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const maxRequests = 30;

  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

// ─── POST /ai/chat ────────────────────────────────────────────────────────────
export const chat = async (req: Request, res: Response): Promise<void> => {
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
    const user = await User.findById(userId).select('name').lean();

    const aiResponse = await processChat(userId, message.trim(), user?.name);

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
  } catch (err: any) {
    console.error('[AIController] chat error:', err.message);
    res.status(500).json({ message: 'AI service error. Please try again.' });
  }
};

// ─── POST /ai/confirm ─────────────────────────────────────────────────────────
export const confirm = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { confirmed } = req.body;

    const pending = await getPendingAction(userId);
    if (!pending) {
      res.status(404).json({ message: 'No pending action found. Please start a new request.' });
      return;
    }

    await clearPendingAction(userId);

    if (!confirmed) {
      res.status(200).json({
        type: 'cancelled',
        message: 'Action cancelled. What else can I help you with?',
      });
      return;
    }

    const result = await executeConfirmedAction(userId, pending.toolName, pending.args);

    res.status(200).json({
      type: result.type,
      message: result.message,
      ...(result.executedAction && { executedAction: result.executedAction }),
    });
  } catch (err: any) {
    console.error('[AIController] confirm error:', err.message);
    res.status(500).json({ message: 'Failed to execute action. Please try again.' });
  }
};

// ─── POST /ai/voice ───────────────────────────────────────────────────────────
export const voice = async (req: Request, res: Response): Promise<void> => {
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

    const file = (req as any).file;
    if (!file) {
      res.status(400).json({ message: 'Audio file is required' });
      return;
    }

    // Transcribe the audio
    const { text: transcribedText, detectedLanguage } = await transcribeAudio(file.path);

    if (!transcribedText.trim()) {
      res.status(400).json({ message: 'Could not transcribe audio. Please try again.' });
      return;
    }

    // Update detected language in memory
    if (detectedLanguage) {
      await updateUserContext(userId, { preferredLanguage: detectedLanguage });
    }

    // Process the transcribed text through AI
    const user = await User.findById(userId).select('name').lean();
    const aiResponse = await processChat(userId, transcribedText, user?.name);

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
  } catch (err: any) {
    console.error('[AIController] voice error:', err.message);
    res.status(500).json({ message: 'Voice processing error. Please try again.' });
  }
};

// ─── DELETE /ai/conversation ──────────────────────────────────────────────────
export const resetConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await clearConversation(userId);
    res.status(200).json({ message: 'Conversation history cleared.' });
  } catch (err: any) {
    console.error('[AIController] reset error:', err.message);
    res.status(500).json({ message: 'Failed to clear conversation.' });
  }
};

// ─── GET /ai/context ──────────────────────────────────────────────────────────
export const getContext = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const context = await getUserContext(userId);
    res.status(200).json({ data: context });
  } catch (err: any) {
    console.error('[AIController] getContext error:', err.message);
    res.status(500).json({ message: 'Failed to get context.' });
  }
};
