"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactions = exports.getTransactionById = void 0;
const transaction_1 = require("../models/transaction");
const getTransactionById = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const transaction = await transaction_1.Transaction.findOne({ _id: id, userId }).populate("categoryId", "name");
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        res.status(200).json({ data: transaction });
    }
    catch (error) {
        console.error("❌ Get transaction by ID error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getTransactionById = getTransactionById;
const getTransactions = async (req, res) => {
    try {
        const { type, categoryId, startDate, endDate, page = 1, limit = 10, } = req.query;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const filter = {
            userId,
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
                .populate("categoryId", "name")
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
        console.error("❌ Get transactions error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getTransactions = getTransactions;
const createTransaction = async (req, res) => {
    try {
        const { type, categoryId, amount, date, note, isRecurring, } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!type || !amount) {
            return res
                .status(400)
                .json({ message: "type and amount are required" });
        }
        // Handle categoryId - could be ObjectId string or category name
        let finalCategoryId = null;
        if (categoryId && typeof categoryId === 'string') {
            // Check if it's a valid ObjectId
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(categoryId);
            if (isValidObjectId) {
                finalCategoryId = categoryId;
            }
            else {
                // Assume it's a category name, look it up
                const { Category } = require("../models/categorie");
                const category = await Category.findOne({
                    userId,
                    name: { $regex: new RegExp(`^${categoryId}$`, 'i') }
                });
                if (category) {
                    finalCategoryId = category._id;
                }
                else {
                    console.warn(`Category "${categoryId}" not found for user ${userId}`);
                }
            }
        }
        const transaction = new transaction_1.Transaction({
            userId,
            type,
            categoryId: finalCategoryId,
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
        console.error("❌ Create transaction error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.createTransaction = createTransaction;
const updateTransaction = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const transactionId = Array.isArray(id) ? id[0] : id;
        const updates = req.body;
        // Validate ObjectId
        if (!transactionId || !/^[0-9a-fA-F]{24}$/.test(transactionId)) {
            res.status(400).json({ message: "Invalid transaction ID" });
            return;
        }
        const allowedFields = ["type", "categoryId", "amount", "date", "note", "isRecurring"];
        const invalidFields = Object.keys(updates).filter(k => !allowedFields.includes(k));
        if (invalidFields.length > 0) {
            res.status(400).json({ message: `Invalid fields: ${invalidFields.join(", ")}` });
            return;
        }
        // Handle categoryId if present
        if (updates.categoryId && typeof updates.categoryId === 'string') {
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(updates.categoryId);
            if (!isValidObjectId) {
                const { Category } = require("../models/categorie");
                const category = await Category.findOne({
                    userId,
                    name: { $regex: new RegExp(`^${updates.categoryId}$`, 'i') }
                });
                if (category) {
                    updates.categoryId = category._id;
                }
                else {
                    delete updates.categoryId; // Remove invalid category
                }
            }
        }
        if (updates.date) {
            updates.date = new Date(updates.date);
        }
        const transaction = await transaction_1.Transaction.findById(transactionId);
        if (!transaction) {
            res.status(404).json({ message: "Transaction not found" });
            return;
        }
        if (transaction.userId.toString() !== userId) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const updated = await transaction_1.Transaction.findByIdAndUpdate(transactionId, { $set: updates }, { new: true, runValidators: true });
        res.status(200).json({ message: "Transaction updated", data: updated });
    }
    catch (error) {
        console.error("❌ Update transaction error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const transactionId = Array.isArray(id) ? id[0] : id;
        // Validate ObjectId
        if (!transactionId || !/^[0-9a-fA-F]{24}$/.test(transactionId)) {
            res.status(400).json({ message: "Invalid transaction ID" });
            return;
        }
        const transaction = await transaction_1.Transaction.findById(transactionId);
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
        console.error("❌ Delete transaction error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transactionController.js.map