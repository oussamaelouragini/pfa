import apiClient from '@/lib/apiClient';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'message' | 'confirmation_required' | 'action_completed' | 'cancelled' | 'error';
  timestamp: Date;
  pendingAction?: {
    toolName: string;
    confirmationMessage: string;
  };
  executedAction?: {
    toolName: string;
    result: any;
  };
}

export interface ChatResponse {
  type: 'message' | 'confirmation_required' | 'action_completed' | 'error';
  message: string;
  pendingAction?: {
    toolName: string;
    confirmationMessage: string;
  };
  executedAction?: any;
}

export interface VoiceResponse extends ChatResponse {
  transcription: string;
  detectedLanguage?: string;
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  const response = await apiClient.post('/ai/chat', { message }, { timeout: 30_000 });
  return response.data;
}

export async function confirmAction(confirmed: boolean): Promise<ChatResponse> {
  const response = await apiClient.post('/ai/confirm', { confirmed }, { timeout: 15_000 });
  return response.data;
}

export async function sendVoiceMessage(audioUri: string, mimeType = 'audio/m4a'): Promise<VoiceResponse> {
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: mimeType,
    name: `recording_${Date.now()}.m4a`,
  } as any);

  const response = await apiClient.post('/ai/voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000,
  });
  return response.data;
}

export async function resetConversation(): Promise<void> {
  await apiClient.delete('/ai/conversation');
}

export async function getAIContext(): Promise<any> {
  const response = await apiClient.get('/ai/context');
  return response.data;
}
