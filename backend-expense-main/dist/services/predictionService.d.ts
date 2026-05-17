export declare function estimateMonthlySpending(userId: string, categoryName?: string): Promise<{
    categoryName: string;
    historicalMonths: {
        month: string;
        total: number;
    }[];
    averageMonthlySpending: number;
    forecastNextMonth: number;
    trend: string;
    dataPoints: number;
}>;
export declare function estimateSavingsPotential(userId: string, targetAmount: number, monthlyContribution?: number): Promise<{
    targetAmount: number;
    monthlyContribution: number;
    feasible: boolean;
    message: string;
    suggestions: string[];
    monthsRequired?: never;
    yearsRequired?: never;
    estimatedDate?: never;
    note?: never;
} | {
    targetAmount: number;
    monthlyContribution: number;
    feasible: boolean;
    monthsRequired: number;
    yearsRequired: number;
    estimatedDate: string | undefined;
    note: string;
    message?: never;
    suggestions?: never;
}>;
//# sourceMappingURL=predictionService.d.ts.map