// features/transactions/types/transaction.types.ts

export type TransactionType = "Expense" | "Income";

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export interface QuickAddItem {
  id: string;
  label: string;
  amount: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  categoryId: CategoryId;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  categoryId: CategoryId;
  time: string;
  amount: number; // negatif = expense, positif = income
  status: "APPROVED" | "COMPLETED" | "PENDING";
  icon: string;
  iconBgColor: string;
  iconColor: string;
  createdAt: number; // timestamp
}
