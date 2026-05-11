import mongoose from 'mongoose';
import { Transaction } from '../models/transaction';
import { Category } from '../models/categorie';

export async function estimateMonthlySpending(userId: string, categoryName?: string) {
  const now = new Date();
  const monthlyData: Array<{ month: string; total: number }> = [];

  // Gather last 6 months of data
  for (let i = 1; i <= 6; i++) {
    const year = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = ((now.getMonth() - i + 12) % 12);
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    let matchStage: Record<string, any> = {
      userId: new mongoose.Types.ObjectId(userId),
      type: 'expense',
      date: { $gte: start, $lte: end },
    };

    if (categoryName) {
      const cat = await Category.findOne({
        userId,
        name: { $regex: new RegExp(`^${categoryName}$`, 'i') },
      });
      if (cat) matchStage.categoryId = cat._id;
    }

    const [agg] = await Transaction.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    monthlyData.push({
      month: `${year}-${String(month + 1).padStart(2, '0')}`,
      total: agg?.total || 0,
    });
  }

  const nonZeroMonths = monthlyData.filter((m) => m.total > 0);
  const average = nonZeroMonths.length
    ? nonZeroMonths.reduce((sum, m) => sum + m.total, 0) / nonZeroMonths.length
    : 0;

  // Simple linear trend: check if spending is growing
  const recentAvg = monthlyData.slice(0, 3).reduce((s, m) => s + m.total, 0) / 3;
  const olderAvg = monthlyData.slice(3, 6).reduce((s, m) => s + m.total, 0) / 3;
  const trend = recentAvg > olderAvg * 1.05 ? 'increasing' : recentAvg < olderAvg * 0.95 ? 'decreasing' : 'stable';

  // Weighted forecast: more weight to recent months
  const weights = [0.35, 0.25, 0.2, 0.1, 0.05, 0.05];
  const forecast = monthlyData.reduce((sum, m, i) => sum + m.total * (weights[i] || 0), 0);

  return {
    categoryName: categoryName || 'All Categories',
    historicalMonths: monthlyData,
    averageMonthlySpending: Math.round(average * 100) / 100,
    forecastNextMonth: Math.round(forecast * 100) / 100,
    trend,
    dataPoints: nonZeroMonths.length,
  };
}

export async function estimateSavingsPotential(
  userId: string,
  targetAmount: number,
  monthlyContribution?: number
) {
  // Calculate average monthly surplus if no contribution specified
  let monthlySavings = monthlyContribution;

  if (!monthlySavings) {
    const now = new Date();
    const surpluses: number[] = [];

    for (let i = 1; i <= 3; i++) {
      const month = ((now.getMonth() - i + 12) % 12);
      const year = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const result = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: start, $lte: end } } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]);

      let income = 0;
      let expense = 0;
      for (const r of result) {
        if (r._id === 'income') income = r.total;
        if (r._id === 'expense') expense = r.total;
      }
      const surplus = income - expense;
      if (surplus > 0) surpluses.push(surplus);
    }

    monthlySavings =
      surpluses.length > 0
        ? surpluses.reduce((a, b) => a + b, 0) / surpluses.length
        : 0;
  }

  if (!monthlySavings || monthlySavings <= 0) {
    return {
      targetAmount,
      monthlyContribution: 0,
      feasible: false,
      message:
        'Cannot estimate — your current expenses exceed or match your income. Consider reducing spending first.',
      suggestions: [
        'Review your top spending categories',
        'Set a monthly budget',
        'Look for recurring expenses to cut',
      ],
    };
  }

  const monthsRequired = Math.ceil(targetAmount / monthlySavings);
  const yearsRequired = monthsRequired / 12;

  return {
    targetAmount,
    monthlyContribution: Math.round(monthlySavings * 100) / 100,
    feasible: true,
    monthsRequired,
    yearsRequired: Math.round(yearsRequired * 10) / 10,
    estimatedDate: new Date(
      Date.now() + monthsRequired * 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0],
    note:
      monthlyContribution
        ? `Based on your specified monthly contribution of ${monthlyContribution} TND.`
        : `Based on your average monthly surplus from the last 3 months.`,
  };
}
