import { apiClient } from "@/lib/apiClient";
import type { Transaction, TransactionType } from "../types/transaction.types";

export interface BackendTransaction {
  _id: string;
  userId: string;
  categoryId: string | null;
  type: "expense" | "income";
  amount: number;
  note: string;
  date: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionPayload {
  type: TransactionType;
  categoryId: string | null;
  amount: number;
  note?: string;
  date?: string;
  isRecurring?: boolean;
}

export interface UpdateTransactionPayload {
  type?: TransactionType;
  categoryId?: string | null;
  amount?: number;
  note?: string;
  date?: string;
  isRecurring?: boolean;
}

export interface GetTransactionsParams {
  type?: "expense" | "income";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTransactionsResponse {
  data: BackendTransaction[];
  pagination: PaginationInfo;
}

const CATEGORY_DEFAULTS: Record<string, { icon: string; iconBgColor: string; iconColor: string }> = {
  expense: { icon: "cart-outline", iconBgColor: "#F1F5F9", iconColor: "#475569" },
  income: { icon: "cash-outline", iconBgColor: "#DCFCE7", iconColor: "#16A34A" },
};

const mapBackendToFrontend = (tx: BackendTransaction): Transaction => {
  const categoryObj = tx.categoryId as any;
  const categoryName = typeof categoryObj === "object" && categoryObj !== null
    ? (categoryObj.name || "")
    : "";

  const typeKey = tx.type === "expense" ? "expense" : "income";
  const defaults = CATEGORY_DEFAULTS[typeKey];

  return {
    id: tx._id,
    title: tx.note || (tx.type === "expense" ? "Expense" : "Income"),
    category: categoryName,
    categoryId: (tx.categoryId as Transaction["categoryId"]) || "other",
    time: new Date(tx.date).toLocaleDateString(),
    amount: tx.type === "expense" ? -Math.abs(tx.amount) : Math.abs(tx.amount),
    status: "COMPLETED",
    icon: defaults.icon,
    iconBgColor: defaults.iconBgColor,
    iconColor: defaults.iconColor,
    createdAt: new Date(tx.createdAt).getTime(),
  };
};

const mapFrontendTypeToBackend = (type: TransactionType): "expense" | "income" => {
  return type.toLowerCase() as "expense" | "income";
};

export const transactionApi = {
  getAll: async (params?: GetTransactionsParams): Promise<Transaction[]> => {
    const response = await apiClient.get<GetTransactionsResponse>("/transactions", { params });
    return response.data.data.map(mapBackendToFrontend);
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<{ data: BackendTransaction }>(`/transactions/${id}`);
    return mapBackendToFrontend(response.data.data);
  },

  create: async (payload: CreateTransactionPayload): Promise<Transaction> => {
    const backendPayload = {
      ...payload,
      type: mapFrontendTypeToBackend(payload.type),
    };
    const response = await apiClient.post<{ data: BackendTransaction }>("/transactions", backendPayload);
    return mapBackendToFrontend(response.data.data);
  },

  update: async (id: string, payload: UpdateTransactionPayload): Promise<Transaction> => {
    const backendPayload = {
      ...payload,
      type: payload.type ? mapFrontendTypeToBackend(payload.type) : undefined,
    };
    const response = await apiClient.patch<{ data: BackendTransaction }>(`/transactions/${id}`, backendPayload);
    return mapBackendToFrontend(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};