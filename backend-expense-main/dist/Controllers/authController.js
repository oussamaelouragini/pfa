"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.forgotPassword = exports.googleSignIn = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const categorie_1 = require("../models/categorie");
const google_auth_library_1 = require("google-auth-library");
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
let googleClient = null;
function getGoogleClient() {
    if (googleClient)
        return googleClient;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID)
        return null;
    googleClient = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
    return googleClient;
}
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
        if (!foundUser.password) {
            return res.status(401).json({ message: 'This account uses Google Sign-In. Please sign in with Google.' });
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
const googleSignIn = async (req, res) => {
    const { idToken, platform } = req.body;
    console.log('[GoogleSignIn] ====== START ======');
    console.log('[GoogleSignIn] Request body:', JSON.stringify(req.body));
    console.log('[GoogleSignIn] Platform:', platform);
    // ── 1. Validate request body ──────────────────────────────────────────────
    if (!idToken) {
        console.warn('[GoogleSignIn] Missing idToken in request body');
        return res.status(400).json({ message: 'ID token is required' });
    }
    console.log('[GoogleSignIn] idToken received (first 50 chars):', idToken.substring(0, 50) + '...');
    // ── 2. Verify JWT secrets are configured ──────────────────────────────────
    if (!process.env.ACCESS_OTP_SECRET) {
        console.error('[GoogleSignIn] ACCESS_OTP_SECRET is not set in .env');
        return res.status(500).json({ message: 'Server configuration error: missing JWT secret' });
    }
    if (!process.env.REFRESH_OTP_SECRET) {
        console.error('[GoogleSignIn] REFRESH_OTP_SECRET is not set in .env');
        return res.status(500).json({ message: 'Server configuration error: missing refresh secret' });
    }
    console.log('[GoogleSignIn] JWT secrets: OK');
    try {
        // ── 3. Get Google OAuth client ──────────────────────────────────────────
        const client = getGoogleClient();
        if (!client) {
            console.error('[GoogleSignIn] Google OAuth client not configured — GOOGLE_CLIENT_ID missing from .env');
            return res.status(500).json({ message: 'Google OAuth not configured on server' });
        }
        console.log('[GoogleSignIn] OAuth2Client created');
        // ── 4. Verify the ID token ──────────────────────────────────────────────
        const audiences = [
            process.env.GOOGLE_WEB_CLIENT_ID,
            process.env.GOOGLE_ANDROID_CLIENT_ID,
            process.env.GOOGLE_CLIENT_ID,
        ].filter(Boolean);
        console.log('[GoogleSignIn] verifyIdToken audiences:', JSON.stringify(audiences));
        console.log('[GoogleSignIn] Calling client.verifyIdToken...');
        const ticket = await client.verifyIdToken({
            idToken,
            audience: audiences,
        });
        console.log('[GoogleSignIn] verifyIdToken succeeded');
        const payload = ticket.getPayload();
        console.log('[GoogleSignIn] Token payload:', JSON.stringify(payload, null, 2));
        if (!payload) {
            console.warn('[GoogleSignIn] Token payload is empty/undefined');
            return res.status(400).json({ message: 'Invalid Google token: empty payload' });
        }
        if (!payload.email) {
            console.warn('[GoogleSignIn] Token payload missing email field');
            return res.status(400).json({ message: 'Invalid Google token: no email in payload' });
        }
        // ── 5. Extract user info from payload ───────────────────────────────────
        const googleEmail = payload.email;
        const googleName = String(payload.name || googleEmail.split('@')[0]);
        console.log('[GoogleSignIn] Extracted — email:', googleEmail, 'name:', googleName);
        // ── 6. Look up existing user ────────────────────────────────────────────
        console.log('[GoogleSignIn] Checking for existing user with email:', googleEmail);
        const existingUser = await users_1.User.findOne({ email: googleEmail });
        console.log('[GoogleSignIn] User lookup result:', existingUser ? `FOUND (id=${existingUser._id})` : 'NOT FOUND');
        if (existingUser) {
            console.log('[GoogleSignIn] Existing user — generating JWT tokens...');
            const id = existingUser._id.toString();
            const accessToken = signAccessToken(id, existingUser.email);
            const refreshToken = signRefreshToken(id, existingUser.email);
            console.log('[GoogleSignIn] JWT tokens generated — accessToken:', accessToken.substring(0, 30) + '...');
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            console.log('[GoogleSignIn] ====== SUCCESS (existing user) ======');
            return res.status(200).json({
                token: accessToken,
                refreshToken,
                user: {
                    id,
                    email: existingUser.email,
                    name: existingUser.name,
                },
            });
        }
        // ── 7. Create new user ──────────────────────────────────────────────────
        console.log('[GoogleSignIn] Creating new user...');
        const newUser = await users_1.User.create({
            name: googleName,
            email: googleEmail,
            authProvider: 'google',
        });
        console.log('[GoogleSignIn] New user created — id:', newUser._id, 'email:', newUser.email);
        // ── 8. Seed default categories ─────────────────────────────────────────
        console.log('[GoogleSignIn] Seeding default categories...');
        await seedDefaultCategories(newUser._id.toString());
        console.log('[GoogleSignIn] Default categories seeded');
        // ── 9. Generate JWT tokens for new user ─────────────────────────────────
        const newId = newUser._id.toString();
        const newAccessToken = signAccessToken(newId, newUser.email);
        const newRefreshToken = signRefreshToken(newId, newUser.email);
        console.log('[GoogleSignIn] JWT tokens generated for new user');
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        console.log('[GoogleSignIn] ====== SUCCESS (new user) ======');
        return res.status(201).json({
            token: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: newId,
                email: newUser.email,
                name: newUser.name,
            },
        });
    }
    catch (error) {
        console.error('[GoogleSignIn] ====== ERROR ======');
        console.error('[GoogleSignIn] Error name:', error.name);
        console.error('[GoogleSignIn] Error message:', error.message);
        console.error('[GoogleSignIn] Error stack:', error.stack);
        if (error.code)
            console.error('[GoogleSignIn] Error code:', error.code);
        if (error.status)
            console.error('[GoogleSignIn] Error status:', error.status);
        if (error.response?.data)
            console.error('[GoogleSignIn] Error response data:', error.response.data);
        return res.status(500).json({
            message: 'Google authentication failed',
            error: error.message,
        });
    }
};
exports.googleSignIn = googleSignIn;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const foundUser = await users_1.User.findOne({ email });
        if (!foundUser) {
            return res.status(200).json({ message: 'If an account with that email exists, reset instructions have been sent.' });
        }
        const resetToken = jsonwebtoken_1.default.sign({ userInfo: { id: foundUser._id.toString(), email: foundUser.email } }, process.env.ACCESS_OTP_SECRET, { expiresIn: '15m' });
        foundUser.password = await bcrypt_1.default.hash(resetToken.slice(-12), 10);
        await foundUser.save();
        console.log(`[ForgotPassword] Reset token for ${email}: ${resetToken}`);
        console.log(`[ForgotPassword] In production, this would be emailed to ${email}`);
        return res.status(200).json({ message: 'If an account with that email exists, reset instructions have been sent.' });
    }
    catch (err) {
        console.error('[ForgotPassword] Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.forgotPassword = forgotPassword;
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