// features/stats/types/stats.types.ts

export type TabPeriod = "Weekly" | "Monthly";

export interface ChartDataPoint {
  day: string;
  income: number;
  expense: number;
}

export interface SpendingCategory {
  id: string;
  label: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  amount: number;
  maxAmount: number; // pour calculer el progress bar
  barColor: string;
}

export interface SummaryCard {
  id: string;
  label: string;
  amount: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  accentColor: string;
}
