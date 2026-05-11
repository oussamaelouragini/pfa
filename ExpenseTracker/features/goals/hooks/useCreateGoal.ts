import { useRouter } from "expo-router";
import { useState } from "react";
import { useGoalsStore } from "../store/goalsStore";
import type { CreateGoalForm } from "../types/goals.types";

export function useCreateGoal() {
  const router = useRouter();
  const addGoal = useGoalsStore((s) => s.addGoal);

  const [form, setForm] = useState<CreateGoalForm>({
    categoryId: "",
    target: "5000",
    name: "",
    duration: "12mo",
    frequency: "Weekly",
  });

  const setCategory = (id: string) =>
    setForm((p) => ({ ...p, categoryId: id }));
  const setDuration = (d: string) =>
    setForm((p) => ({ ...p, duration: d }));
  const setFrequency = (f: string) =>
    setForm((p) => ({ ...p, frequency: f }));
  const setName = (name: string) =>
    setForm((p) => ({ ...p, name }));

  const handleAmountKey = (key: string) => {
    setForm((prev) => {
      const cur = prev.target;
      if (key === "⌫") {
        const next = cur.slice(0, -1);
        return { ...prev, target: next === "" ? "0" : next };
      }
      if (cur === "0" && key !== ".") return { ...prev, target: key };
      return { ...prev, target: cur + key };
    });
  };

  const displayAmount = Number(form.target).toLocaleString("en-US");

  const handleContinue = async () => {
    try {
      await addGoal({
        name: form.name || "Untitled Goal",
        duration: form.duration,
        frequency: form.frequency,
        categoryId: form.categoryId,
        target: parseFloat(form.target) || 0,
      });
      router.back();
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  };

  return {
    form,
    displayAmount,
    setCategory,
    setDuration,
    setFrequency,
    setName,
    handleAmountKey,
    handleContinue,
  };
}
