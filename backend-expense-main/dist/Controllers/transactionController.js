"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = void 0;
const transaction_1 = require("../models/transaction");
const getTransactions = async (req, res) => {
    try {
        const { type, categoryId, startDate, endDate, page = 1, limit = 10, } = req.query;
        // 🔐 IMPORTANT: récupérer userId depuis JWT (middleware)
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const filter = {
            userId, // ✅ filtrer par utilisateur
        };
        if (type)
            filter.type = type;
        if (categoryId)
            filter.categoryId = categoryId;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate)
                filter.date.$gte = new Date(startDate);
            if (endDate)
                filter.date.$lte = new Date(endDate);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [transactions, total] = await Promise.all([
            transaction_1.Transaction.find(filter)
                .populate("categoryId", "name") // 🎯 optionnel (affiche nom catégorie)
                .sort({ date: -1 })
                .skip(skip)
                .limit(Number(limit)),
            transaction_1.Transaction.countDocuments(filter),
        ]);
        res.status(200).json({
            data: transactions,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getTransactions = getTransactions;
const createTransaction = async (req, res) => {
    try {
        const { type, categoryId, amount, date, note, isRecurring, } = req.body;
        // 🔐 récupérer user depuis JWT
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // ✅ validation adaptée à ton schema
        if (!type || !amount) {
            return res
                .status(400)
                .json({ message: "type and amount are required" });
        }
        const transaction = new transaction_1.Transaction({
            userId, // ✅ obligatoire
            type,
            categoryId: categoryId || null,
            amount,
            date: date ? new Date(date) : new Date(),
            note,
            isRecurring: isRecurring || false,
        });
        const saved = await transaction.save();
        res.status(201).json({
            message: "Transaction created",
            data: saved,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.createTransaction = createTransaction;
const updateTransaction = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const updates = req.body;
        // Champs autorisés à modifier
        const allowedFields = ["type", "category", "amount", "date", "note"];
        const invalidFields = Object.keys(updates).filter(k => !allowedFields.includes(k));
        if (invalidFields.length > 0) {
            res.status(400).json({ message: `Invalid fields: ${invalidFields.join(", ")}` });
            return;
        }
        const transaction = await transaction_1.Transaction.findById(id);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        if (transaction.userId.toString() !== userId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const updated = await transaction_1.Transaction.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
        res.status(200).json({ message: "Transaction updated", data: updated });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const transaction = await transaction_1.Transaction.findById(id);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        if (transaction.userId.toString() !== userId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        await transaction.deleteOne();
        res.status(200).json({ message: "Transaction deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transactionController.js.map