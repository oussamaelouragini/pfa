import { create } from "zustand";
import type { Transaction, TransactionType } from "../types/transaction.types";
import { transactionApi, type CreateTransactionPayload, type UpdateTransactionPayload } from "../services/transactionApi";

interface TransactionStore {
  transactions: Transaction[];
  balance: number;
  isLoading: boolean;
  error: string | null;

  fetchTransactions: () => Promise<void>;
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt">) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, "id" | "createdAt">>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getRecentTransactions: (limit?: number) => Transaction[];
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  balance: 0,
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await transactionApi.getAll();
      const income = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      set({
        transactions,
        balance: income - expense,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch transactions",
        isLoading: false,
      });
    }
  },

  addTransaction: async (tx) => {
    set({ isLoading: true, error: null });
    try {
      const payload: CreateTransactionPayload = {
        type: (tx.amount < 0 ? "Expense" : "Income") as TransactionType,
        categoryId: tx.categoryId === "other" ? null : tx.categoryId,
        amount: Math.abs(tx.amount),
        note: tx.title,
      };
      const newTx = await transactionApi.create(payload);
      set((state) => ({
        transactions: [newTx, ...state.transactions],
        balance: state.balance + tx.amount,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to add transaction",
        isLoading: false,
      });
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const payload: UpdateTransactionPayload = {};
      if (updates.title !== undefined) payload.note = updates.title;
      if (updates.categoryId !== undefined) {
        payload.categoryId = updates.categoryId === "other" ? null : updates.categoryId;
      }
      if (updates.amount !== undefined) {
        payload.amount = Math.abs(updates.amount);
        payload.type = (updates.amount < 0 ? "Expense" : "Income") as TransactionType;
      }
      const updatedTx = await transactionApi.update(id, payload);
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? updatedTx : t)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update transaction",
        isLoading: false,
      });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await transactionApi.delete(id);
      const tx = get().transactions.find((t) => t.id === id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        balance: tx ? state.balance - tx.amount : state.balance,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete transaction",
        isLoading: false,
      });
    }
  },

  getRecentTransactions: (limit = 5) => {
    return get()
      .transactions.slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },
}));