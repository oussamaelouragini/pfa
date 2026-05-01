import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/users';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
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