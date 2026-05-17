"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterError = exports.uploadAvatarMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        const dir = path_1.default.join(__dirname, "..", "uploads", "avatars");
        fs_1.default.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = `avatar_${Date.now()}_${crypto_1.default.randomBytes(4).toString("hex")}${ext}`;
        cb(null, name);
    },
});
const fileFilter = (_req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
        cb(new Error("Invalid image format. Allowed: JPEG, PNG, WebP"));
        return;
    }
    cb(null, true);
};
exports.uploadAvatarMiddleware = (0, multer_1.default)({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
}).single("avatar");
exports.MulterError = multer_1.default.MulterError;
//# sourceMappingURL=upload.js.map