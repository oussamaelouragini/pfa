import { create } from "zustand";
import { categoryApi } from "../../transactions/services/categoryApi";
import type { GoalCategoryDisplay } from "../types/goals.types";

interface GoalCategoriesStore {
  categories: GoalCategoryDisplay[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useGoalCategoriesStore = create<GoalCategoriesStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoryApi.getAll();
      const categories: GoalCategoryDisplay[] = data.map((c) => ({
        id: c._id!,
        label: c.name,
        icon: c.icon || "folder-outline",
        iconColor: c.color || "#3B5BDB",
        iconBgColor: (c.color || "#3B5BDB") + "20",
      }));
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
