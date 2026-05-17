import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function transcribeAudio(filePath: string): Promise<{
  text: string;
  detectedLanguage?: string;
}> {
  const ext = path.extname(filePath).toLowerCase();
  const supportedFormats = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm', '.ogg', '.flac'];

  if (!supportedFormats.includes(ext)) {
    throw new Error(`Unsupported audio format: ${ext}. Supported: ${supportedFormats.join(', ')}`);
  }

  const fileStream = fs.createReadStream(filePath);

  const transcription = await groq.audio.transcriptions.create({
    file: fileStream,
    model: 'whisper-large-v3-turbo',
    response_format: 'verbose_json',
    temperature: 0.2,
    // Bias Whisper toward English and French; it will still detect Arabic if spoken
    prompt: 'English or French. Finance app: expense, income, transaction, goal, balance, budget, dépense, revenu, objectif.',
  });

  // Clean up uploaded file after transcription
  try {
    fs.unlinkSync(filePath);
  } catch {
    // Non-critical cleanup failure
  }

  return {
    text: (transcription as any).text || '',
    detectedLanguage: (transcription as any).language || undefined,
  };
}
