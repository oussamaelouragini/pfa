import { Request, Response } from "express";
export declare const getTransactionById: (req: Request, res: Response) => Promise<void>;
export declare const getTransactions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTransaction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTransaction: (req: Request, res: Response) => Promise<void>;
export declare const deleteTransaction: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=transactionController.d.ts.map