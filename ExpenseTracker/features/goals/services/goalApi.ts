import { apiClient } from "../../../lib/apiClient";
import type { GoalData } from "../types/goals.types";

export const goalApi = {
  getAll: async () => {
    const response = await apiClient.get<{ data: GoalData[] }>("/goal/goals");
    return response.data.data;
  },

  create: async (data: {
    name: string;
    duration: string;
    frequency: string;
    category: string;
    target: number;
  }) => {
    const response = await apiClient.post<{ data: GoalData }>("/goal/createGoals", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<{
    name: string;
    duration: string;
    frequency: string;
    category: string;
    target: number;
  }>) => {
    const response = await apiClient.put<{ data: GoalData }>(`/goal/goals/${id}`, data);
    return response.data.data;
  },

  addSavings: async (id: string, amount: number) => {
    const response = await apiClient.put<{ data: GoalData }>(`/goal/goals/${id}`, { savedAmount: amount });
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/goal/goals/${id}`);
    return response.data;
  },
};
