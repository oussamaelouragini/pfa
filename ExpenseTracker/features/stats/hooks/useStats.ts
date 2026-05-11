// features/stats/hooks/useStats.ts
// ✅ Logic & State only — connected to real transaction data

import { useEffect, useMemo, useState } from "react";
import { useTransactionStore } from "@/features/transactions/store/transactionStore";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatBalance as fmtBalance, formatAmount as fmtAmount, formatShort as fmtShort } from "@/utils/currency";
import type {
  ChartDataPoint,
  SummaryCard,
  TabPeriod,
} from "../types/stats.types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function useStats() {
  const { currency } = useCurrency();
  const [activePeriod, setActivePeriod] = useState<TabPeriod>("Weekly");
  const { transactions, balance, isLoading, error, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (transactions.length === 0) return [];

    const now = new Date();

    if (activePeriod === "Weekly") {
      const startOfWeek = new Date(now);
      const day = now.getDay();
      startOfWeek.setDate(now.getDate() - day);
      startOfWeek.setHours(0, 0, 0, 0);

      const weekData: ChartDataPoint[] = [];
      for (let i = 0; i < 7; i++) {
        const dayStart = new Date(startOfWeek);
        dayStart.setDate(startOfWeek.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const dayTransactions = transactions.filter((tx) => {
          const txDate = new Date(tx.createdAt);
          return txDate >= dayStart && txDate < dayEnd;
        });

        const income = dayTransactions
          .filter((t) => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = dayTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        weekData.push({
          day: DAY_LABELS[i],
          income,
          expense,
        });
      }
      return weekData;
    } else {
      const year = now.getFullYear();
      const monthData: ChartDataPoint[] = [];

      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(year, m, 1);
        const monthEnd = new Date(year, m + 1, 1);

        const monthTransactions = transactions.filter((tx) => {
          const txDate = new Date(tx.createdAt);
          return txDate >= monthStart && txDate < monthEnd;
        });

        const income = monthTransactions
          .filter((t) => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = monthTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        monthData.push({
          day: MONTH_LABELS[m],
          income,
          expense,
        });
      }
      return monthData;
    }
  }, [transactions, activePeriod]);

  const totalIncome = useMemo(
    () => chartData.reduce((sum, d) => sum + d.income, 0),
    [chartData]
  );

  const totalExpenses = useMemo(
    () => chartData.reduce((sum, d) => sum + d.expense, 0),
    [chartData]
  );

  const summaryCards: SummaryCard[] = useMemo(
    () => [
      {
        id: "income",
        label: "Income",
        amount: totalIncome,
        icon: "trending-up-outline",
        iconBgColor: "#DCFCE7",
        iconColor: "#16A34A",
        accentColor: "#16A34A",
      },
      {
        id: "expenses",
        label: "Expenses",
        amount: totalExpenses,
        icon: "trending-down-outline",
        iconBgColor: "#FEE2E2",
        iconColor: "#EF4444",
        accentColor: "#EF4444",
      },
    ],
    [totalIncome, totalExpenses]
  );

  const formatBalance = (n: number) => fmtBalance(n, currency);
  const formatAmount = (n: number) => fmtAmount(n, currency);
  const formatShort = (n: number) => fmtShort(n, currency);

  return {
    activePeriod,
    setActivePeriod,
    balance,
    chartData,
    totalIncome,
    totalExpenses,
    summaryCards,
    formatBalance,
    formatAmount,
    formatShort,
    isLoading,
    error,
    hasData: transactions.length > 0,
  };
}
