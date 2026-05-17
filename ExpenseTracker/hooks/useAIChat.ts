import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { nanoid } from 'nanoid/non-secure';
import {
  sendMessage,
  confirmAction,
  sendVoiceMessage,
  resetConversation,
  AIMessage,
  ChatResponse,
} from '../services/aiService';
import { useVoiceRecorder } from './useVoiceRecorder';
import { useTransactionStore } from '@/features/transactions/store/transactionStore';
import { useGoalsStore } from '@/features/goals/store/goalsStore';

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage extends AIMessage {
  status?: MessageStatus;
}

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI financial copilot. I can help you manage expenses, analyze your spending, and reach your financial goals. How can I help you today? 💰",
      type: 'message',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const voice = useVoiceRecorder();
  const [isRecording, setIsRecording] = useState(false);
  const [hasPendingAction, setHasPendingAction] = useState(false);
  const pendingMessageIdRef = useRef<string | null>(null);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id'>): string => {
    const id = nanoid();
    setMessages((prev) => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const handleAIResponse = useCallback(
    (response: ChatResponse, userMsgId?: string) => {
      if (userMsgId) {
        updateMessage(userMsgId, { status: 'sent' });
      }

      const assistantMsg: Omit<ChatMessage, 'id'> = {
        role: 'assistant',
        content: response.message,
        type: response.type,
        timestamp: new Date(),
        status: 'sent',
      };

      if (response.type === 'confirmation_required' && response.pendingAction) {
        assistantMsg.pendingAction = response.pendingAction;
        setHasPendingAction(true);
      } else if (response.type === 'action_completed' && response.executedAction) {
        assistantMsg.executedAction = response.executedAction;
        setHasPendingAction(false);
        // Refresh all data stores so the UI reflects what the AI just did
        useTransactionStore.getState().fetchTransactions();
        useGoalsStore.getState().fetchGoals();
      } else {
        setHasPendingAction(false);
      }

      const msgId = addMessage(assistantMsg);
      if (response.type === 'confirmation_required') {
        pendingMessageIdRef.current = msgId;
      }
    },
    [addMessage, updateMessage]
  );

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsgId = addMessage({
        role: 'user',
        content: text.trim(),
        type: 'message',
        timestamp: new Date(),
        status: 'sending',
      });

      setIsLoading(true);
      try {
        const response = await sendMessage(text.trim());
        handleAIResponse(response, userMsgId);
      } catch (err: any) {
        updateMessage(userMsgId, { status: 'error' });
        addMessage({
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please check your connection and try again.',
          type: 'error',
          timestamp: new Date(),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, updateMessage, handleAIResponse]
  );

  const confirm = useCallback(
    async (confirmed: boolean) => {
      if (isLoading) return;

      setIsLoading(true);
      setHasPendingAction(false);
      try {
        const response = await confirmAction(confirmed);
        handleAIResponse(response);
      } catch {
        addMessage({
          role: 'assistant',
          content: 'Failed to process your confirmation. Please try again.',
          type: 'error',
          timestamp: new Date(),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, addMessage, handleAIResponse]
  );

  const startVoiceRecording = useCallback(async () => {
    if (isRecording || isLoading) return;

    const hasPermission = await voice.requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Microphone access is needed for voice input.');
      return;
    }

    try {
      await voice.startRecording();
      setIsRecording(true);
    } catch {
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  }, [isRecording, isLoading, voice]);

  const stopVoiceRecording = useCallback(async () => {
    if (!isRecording) return;

    setIsRecording(false);
    setIsLoading(true);

    try {
      const audioUri = await voice.stopRecording();
      if (!audioUri) {
        setIsLoading(false);
        return;
      }

      // Show "transcribing..." placeholder
      const placeholderId = addMessage({
        role: 'user',
        content: '🎤 Transcribing voice...',
        type: 'message',
        timestamp: new Date(),
        status: 'sending',
      });

      const response = await sendVoiceMessage(audioUri);

      // Replace placeholder with actual transcription
      updateMessage(placeholderId, {
        content: response.transcription,
        status: 'sent',
      });

      handleAIResponse(response, placeholderId);
    } catch (e) {
      console.error("[Voice] Error processing voice message:", e);
      addMessage({
        role: 'assistant',
        content: 'Could not process voice message. Please try typing instead.',
        type: 'error',
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [isRecording, addMessage, updateMessage, handleAIResponse]);

  const clearChat = useCallback(async () => {
    try {
      await resetConversation();
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Conversation cleared. How can I help you today? 💰",
          type: 'message',
          timestamp: new Date(),
        },
      ]);
      setHasPendingAction(false);
    } catch {
      Alert.alert('Error', 'Failed to clear conversation.');
    }
  }, []);

  return {
    messages,
    isLoading,
    isRecording,
    hasPendingAction,
    send,
    confirm,
    startVoiceRecording,
    stopVoiceRecording,
    clearChat,
  };
}
