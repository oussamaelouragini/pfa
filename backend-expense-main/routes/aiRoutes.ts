import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import verifyJWT from '../middleware/JWT';
import { chat, confirm, voice, resetConversation, getContext } from '../Controllers/aiController';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'audio');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueName = `audio_${Date.now()}_${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const audioUpload = multer({
  storage: audioStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max (Groq limit)
  fileFilter: (_req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/flac', 'audio/x-m4a', 'audio/m4a'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|mp4|wav|webm|ogg|flac|m4a|mpeg)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format'));
    }
  },
});

// All AI routes require authentication
router.use(verifyJWT);

router.post('/chat', chat);
router.post('/confirm', confirm);
router.post('/voice', audioUpload.single('audio'), voice);
router.delete('/conversation', resetConversation);
router.get('/context', getContext);

export default router;
