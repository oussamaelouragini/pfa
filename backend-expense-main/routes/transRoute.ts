import { Router } from "express";
import { deleteTransaction, getTransactions, getTransactionById, updateTransaction } from "../Controllers/transactionController";
import { createTransaction } from "../Controllers/transactionController";
import verifyJWT from "../middleware/JWT";

const router = Router();

router.get("/", verifyJWT, getTransactions);
router.get("/:id", verifyJWT, getTransactionById);
router.post("/", verifyJWT, createTransaction);
router.patch("/:id", verifyJWT, updateTransaction);
router.delete("/:id", verifyJWT, deleteTransaction);

export default router;