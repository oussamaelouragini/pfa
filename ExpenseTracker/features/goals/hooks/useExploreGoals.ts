import { useEffect } from "react";
import { useGoalsStore } from "../store/goalsStore";
import { useGoalCategoriesStore } from "../store/goalCategoriesStore";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatShort as fmtShort, formatBalance as fmtBalance } from "@/utils/currency";

export function useExploreGoals() {
  const { currency } = useCurrency();
  const goals = useGoalsStore((s) => s.goals);
  const isLoading = useGoalsStore((s) => s.isLoading);
  const fetchGoals = useGoalsStore((s) => s.fetchGoals);
  const categories = useGoalCategoriesStore((s) => s.categories);
  const fetchCategories = useGoalCategoriesStore((s) => s.fetchCategories);

  useEffect(() => {
    fetchGoals();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatShort = (n: number): string => fmtShort(n, currency);
  const formatBalance = (n: number): string => fmtBalance(n, currency);

  const getProgress = (saved: number, target: number): number =>
    Math.min(Math.round((saved / target) * 100), 100);

  return {
    goals,
    categories,
    isLoading,
    formatShort,
    formatBalance,
    getProgress,
  };
}
