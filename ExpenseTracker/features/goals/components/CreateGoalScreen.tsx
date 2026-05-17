import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useGoalsStore } from "../store/goalsStore";
import { useGoalCategoriesStore } from "../store/goalCategoriesStore";
import Header from "@/core/components/Header";
import { useCurrency } from "@/providers/CurrencyProvider";
import { CURRENCIES, formatBalance as fmtBalance } from "@/utils/currency";
import type { CreateGoalForm } from "../types/goals.types";
import { createStyles as s } from "./CreateGoalScreen.styles";

const DURATIONS: { value: string; label: string }[] = [
  { value: "6mo", label: "6 Months" },
  { value: "12mo", label: "1 Year" },
  { value: "2yrs", label: "2 Years" },
];

const FREQUENCIES: string[] = ["Weekly", "Monthly"];

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000];

export default function CreateGoalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const { currency } = useCurrency();
  const currencySymbol = CURRENCIES[currency].symbol;
  const addGoal = useGoalsStore((state) => state.addGoal);
  const categories = useGoalCategoriesStore((s) => s.categories);
  const fetchCategories = useGoalCategoriesStore((s) => s.fetchCategories);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CreateGoalForm>({
    categoryId: params.categoryId || "",
    target: "",
    name: "",
    duration: "12mo",
    frequency: "Monthly",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (params.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: params.categoryId as string }));
    }
  }, [params.categoryId]);

  const selectedCat = categories.find((c) => c.id === form.categoryId);
  const amount = parseFloat(form.target) || 0;
  const months = form.duration === "6mo" ? 6 : form.duration === "12mo" ? 12 : 24;
  const depositsPerMonth = form.frequency === "Weekly" ? 4.33 : 1;
  const estimatedDeposit = amount > 0 ? Math.round(amount / (months * depositsPerMonth)) : 0;

  const updateForm = (updates: Partial<CreateGoalForm>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      router.push("/(tabs)/goals");
    }
  };

  const handleCreate = async () => {
    if (!selectedCat) return;
    setIsSubmitting(true);
    try {
      await addGoal({
        name: form.name || selectedCat.label,
        duration: form.duration,
        frequency: form.frequency,
        categoryId: selectedCat.id,
        target: amount,
      });
      router.push("/(tabs)/goals");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to create goal. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed =
    step === 1
      ? amount > 0
      : form.name.trim().length > 0;

  const renderStep1 = () => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <View style={s.amountWrapper}>
          <Text style={s.fieldLabel}>HOW MUCH DO YOU NEED?</Text>
          <View style={s.amountRow}>
            <Text style={s.amountDollar}>{currencySymbol}</Text>
            <TextInput
              style={s.amountValue}
              placeholder="0"
              placeholderTextColor="#E2E8F0"
              keyboardType="numeric"
              value={form.target}
              onChangeText={(t) => updateForm({ target: t.replace(/[^0-9]/g, "") })}
              autoFocus
            />
          </View>
          <Text style={s.amountHint}>Enter your savings goal amount</Text>
        </View>

        <Text style={[s.fieldLabel, { textAlign: "center", marginBottom: 10 }]}>
          QUICK SELECT
        </Text>
        <View style={s.quickAmountsWrapper}>
          {QUICK_AMOUNTS.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                s.quickAmountBtn,
                form.target === q.toString() && s.quickAmountBtnActive,
              ]}
              onPress={() => updateForm({ target: q.toString() })}
            >
              <Text
                style={[
                  s.quickAmountText,
                  form.target === q.toString() && s.quickAmountTextActive,
                ]}
              >
                {currencySymbol}{(q / 1000).toFixed(0)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderStep2 = () => (
    <>
      {selectedCat && (
        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>Category</Text>
              <Text style={s.summaryValue}>{selectedCat.label}</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>Target</Text>
              <Text style={s.summaryValue}>{fmtBalance(amount, currency)}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={s.fieldCard}>
        <Text style={s.fieldLabel}>NAME YOUR GOAL</Text>
        <TextInput
          style={s.goalNameInput}
          placeholder="My Savings Goal"
          placeholderTextColor="#CBD5E1"
          value={form.name}
          onChangeText={(t) => updateForm({ name: t })}
        />
      </View>

      <View style={[s.fieldCard, { marginBottom: 8 }]}>
        <Text style={s.fieldLabel}>DURATION</Text>
        <View style={s.durationRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d.value}
              style={[s.durationPill, form.duration === d.value && s.durationPillActive]}
              onPress={() => updateForm({ duration: d.value })}
            >
              <Ionicons
                name={d.value === "6mo" ? "time-outline" : "calendar-outline"}
                size={18}
                color={form.duration === d.value ? "#fff" : "#94A3B8"}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  s.durationText,
                  form.duration === d.value && s.durationTextActive,
                ]}
              >
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.fieldCard}>
        <Text style={s.fieldLabel}>FREQUENCY</Text>
        {FREQUENCIES.map((freq, i) => (
          <TouchableOpacity
            key={freq}
            style={[s.frequencyOption, i === FREQUENCIES.length - 1 && s.frequencyOptionLast]}
            onPress={() => updateForm({ frequency: freq })}
          >
            <View style={s.frequencyLeft}>
              <View style={[s.freqIcon, form.frequency === freq && { backgroundColor: "#EEF2FF" }]}>
                <Ionicons
                  name={freq === "Weekly" ? "repeat-outline" : "calendar-outline"}
                  size={20}
                  color={form.frequency === freq ? "#3B5BDB" : "#94A3B8"}
                />
              </View>
              <View>
                <Text style={[s.frequencyText, form.frequency === freq && { color: "#3B5BDB" }]}>
                  {freq}
                </Text>
                <Text style={s.frequencySub}>
                  {freq === "Weekly" ? "4 times per month" : "Once per month"}
                </Text>
              </View>
            </View>
            <View style={[s.radioDot, form.frequency === freq && s.radioDotActive]}>
              {form.frequency === freq && <View style={s.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.aiCard}>
        <View style={s.aiRow}>
          <Ionicons name="sparkles" size={18} color="#3B5BDB" />
          <Text style={s.aiTitle}>ESTIMATION</Text>
        </View>
        <Text style={s.aiBody}>
          To reach your goal of{" "}
          <Text style={s.aiLink}>{fmtBalance(amount, currency)}</Text>, save{" "}
          <Text style={s.aiLink}>{fmtBalance(estimatedDeposit, currency)}</Text> {form.frequency.toLowerCase()}.
        </Text>
      </View>
    </>
  );

  return (
    <View style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.container}>
          <Header
            left={
              <TouchableOpacity style={s.backBtn} onPress={handleBack}>
                <Ionicons name="arrow-back" size={20} color="#3B5BDB" />
              </TouchableOpacity>
            }
            center={
              <View>
                <Text style={s.headerTitle}>
                  {step === 1 ? "Set Amount" : "Goal Details"}
                </Text>
                <Text style={s.headerStep}>STEP {step + 1} OF 3</Text>
              </View>
            }
          />

          <View style={s.progressTrack}>
            <View
              style={[
                s.progressFill,
                {
                  width: `${((step + 1) / 3) * 100}%`,
                  backgroundColor: "#3B5BDB",
                },
              ]}
            />
          </View>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </View>
      </ScrollView>

      <View style={s.ctaWrapper}>
        <TouchableOpacity
          style={[
            s.ctaBtn,
            !canProceed && { opacity: 0.5 },
            isSubmitting && { opacity: 0.7 },
          ]}
          disabled={!canProceed || isSubmitting}
          onPress={() => (step < 2 ? setStep((s) => s + 1) : handleCreate())}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#3B5BDB", "#3451C7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.ctaGradient}
          >
            {isSubmitting && step === 2 ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={s.ctaText}>
                  {step < 2 ? "Continue" : "Create Goal"}
                </Text>
                <Ionicons
                  name={step < 2 ? "arrow-forward" : "checkmark"}
                  size={22}
                  color="#fff"
                  style={{ position: "absolute", right: 24 }}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
        {step === 2 && (
          <Text style={s.ctaNote}>YOU'RE ALL SET!</Text>
        )}
      </View>
    </View>
  );
}
