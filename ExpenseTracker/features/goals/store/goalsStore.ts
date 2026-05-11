import { create } from "zustand";
import { goalApi } from "../services/goalApi";
import type { GoalData } from "../types/goals.types";

interface GoalsStore {
  goals: GoalData[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (form: {
    name: string;
    duration: string;
    frequency: string;
    categoryId: string;
    target: number;
  }) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalsStore = create<GoalsStore>((set) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await goalApi.getAll();
      set({ goals: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addGoal: async (form) => {
    set({ isLoading: true, error: null });
    try {
      const newGoal = await goalApi.create({
        name: form.name,
        duration: form.duration,
        frequency: form.frequency,
        category: form.categoryId,
        target: form.target,
      });
      set((state) => ({
        goals: [newGoal, ...state.goals],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await goalApi.delete(id);
      set((state) => ({
        goals: state.goals.filter((g) => g._id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
