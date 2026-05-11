import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AI_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'}/ai`;

async function getAuthHeader() {
  const token = await AsyncStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${AI_BASE_URL}/chat`,
    { message },
    { headers, timeout: 30_000 }
  );
  return response.data;
}

export async function confirmAction(confirmed: boolean): Promise<ChatResponse> {
  const headers = await getAuthHeader();
  const response = await axios.post(
    `${AI_BASE_URL}/confirm`,
    { confirmed },
    { headers, timeout: 15_000 }
  );
  return response.data;
}

export async function sendVoiceMessage(audioUri: string, mimeType = 'audio/m4a'): Promise<VoiceResponse> {
  const headers = await getAuthHeader();

  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: mimeType,
    name: `recording_${Date.now()}.m4a`,
  } as any);

  const response = await axios.post(`${AI_BASE_URL}/voice`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60_000,
  });
  return response.data;
}

export async function resetConversation(): Promise<void> {
  const headers = await getAuthHeader();
  await axios.delete(`${AI_BASE_URL}/conversation`, { headers });
}

export async function getAIContext(): Promise<any> {
  const headers = await getAuthHeader();
  const response = await axios.get(`${AI_BASE_URL}/context`, { headers });
  return response.data;
}
