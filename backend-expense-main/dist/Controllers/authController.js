"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const categorie_1 = require("../models/categorie");
const signAccessToken = (id, email) => jsonwebtoken_1.default.sign({ userInfo: { id, email } }, process.env.ACCESS_OTP_SECRET, { expiresIn: '1h' });
const signRefreshToken = (id, email) => jsonwebtoken_1.default.sign({ userInfo: { id, email } }, process.env.REFRESH_OTP_SECRET, { expiresIn: '7d' });
const DEFAULT_CATEGORIES = [
    { name: 'Shopping', icon: 'bag-outline', color: '#3B5BDB', type: 'expense' },
    { name: 'Food', icon: 'restaurant-outline', color: '#F59E0B', type: 'expense' },
    { name: 'Transport', icon: 'car-outline', color: '#3B82F6', type: 'expense' },
    { name: 'Rent', icon: 'home-outline', color: '#22C55E', type: 'expense' },
    { name: 'Health', icon: 'medical-outline', color: '#F43F5E', type: 'expense' },
    { name: 'Salary', icon: 'cash-outline', color: '#16A34A', type: 'income' },
];
const seedDefaultCategories = async (userId) => {
    try {
        const existing = await categorie_1.Category.countDocuments({ userId });
        if (existing === 0) {
            await categorie_1.Category.insertMany(DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId, isDefault: true })));
        }
    }
    catch (err) {
        console.error('Error seeding default categories:', err);
    }
};
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const duplicatedEmail = await users_1.User.findOne({ email });
        if (duplicatedEmail) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const hashedPass = await bcrypt_1.default.hash(password, 10);
        const newUser = await users_1.User.create({
            name,
            email,
            password: hashedPass
        });
        await seedDefaultCategories(newUser._id.toString());
        const id = newUser._id.toString();
        const accessToken = signAccessToken(id, newUser.email);
        const refreshToken = signRefreshToken(id, newUser.email);
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
            message: 'User created successfully',
            accessToken,
            id,
            email: newUser.email,
            name: newUser.name
        });
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
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ accessToken, id, email: foundUser.email, name: foundUser.name });
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
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_OTP_SECRET, async (err, decoded) => {
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
    res.clearCookie('jwt', { httpOnly: true });
    return res.json({ message: 'User logged out' });
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map