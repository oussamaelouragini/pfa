"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    // ✅ Bug fix: req.headers.authorization était dupliqué (|| avec lui-même)
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];
    // ✅ Guard ajouté
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const secret = process.env.ACCESS_TOKEN;
    if (!secret) {
        res.status(500).json({ message: 'Server misconfiguration' });
        return;
    }
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        req.user = decoded.userInfo;
        next();
    });
};
exports.default = verifyJWT;
//# sourceMappingURL=JWT.js.map