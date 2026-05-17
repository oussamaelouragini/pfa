"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeTool = executeTool;
const transaction_1 = require("../models/transaction");
const categorie_1 = require("../models/categorie");
const goal_1 = require("../models/goal");
const analyticsService_1 = require("../services/analyticsService");
const predictionService_1 = require("../services/predictionService");
async function resolveCategoryId(userId, categoryName) {
    if (!categoryName)
        return null;
    const cat = await categorie_1.Category.findOne({
        userId,
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') },
    });
    return cat ? cat._id.toString() : null;
}
async function executeTool(toolName, args, userId) {
    try {
        switch (toolName) {
            // ─── Expense / Income Creation ────────────────────────────────────────
            case 'create_expense': {
                const { amount, categoryName, note, date, isRecurring } = args;
                if (!amount || amount <= 0)
                    return { success: false, error: 'Invalid amount' };
                const categoryId = await resolveCategoryId(userId, categoryName);
                const tx = new transaction_1.Transaction({
                    userId,
                    type: 'expense',
                    amount,
                    categoryId,
                    note: note || '',
                    date: date ? new Date(date) : new Date(),
                    isRecurring: isRecurring || false,
                });
                const saved = await tx.save();
                const populated = await transaction_1.Transaction.findById(saved._id).populate('categoryId', 'name');
                return {
                    success: true,
                    data: {
                        message: 'Expense created successfully',
                        transaction: {
                            id: saved._id,
                            amount: saved.amount,
                            category: populated?.categoryId?.name || categoryName || 'Uncategorized',
                            note: saved.note,
                            date: saved.date.toISOString().split('T')[0],
                            type: 'expense',
                        },
                    },
                };
            }
            case 'create_income': {
                const { amount, categoryName, note, date } = args;
                if (!amount || amount <= 0)
                    return { success: false, error: 'Invalid amount' };
                const categoryId = await resolveCategoryId(userId, categoryName);
                const tx = new transaction_1.Transaction({
                    userId,
                    type: 'income',
                    amount,
                    categoryId,
                    note: note || '',
                    date: date ? new Date(date) : new Date(),
                });
                const saved = await tx.save();
                const populated = await transaction_1.Transaction.findById(saved._id).populate('categoryId', 'name');
                return {
                    success: true,
                    data: {
                        message: 'Income recorded successfully',
                        transaction: {
                            id: saved._id,
                            amount: saved.amount,
                            category: populated?.categoryId?.name || categoryName || 'Uncategorized',
                            note: saved.note,
                            date: saved.date.toISOString().split('T')[0],
                            type: 'income',
                        },
                    },
                };
            }
            // ─── Transaction Update / Delete ──────────────────────────────────────
            case 'update_transaction': {
                const { transactionId, amount, categoryName, note, date, isRecurring } = args;
                if (!transactionId || !/^[0-9a-fA-F]{24}$/.test(transactionId)) {
                    return { success: false, error: 'Invalid transaction ID' };
                }
                const tx = await transaction_1.Transaction.findOne({ _id: transactionId, userId });
                if (!tx)
                    return { success: false, error: 'Transaction not found or access denied' };
                const updates = {};
                if (amount !== undefined)
                    updates.amount = amount;
                if (note !== undefined)
                    updates.note = note;
                if (date !== undefined)
                    updates.date = new Date(date);
                if (isRecurring !== undefined)
                    updates.isRecurring = isRecurring;
                if (categoryName) {
                    const catId = await resolveCategoryId(userId, categoryName);
                    if (catId)
                        updates.categoryId = catId;
                }
                const updated = await transaction_1.Transaction.findByIdAndUpdate(transactionId, { $set: updates }, { new: true }).populate('categoryId', 'name');
                return {
                    success: true,
                    data: {
                        message: 'Transaction updated',
                        transaction: {
                            id: updated?._id,
                            amount: updated?.amount,
                            category: updated?.categoryId?.name || 'Uncategorized',
                            note: updated?.note,
                            date: updated?.date?.toISOString().split('T')[0],
                        },
                    },
                };
            }
            case 'delete_transaction': {
                const { transactionId } = args;
                if (!transactionId || !/^[0-9a-fA-F]{24}$/.test(transactionId)) {
                    return { success: false, error: 'Invalid transaction ID' };
                }
                const tx = await transaction_1.Transaction.findOne({ _id: transactionId, userId });
                if (!tx)
                    return { success: false, error: 'Transaction not found or access denied' };
                await tx.deleteOne();
                return { success: true, data: { message: 'Transaction deleted successfully' } };
            }
            // ─── Transaction Retrieval ────────────────────────────────────────────
            case 'get_transactions': {
                const { type, startDate, endDate, limit = 10, categoryName } = args;
                const filter = { userId };
                if (type)
                    filter.type = type;
                if (startDate || endDate) {
                    filter.date = {};
                    if (startDate)
                        filter.date.$gte = new Date(startDate);
                    if (endDate)
                        filter.date.$lte = new Date(endDate + 'T23:59:59');
                }
                if (categoryName) {
                    const cat = await categorie_1.Category.findOne({
                        userId,
                        name: { $regex: new RegExp(`^${categoryName}$`, 'i') },
                    });
                    if (cat)
                        filter.categoryId = cat._id;
                }
                const transactions = await transaction_1.Transaction.find(filter)
                    .populate('categoryId', 'name')
                    .sort({ date: -1 })
                    .limit(Math.min(Number(limit), 50));
                return {
                    success: true,
                    data: {
                        count: transactions.length,
                        transactions: transactions.map((t) => ({
                            id: t._id,
                            type: t.type,
                            amount: t.amount,
                            category: t.categoryId?.name || 'Uncategorized',
                            note: t.note,
                            date: t.date.toISOString().split('T')[0],
                            isRecurring: t.isRecurring,
                        })),
                    },
                };
            }
            // ─── Analytics ────────────────────────────────────────────────────────
            case 'get_spending_summary': {
                const { period, startDate, endDate } = args;
                const result = await (0, analyticsService_1.getSpendingSummary)(userId, period, startDate, endDate);
                return { success: true, data: result };
            }
            case 'get_category_breakdown': {
                const { period, startDate, endDate } = args;
                const result = await (0, analyticsService_1.getCategoryBreakdown)(userId, period, startDate, endDate);
                return { success: true, data: result };
            }
            case 'compare_periods': {
                const { period1, period2 } = args;
                const result = await (0, analyticsService_1.comparePeriods)(userId, period1, period2);
                return { success: true, data: result };
            }
            case 'detect_anomalies': {
                const result = await (0, analyticsService_1.detectAnomalies)(userId);
                return { success: true, data: result };
            }
            case 'get_financial_overview': {
                const result = await (0, analyticsService_1.getFinancialOverview)(userId);
                return { success: true, data: result };
            }
            // ─── Goals ────────────────────────────────────────────────────────────
            case 'get_goals': {
                const goals = await goal_1.Goal.find({ userId }).populate('category', 'name').sort({ createdAt: -1 });
                return {
                    success: true,
                    data: {
                        count: goals.length,
                        goals: goals.map((g) => ({
                            id: g._id,
                            name: g.name,
                            target: g.target,
                            category: g.category?.name || 'Uncategorized',
                            duration: g.duration,
                            frequency: g.frequency,
                        })),
                    },
                };
            }
            case 'create_goal': {
                const { name, target, categoryName, duration, frequency } = args;
                const catId = await resolveCategoryId(userId, categoryName);
                if (!catId)
                    return { success: false, error: `Category "${categoryName}" not found` };
                const goal = new goal_1.Goal({
                    userId,
                    name,
                    target,
                    category: catId,
                    duration: duration || '1 year',
                    frequency: frequency || 'monthly',
                });
                const saved = await goal.save();
                return {
                    success: true,
                    data: {
                        message: 'Goal created successfully',
                        goal: { id: saved._id, name: saved.name, target: saved.target },
                    },
                };
            }
            case 'update_goal': {
                const { goalId, name, target, categoryName, duration, frequency } = args;
                if (!goalId || !/^[0-9a-fA-F]{24}$/.test(goalId)) {
                    return { success: false, error: 'Invalid goal ID' };
                }
                const goal = await goal_1.Goal.findOne({ _id: goalId, userId });
                if (!goal)
                    return { success: false, error: 'Goal not found or access denied' };
                const updates = {};
                if (name)
                    updates.name = name;
                if (target)
                    updates.target = target;
                if (duration)
                    updates.duration = duration;
                if (frequency)
                    updates.frequency = frequency;
                if (categoryName) {
                    const catId = await resolveCategoryId(userId, categoryName);
                    if (catId)
                        updates.category = catId;
                }
                await goal_1.Goal.findByIdAndUpdate(goalId, { $set: updates });
                return { success: true, data: { message: 'Goal updated successfully' } };
            }
            case 'delete_goal': {
                const { goalId } = args;
                if (!goalId || !/^[0-9a-fA-F]{24}$/.test(goalId)) {
                    return { success: false, error: 'Invalid goal ID' };
                }
                const goal = await goal_1.Goal.findOne({ _id: goalId, userId });
                if (!goal)
                    return { success: false, error: 'Goal not found or access denied' };
                await goal.deleteOne();
                return { success: true, data: { message: 'Goal deleted successfully' } };
            }
            // ─── Categories ───────────────────────────────────────────────────────
            case 'get_categories': {
                const { type } = args;
                const filter = { userId };
                if (type)
                    filter.type = type;
                const categories = await categorie_1.Category.find(filter).sort({ name: 1 });
                return {
                    success: true,
                    data: {
                        count: categories.length,
                        categories: categories.map((c) => ({
                            id: c._id,
                            name: c.name,
                            type: c.type,
                            icon: c.icon,
                            color: c.color,
                            isDefault: c.isDefault,
                        })),
                    },
                };
            }
            case 'create_category': {
                const { name, type, icon, color } = args;
                const existing = await categorie_1.Category.findOne({
                    userId,
                    name: { $regex: new RegExp(`^${name}$`, 'i') },
                });
                if (existing)
                    return { success: false, error: `Category "${name}" already exists` };
                const cat = new categorie_1.Category({ userId, name, type, icon, color });
                const saved = await cat.save();
                return {
                    success: true,
                    data: { message: 'Category created', category: { id: saved._id, name: saved.name, type: saved.type } },
                };
            }
            // ─── Predictions ──────────────────────────────────────────────────────
            case 'estimate_monthly_spending': {
                const { categoryName } = args;
                const result = await (0, predictionService_1.estimateMonthlySpending)(userId, categoryName);
                return { success: true, data: result };
            }
            case 'estimate_savings_potential': {
                const { targetAmount, monthlyContribution } = args;
                const result = await (0, predictionService_1.estimateSavingsPotential)(userId, targetAmount, monthlyContribution);
                return { success: true, data: result };
            }
            default:
                return { success: false, error: `Unknown tool: ${toolName}` };
        }
    }
    catch (err) {
        console.error(`[ToolExecutor] Error in ${toolName}:`, err.message);
        return { success: false, error: err.message };
    }
}
//# sourceMappingURL=toolExecutor.js.map