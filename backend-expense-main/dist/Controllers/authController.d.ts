import { Request, Response } from 'express';
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
export declare const register: (req: Request<{}, {}, RegisterBody>, res: Response) => Promise<Response>;
export declare const login: (req: Request<{}, {}, LoginBody>, res: Response) => Promise<Response>;
export declare const googleSignIn: (req: Request<{}, {}, GoogleBody>, res: Response) => Promise<Response>;
export declare const forgotPassword: (req: Request<{}, {}, ForgotPasswordBody>, res: Response) => Promise<Response>;
export declare const refresh: (req: Request, res: Response) => void;
export declare const logout: (req: Request, res: Response) => Response;
export {};
//# sourceMappingURL=authController.d.ts.map