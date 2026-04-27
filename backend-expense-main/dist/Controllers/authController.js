"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const signAccessToken = (id, email) => jsonwebtoken_1.default.sign({ userInfo: { id, email } }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
const signRefreshToken = (id, email) => jsonwebtoken_1.default.sign({ userInfo: { id, email } }, process.env.REFRESH_TOKEN, { expiresIn: '7d' });
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const duplicatedEmail = await users_1.User.findOne({ email });
        if (duplicatedEmail) {
            // ✅ Bug fix: .json() manquait dans le code original
            return res.status(409).json({ message: 'Email already in use' });
        }
        const hashedPass = await bcrypt_1.default.hash(password, 10);
        await users_1.User.create({
            name,
            email,
            password: hashedPass
        });
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const foundUser = await users_1.User.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt_1.default.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }
        const id = foundUser._id.toString();
        const accessToken = signAccessToken(id, foundUser.email);
        const refreshToken = signRefreshToken(id, foundUser.email);
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // ✅ Bug fix: process.env.NODE_ENV (pas process.env)
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ accessToken, id, email: foundUser.email });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const refreshToken = cookies.jwt;
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Forbidden' });
        const { userInfo } = decoded;
        const foundUser = await users_1.User.findById(userInfo.id);
        if (!foundUser)
            return res.status(403).json({ message: 'Unauthorized' });
        const accessToken = signAccessToken(foundUser._id.toString(), foundUser.email);
        res.json({ accessToken });
    });
};
exports.refresh = refresh;
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.sendStatus(204);
    // ✅ Bug fix: clearCookies → clearCookie
    res.clearCookie('jwt', { httpOnly: true });
    return res.json({ message: 'User logged out' });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map