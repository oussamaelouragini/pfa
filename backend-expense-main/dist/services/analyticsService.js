"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriodDates = getPeriodDates;
exports.getSpendingSummary = getSpendingSummary;
exports.getCategoryBreakdown = getCategoryBreakdown;
exports.comparePeriods = comparePeriods;
exports.detectAnomalies = detectAnomalies;
exports.getFinancialOverview = getFinancialOverview;
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_1 = require("../models/transaction");
function getPeriodDates(period, startDate, endDate) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    switch (period) {
        case 'today':
            return { start: todayStart, end: todayEnd };
        case 'week': {
            const dayOfWeek = now.getDay();
            const weekStart = new Date(todayStart);
            weekStart.setDate(weekStart.getDate() - dayOfWeek);
            return { start: weekStart, end: todayEnd };
        }
        case 'month':
            return {
                start: new Date(now.getFullYear(), now.getMonth(), 1),
                end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
            };
        case 'last_month':
            return {
                start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999),
            };
        case 'year':
            return {
                start: new Date(now.getFullYear(), 0, 1),
                end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
            };
        case 'custom':
            return {
                start: startDate ? new Date(startDate) : todayStart,
                end: endDate ? new Date(endDate + 'T23:59:59') : todayEnd,
            };
        default:
            return { start: todayStart, end: todayEnd };
    }
}
async function getSpendingSummary(userId, period, startDate, endDate) {
    const { start, end } = getPeriodDates(period, startDate, endDate);
    const result = await transaction_1.Transaction.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), date: { $gte: start, $lte: end } } },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
    ]);
    const summary = { totalExpenses: 0, totalIncome: 0, expenseCount: 0, incomeCount: 0 };
    for (const row of result) {
        if (row._id === 'expense') {
            summary.totalExpenses = row.total;
            summary.expenseCount = row.count;
        }
        else if (row._id === 'income') {
            summary.totalIncome = row.total;
            summary.incomeCount = row.count;
        }
    }
    return {
        period,
        dateRange: { from: start.toISOString().split('T')[0], to: end.toISOString().split('T')[0] },
        totalExpenses: Math.round(summary.totalExpenses * 100) / 100,
        totalIncome: Math.round(summary.totalIncome * 100) / 100,
        netBalance: Math.round((summary.totalIncome - summary.totalExpenses) * 100) / 100,
        expenseCount: summary.expenseCount,
        incomeCount: summary.incomeCount,
    };
}
async function getCategoryBreakdown(userId, period, startDate, endDate) {
    const { start, end } = getPeriodDates(period, startDate, endDate);
    const result = await transaction_1.Transaction.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
                type: 'expense',
                date: { $gte: start, $lte: end },
            },
        },
        {
            $group: {
                _id: '$categoryId',
                total: { $sum: '$amount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { total: -1 } },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'category',
            },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    ]);
    const totalExpenses = result.reduce((sum, r) => sum + r.total, 0);
    return {
        period,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        breakdown: result.map((r) => ({
            categoryId: r._id?.toString() || null,
            categoryName: r.category?.name || 'Uncategorized',
            total: Math.round(r.total * 100) / 100,
            count: r.count,
            percentage: totalExpenses > 0 ? Math.round((r.total / totalExpenses) * 1000) / 10 : 0,
        })),
    };
}
async function comparePeriods(userId, period1, period2) {
    const [summary1, summary2] = await Promise.all([
        getSpendingSummary(userId, period1),
        getSpendingSummary(userId, period2),
    ]);
    const expenseDiff = summary1.totalExpenses - summary2.totalExpenses;
    const incomeDiff = summary1.totalIncome - summary2.totalIncome;
    const expenseChangePercent = summary2.totalExpenses > 0
        ? Math.round((expenseDiff / summary2.totalExpenses) * 1000) / 10
        : null;
    return {
        period1: summary1,
        period2: summary2,
        comparison: {
            expenseDifference: Math.round(expenseDiff * 100) / 100,
            incomeDifference: Math.round(incomeDiff * 100) / 100,
            expenseChangePercent,
            trend: expenseDiff > 0 ? 'increased' : expenseDiff < 0 ? 'decreased' : 'same',
        },
    };
}
async function detectAnomalies(userId) {
    // Compare last 3 months to build average, then check current month
    const now = new Date();
    const monthlyTotals = [];
    for (let i = 1; i <= 3; i++) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
        const [agg] = await transaction_1.Transaction.aggregate([
            { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), type: 'expense', date: { $gte: start, $lte: end } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        monthlyTotals.push(agg?.total || 0);
    }
    const avgMonthly = monthlyTotals.reduce((a, b) => a + b, 0) / 3;
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [thisMonth] = await transaction_1.Transaction.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), type: 'expense', date: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const thisMonthTotal = thisMonth?.total || 0;
    const anomalies = [];
    const threshold = avgMonthly * 1.3;
    if (avgMonthly > 0 && thisMonthTotal > threshold) {
        const overPercent = Math.round(((thisMonthTotal - avgMonthly) / avgMonthly) * 100);
        anomalies.push(`Spending this month (${thisMonthTotal.toFixed(2)} TND) is ${overPercent}% above your 3-month average (${avgMonthly.toFixed(2)} TND).`);
    }
    // Detect large single transactions (> 3x average transaction)
    const [avgTxn] = await transaction_1.Transaction.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId), type: 'expense' } },
        { $group: { _id: null, avg: { $avg: '$amount' } } },
    ]);
    if (avgTxn?.avg) {
        const largeTxns = await transaction_1.Transaction.find({
            userId,
            type: 'expense',
            amount: { $gt: avgTxn.avg * 3 },
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        })
            .populate('categoryId', 'name')
            .sort({ amount: -1 })
            .limit(3);
        for (const t of largeTxns) {
            const catName = t.categoryId?.name || 'Uncategorized';
            anomalies.push(`Large transaction detected: ${t.amount} TND on ${catName} (${new Date(t.date).toLocaleDateString()})`);
        }
    }
    return {
        averageMonthlySpending: Math.round(avgMonthly * 100) / 100,
        currentMonthSpending: Math.round(thisMonthTotal * 100) / 100,
        anomaliesDetected: anomalies.length,
        anomalies: anomalies.length ? anomalies : ['No unusual spending patterns detected.'],
        status: anomalies.length > 0 ? 'warning' : 'healthy',
    };
}
async function getFinancialOverview(userId) {
    const [thisMonth, lastMonth] = await Promise.all([
        getSpendingSummary(userId, 'month'),
        getSpendingSummary(userId, 'last_month'),
    ]);
    const allTime = await transaction_1.Transaction.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    let allTimeIncome = 0;
    let allTimeExpenses = 0;
    for (const r of allTime) {
        if (r._id === 'income')
            allTimeIncome = r.total;
        if (r._id === 'expense')
            allTimeExpenses = r.total;
    }
    return {
        allTime: {
            totalIncome: Math.round(allTimeIncome * 100) / 100,
            totalExpenses: Math.round(allTimeExpenses * 100) / 100,
            netBalance: Math.round((allTimeIncome - allTimeExpenses) * 100) / 100,
        },
        thisMonth,
        lastMonth,
        monthTrend: {
            expenseChange: Math.round((thisMonth.totalExpenses - lastMonth.totalExpenses) * 100) / 100,
            incomeChange: Math.round((thisMonth.totalIncome - lastMonth.totalIncome) * 100) / 100,
        },
    };
}
//# sourceMappingURL=analyticsService.js.map