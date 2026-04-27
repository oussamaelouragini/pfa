import { Router } from "express";
import { deleteTransaction, getTransactions, updateTransaction } from "../Controllers/transactionController";
import { createTransaction } from "../Controllers/transactionController";
import verifyJWT from "../middleware/JWT";

const router = Router();

// GET /api/transactions
router.get("/", verifyJWT,getTransactions);
router.post("/create",verifyJWT, createTransaction);
router.patch("/update/:id",verifyJWT,updateTransaction);
router.delete("/delete/:id",verifyJWT,deleteTransaction);

export default router;