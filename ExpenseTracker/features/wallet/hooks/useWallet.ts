// features/wallet/hooks/useWallet.ts
// ✅ Logic & State only — connected to real transaction data

import { useEffect } from "react";
import { useTransactionStore } from "@/features/transactions/store/transactionStore";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatBalance as fmtBalance, formatAmount as fmtAmount } from "@/utils/currency";
import type { WalletActivity } from "../types/wallet.types";

export function useWallet() {
  const { currency } = useCurrency();
  const { balance, isLoading, fetchTransactions, getRecentTransactions, transactions } = useTransactionStore();

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

  const formatBalance = (n: number) => fmtBalance(n, currency);
  const formatAmount = (n: number) => fmtAmount(n, currency);

  return {
    balance,
    activity,
    isLoading,
    formatBalance,
    formatAmount,
  };
}
