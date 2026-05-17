"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = transcribeAudio;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
async function transcribeAudio(filePath) {
    const ext = path_1.default.extname(filePath).toLowerCase();
    const supportedFormats = ['.mp3', '.mp4', '.mpeg', '.mpga', '.m4a', '.wav', '.webm', '.ogg', '.flac'];
    if (!supportedFormats.includes(ext)) {
        throw new Error(`Unsupported audio format: ${ext}. Supported: ${supportedFormats.join(', ')}`);
    }
    const fileStream = fs_1.default.createReadStream(filePath);
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
        fs_1.default.unlinkSync(filePath);
    }
    catch {
        // Non-critical cleanup failure
    }
    return {
        text: transcription.text || '',
        detectedLanguage: transcription.language || undefined,
    };
}
//# sourceMappingURL=transcriptionService.js.map