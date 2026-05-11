// features/transactions/store/categoriesStore.ts
// Store for user-created categories (synced with backend)

import { create } from "zustand";
import { categoryApi, type CategoryData } from "../services/categoryApi";
import type { Category, CategoryId } from "../types/transaction.types";

interface CategoriesStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "id">) => Promise<void>;
  removeCategory: (id: CategoryId) => Promise<void>;
  updateCategory: (id: CategoryId, data: { name?: string; icon?: string; color?: string }) => Promise<void>;
  getCategoryById: (id: CategoryId) => Category | undefined;
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoryApi.getAll();
      const categories: Category[] = data.map((c) => ({
        id: c._id as CategoryId,
        label: c.name,
        icon: c.icon as any,
        iconBgColor: (c.color || "#3B5BDB") + "20",
        iconColor: c.color || "#3B5BDB",
      }));
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoryApi.create({
        name: category.label,
        icon: category.icon,
        color: category.iconColor,
      });
      const newCategory: Category = {
        id: data._id as CategoryId,
        label: data.name,
        icon: data.icon as any,
        iconBgColor: (data.color || "#3B5BDB") + "20",
        iconColor: data.color || "#3B5BDB",
      };
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  removeCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoryApi.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await categoryApi.update(id, data);
      const newCategory: Category = {
        id: updated._id as CategoryId,
        label: updated.name,
        icon: updated.icon as any,
        iconBgColor: (updated.color || "#3B5BDB") + "20",
        iconColor: updated.color || "#3B5BDB",
      };
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? newCategory : c)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  getCategoryById: (id) => {
    return get().categories.find((c) => c.id === id);
  },
}));