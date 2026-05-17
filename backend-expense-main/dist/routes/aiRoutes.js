"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const JWT_1 = __importDefault(require("../middleware/JWT"));
const aiController_1 = require("../Controllers/aiController");
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads', 'audio');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const audioStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const uniqueName = `audio_${Date.now()}_${Math.random().toString(36).slice(2)}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const audioUpload = (0, multer_1.default)({
    storage: audioStorage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max (Groq limit)
    fileFilter: (_req, file, cb) => {
        const allowed = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/flac', 'audio/x-m4a', 'audio/m4a'];
        if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|mp4|wav|webm|ogg|flac|m4a|mpeg)$/i)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid audio format'));
        }
    },
});
// All AI routes require authentication
router.use(JWT_1.default);
router.post('/chat', aiController_1.chat);
router.post('/confirm', aiController_1.confirm);
router.post('/voice', audioUpload.single('audio'), aiController_1.voice);
router.delete('/conversation', aiController_1.resetConversation);
router.get('/context', aiController_1.getContext);
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map