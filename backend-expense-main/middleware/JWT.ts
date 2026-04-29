// middleware/verifyJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface UserJwtPayload extends JwtPayload {
  userInfo: {
    id:    string;
    email: string;
  };
}

// Étend l'interface Request d'Express pour y ajouter req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id:    string;
        email: string;
      };
    }
  }
}

const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {

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
  const secret = process.env.ACCESS_OTP_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'Server misconfiguration' });
    return;
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    req.user = (decoded as UserJwtPayload).userInfo;
    next();
  });
};

export default verifyJWT;