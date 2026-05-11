// features/transactions/services/categoryApi.ts
import { apiClient } from "../../../lib/apiClient";

export interface CategoryData {
  _id?: string;
  name: string;
  icon?: string;
  color?: string;
  type?: "income" | "expense";
  isDefault?: boolean;
}

export const categoryApi = {
  getAll: async () => {
    const response = await apiClient.get<{ data: CategoryData[] }>("/categories");
    return response.data.data;
  },

  create: async (data: { name: string; icon?: string; color?: string; type?: "income" | "expense" }) => {
    const response = await apiClient.post<{ data: CategoryData }>("/categories", data);
    return response.data.data;
  },

  update: async (id: string, data: { name?: string; icon?: string; color?: string }) => {
    const response = await apiClient.patch<{ data: CategoryData }>(`/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};