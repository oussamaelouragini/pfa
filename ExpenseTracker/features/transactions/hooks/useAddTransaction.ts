// features/transactions/hooks/useAddTransaction.ts
// Logic & State only

import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { useCategoriesStore } from "../store/categoriesStore";
import type {
  CategoryId,
  TransactionType,
} from "../types/transaction.types";

export const QUICK_ADD_ITEMS: { id: string; label: string; amount: number; icon: string; iconBgColor: string; iconColor: string; categoryLabel: string }[] = [
  {
    id: "q1",
    label: "Morning Coffee",
    amount: 4.5,
    icon: "cafe-outline",
    iconBgColor: "#FFF7ED",
    iconColor: "#F59E0B",
    categoryLabel: "Food",
  },
  {
    id: "q2",
    label: "Uber Ride",
    amount: 12.0,
    icon: "car-outline",
    iconBgColor: "#EFF6FF",
    iconColor: "#3B82F6",
    categoryLabel: "Transport",
  },
];

export function useAddTransaction() {
  const router = useRouter();
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const categories = useCategoriesStore((s) => s.categories);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);

  const [type, setType] = useState<TransactionType>("Expense");
  const [amountStr, setAmountStr] = useState("0");
  const [selectedCat, setSelectedCat] = useState<CategoryId>("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCat) {
      setSelectedCat(categories[0].id);
    }
  }, [categories, selectedCat]);

  const allCategories = categories;

  const handleChangeText = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    if (cleaned === "") {
      setAmountStr("0");
      return;
    }
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      setAmountStr(parts[0] + "." + parts.slice(1).join(""));
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      setAmountStr(parts[0] + "." + parts[1].slice(0, 2));
      return;
    }
    setAmountStr(cleaned);
  };

  const handleQuickAdd = (item: { categoryLabel: string; label: string; amount: number }) => {
    setAmountStr(item.amount.toFixed(2));
    const matchedCat = allCategories.find((c) => c.label.toLowerCase() === item.categoryLabel.toLowerCase());
    if (matchedCat) {
      setSelectedCat(matchedCat.id);
    }
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amountStr);
    if (!numericAmount || numericAmount <= 0) return;

    const category = allCategories.find((c) => c.id === selectedCat) || allCategories[0];
    if (!category) return;

    const finalAmount = type === "Expense" ? -numericAmount : numericAmount;

    addTransaction({
      title: category.label,
      category: category.label,
      categoryId: category.id,
      time: "Just now",
      amount: finalAmount,
      status: type === "Expense" ? "APPROVED" : "COMPLETED",
      icon: category.icon,
      iconBgColor: category.iconBgColor,
      iconColor: category.iconColor,
    });

    router.back();
  };

  const displayAmount = amountStr.includes(".") ? amountStr : `${amountStr}.00`;

  return {
    type,
    setType,
    amountStr,
    displayAmount,
    selectedCat,
    setSelectedCat,
    userCategories: categories,
    allCategories,
    handleChangeText,
    handleQuickAdd,
    handleSubmit,
  };
}
