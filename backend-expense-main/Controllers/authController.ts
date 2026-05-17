import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/users';
import { Category } from '../models/categorie';
import { OAuth2Client } from 'google-auth-library';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface GoogleBody {
  idToken: string;
  platform: string;
}

interface ForgotPasswordBody {
  email: string;
}

interface UserJwtPayload extends JwtPayload {
  userInfo: {
    id: string;
    email: string;
  };
}

const signAccessToken = (id: string, email: string): string =>
  jwt.sign(
    { userInfo: { id, email } },
    process.env.ACCESS_OTP_SECRET as string,
    { expiresIn: '1h' }
  );

const signRefreshToken = (id: string, email: string): string =>
  jwt.sign(
    { userInfo: { id, email } },
    process.env.REFRESH_OTP_SECRET as string,
    { expiresIn: '7d' }
  );

const DEFAULT_CATEGORIES = [
  { name: 'Shopping', icon: 'bag-outline', color: '#3B5BDB', type: 'expense' as const },
  { name: 'Food', icon: 'restaurant-outline', color: '#F59E0B', type: 'expense' as const },
  { name: 'Transport', icon: 'car-outline', color: '#3B82F6', type: 'expense' as const },
  { name: 'Rent', icon: 'home-outline', color: '#22C55E', type: 'expense' as const },
  { name: 'Health', icon: 'medical-outline', color: '#F43F5E', type: 'expense' as const },
  { name: 'Salary', icon: 'cash-outline', color: '#16A34A', type: 'income' as const },
];

const seedDefaultCategories = async (userId: string) => {
  try {
    const existing = await Category.countDocuments({ userId });
    if (existing === 0) {
      await Category.insertMany(
        DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId, isDefault: true }))
      );
    }
  } catch (err) {
    console.error('Error seeding default categories:', err);
  }
};

let googleClient: OAuth2Client | null = null;

function getGoogleClient(): OAuth2Client | null {
  if (googleClient) return googleClient;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  if (!GOOGLE_CLIENT_ID) return null;
  googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
  return googleClient;
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const duplicatedEmail = await User.findOne({ email });
    if (duplicatedEmail) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!foundUser.password) {
      return res.status(401).json({ message: 'This account uses Google Sign-In. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const googleSignIn = async (
  req: Request<{}, {}, GoogleBody>,
  res: Response
): Promise<Response> => {
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
    ].filter(Boolean) as string[];

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
    const googleEmail = payload.email!;
    const googleName = String(payload.name || googleEmail.split('@')[0]);
    console.log('[GoogleSignIn] Extracted — email:', googleEmail, 'name:', googleName);

    // ── 6. Look up existing user ────────────────────────────────────────────
    console.log('[GoogleSignIn] Checking for existing user with email:', googleEmail);
    const existingUser = await User.findOne({ email: googleEmail });
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
    const newUser = await User.create({
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

  } catch (error: any) {
    console.error('[GoogleSignIn] ====== ERROR ======');
    console.error('[GoogleSignIn] Error name:', error.name);
    console.error('[GoogleSignIn] Error message:', error.message);
    console.error('[GoogleSignIn] Error stack:', error.stack);
    if (error.code) console.error('[GoogleSignIn] Error code:', error.code);
    if (error.status) console.error('[GoogleSignIn] Error status:', error.status);
    if (error.response?.data) console.error('[GoogleSignIn] Error response data:', error.response.data);

    return res.status(500).json({
      message: 'Google authentication failed',
      error: error.message,
    });
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response
): Promise<Response> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(200).json({ message: 'If an account with that email exists, reset instructions have been sent.' });
    }

    const resetToken = jwt.sign(
      { userInfo: { id: foundUser._id.toString(), email: foundUser.email } },
      process.env.ACCESS_OTP_SECRET as string,
      { expiresIn: '15m' }
    );

    foundUser.password = await bcrypt.hash(resetToken.slice(-12), 10);
    await foundUser.save();

    console.log(`[ForgotPassword] Reset token for ${email}: ${resetToken}`);
    console.log(`[ForgotPassword] In production, this would be emailed to ${email}`);

    return res.status(200).json({ message: 'If an account with that email exists, reset instructions have been sent.' });
  } catch (err) {
    console.error('[ForgotPassword] Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = (req: Request, res: Response): void => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const refreshToken: string = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_OTP_SECRET as string,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });

      const { userInfo } = decoded as UserJwtPayload;
      const foundUser = await User.findById(userInfo.id);

      if (!foundUser) return res.status(403).json({ message: 'Unauthorized' });

      const accessToken = signAccessToken(
        foundUser._id.toString(),
        foundUser.email
      );

      res.json({ accessToken });
    }
  );
};

export const logout = (req: Request, res: Response): Response => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie('jwt', { httpOnly: true });

  return res.json({ message: 'User logged out' });
};
