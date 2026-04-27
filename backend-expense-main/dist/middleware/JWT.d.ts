import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}
declare const verifyJWT: (req: Request, res: Response, next: NextFunction) => void;
export default verifyJWT;
//# sourceMappingURL=JWT.d.ts.map