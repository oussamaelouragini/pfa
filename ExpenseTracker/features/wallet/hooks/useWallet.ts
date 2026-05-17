import { useCallback, useEffect, useState } from "react";
import { useTransactionStore } from "@/features/transactions/store/transactionStore";
import { useCurrency } from "@/providers/CurrencyProvider";
import {
  formatBalance as fmtBalance,
  formatAmount as fmtAmount,
} from "@/utils/currency";
import type { WalletActivity } from "../types/wallet.types";

export function useWallet() {
  const { currency } = useCurrency();
  const {
    balance,
    isLoading,
    fetchTransactions,
    transactions,
    addTransaction,
  } = useTransactionStore();

  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const activity: WalletActivity[] = transactions.slice(0, 10).map((tx) => ({
    id: tx.id,
    title: tx.title,
    time: tx.time,
    amount: tx.amount,
    icon: tx.icon,
    iconBgColor: tx.iconBgColor,
    iconColor: tx.iconColor,
  }));

  const formatBalance = useCallback(
    (n: number) => fmtBalance(n, currency),
    [currency]
  );
  const formatAmount = useCallback(
    (n: number) => fmtAmount(n, currency),
    [currency]
  );

  const topUpCard = useCallback(
    async (amount: number) => {
      setTopUpLoading(true);
      setTopUpSuccess(false);
      try {
        await addTransaction({
          title: "Card Top Up",
          category: "Top Up",
          categoryId: "other",
          time: new Date().toLocaleDateString(),
          amount,
          status: "COMPLETED",
          icon: "card-outline",
          iconBgColor: "#DCFCE7",
          iconColor: "#16A34A",
        });
        setTopUpSuccess(true);
        setTimeout(() => setTopUpSuccess(false), 2000);
      } catch (err) {
        throw err;
      } finally {
        setTopUpLoading(false);
      }
    },
    [addTransaction]
  );

  return {
    balance,
    activity,
    isLoading,
    topUpLoading,
    topUpSuccess,
    formatBalance,
    formatAmount,
    topUpCard,
  };
}
