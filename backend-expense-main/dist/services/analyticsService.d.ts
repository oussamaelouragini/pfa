export type Period = 'today' | 'week' | 'month' | 'last_month' | 'year' | 'custom';
export declare function getPeriodDates(period: Period, startDate?: string, endDate?: string): {
    start: Date;
    end: Date;
};
export declare function getSpendingSummary(userId: string, period: Period, startDate?: string, endDate?: string): Promise<{
    period: Period;
    dateRange: {
        from: string | undefined;
        to: string | undefined;
    };
    totalExpenses: number;
    totalIncome: number;
    netBalance: number;
    expenseCount: number;
    incomeCount: number;
}>;
export declare function getCategoryBreakdown(userId: string, period: Period, startDate?: string, endDate?: string): Promise<{
    period: Period;
    totalExpenses: number;
    breakdown: {
        categoryId: any;
        categoryName: any;
        total: number;
        count: any;
        percentage: number;
    }[];
}>;
export declare function comparePeriods(userId: string, period1: Period, period2: Period): Promise<{
    period1: {
        period: Period;
        dateRange: {
            from: string | undefined;
            to: string | undefined;
        };
        totalExpenses: number;
        totalIncome: number;
        netBalance: number;
        expenseCount: number;
        incomeCount: number;
    };
    period2: {
        period: Period;
        dateRange: {
            from: string | undefined;
            to: string | undefined;
        };
        totalExpenses: number;
        totalIncome: number;
        netBalance: number;
        expenseCount: number;
        incomeCount: number;
    };
    comparison: {
        expenseDifference: number;
        incomeDifference: number;
        expenseChangePercent: number | null;
        trend: string;
    };
}>;
export declare function detectAnomalies(userId: string): Promise<{
    averageMonthlySpending: number;
    currentMonthSpending: number;
    anomaliesDetected: number;
    anomalies: string[];
    status: string;
}>;
export declare function getFinancialOverview(userId: string): Promise<{
    allTime: {
        totalIncome: number;
        totalExpenses: number;
        netBalance: number;
    };
    thisMonth: {
        period: Period;
        dateRange: {
            from: string | undefined;
            to: string | undefined;
        };
        totalExpenses: number;
        totalIncome: number;
        netBalance: number;
        expenseCount: number;
        incomeCount: number;
    };
    lastMonth: {
        period: Period;
        dateRange: {
            from: string | undefined;
            to: string | undefined;
        };
        totalExpenses: number;
        totalIncome: number;
        netBalance: number;
        expenseCount: number;
        incomeCount: number;
    };
    monthTrend: {
        expenseChange: number;
        incomeChange: number;
    };
}>;
//# sourceMappingURL=analyticsService.d.ts.map