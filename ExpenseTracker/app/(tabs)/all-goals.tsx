import { useGoalsStore } from "@/features/goals/store/goalsStore";
import { useTransactionStore } from "@/features/transactions/store/transactionStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/core/components/ScreenWrapper";
import Header from "@/core/components/Header";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatShort as fmtShort, formatBalance as fmtBalance } from "@/utils/currency";
import { calculateGoalInsights } from "@/utils/goalEstimations";
import type { GoalInsight } from "@/utils/goalEstimations";

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: percent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={pg.barTrack}>
      <Animated.View
        style={[
          pg.barFill,
          { width, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const pg = StyleSheet.create({
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});

function AddSavingsModal({
  visible,
  onClose,
  onSave,
  goalName,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (amount: number) => Promise<void>;
  goalName: string;
}) {
  const [amountStr, setAmountStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setAmountStr("");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  const parsed = parseFloat(amountStr);
  const isValid = !isNaN(parsed) && parsed > 0;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    try {
      await onSave(parsed);
      onClose();
    } catch {
      Alert.alert("Error", "Failed to add savings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={as.overlay} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={as.content}>
              <View style={as.handle} />
              <View style={as.iconWrap}>
                <Ionicons name="wallet-outline" size={28} color="#3B5BDB" />
              </View>
              <Text style={as.title}>Add Savings</Text>
              <Text style={as.subtitle}>
                How much have you saved for {"\u201C"}{goalName}{"\u201D"}?
              </Text>
              <View style={[as.inputWrap, focused && as.inputFocused]}>
                <Text style={as.currencySign}>$</Text>
                <TextInput
                  ref={inputRef}
                  style={as.input}
                  placeholder="0.00"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="decimal-pad"
                  value={amountStr}
                  onChangeText={setAmountStr}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  editable={!saving}
                />
              </View>
              <View style={as.actions}>
                <TouchableOpacity style={as.cancelBtn} onPress={onClose} disabled={saving}>
                  <Text style={as.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[as.saveBtn, (!isValid || saving) && as.saveDisabled]}
                  onPress={handleSave}
                  disabled={!isValid || saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={as.saveText}>Save</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const as = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    marginBottom: 20,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    width: "100%",
    height: 56,
  },
  inputFocused: {
    borderColor: "#3B5BDB",
  },
  currencySign: {
    fontSize: 20,
    fontWeight: "700",
    color: "#64748B",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },
  saveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#3B5BDB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

function GoalCard({
  goal,
  formatShort,
  formatBalance,
  onDelete,
  onAddSavings,
}: {
  goal: any;
  formatShort: (n: number) => string;
  formatBalance: (n: number) => string;
  onDelete: (id: string) => void;
  onAddSavings: (goal: any) => void;
}) {
  const categoryName = goal.category?.name || "Unknown";
  const categoryIcon = goal.category?.icon || "flag-outline";
  const categoryColor = goal.category?.color || "#3B5BDB";

  const savedAmount = goal.savedAmount ?? 0;
  const target = goal.target || 1;
  const percent = Math.min(Math.round((savedAmount / target) * 100), 100);

  const insights: GoalInsight = React.useMemo(
    () =>
      calculateGoalInsights({
        savedAmount,
        target,
        createdAt: goal.createdAt,
        duration: goal.duration,
        frequency: goal.frequency,
        formatCurrency: formatBalance,
      }),
    [savedAmount, target, goal.createdAt, goal.duration, goal.frequency, formatBalance]
  );

  const insightColors: Record<string, string> = {
    on_track: "#16A34A",
    ahead: "#3B5BDB",
    delayed: "#F59E0B",
    just_started: "#94A3B8",
    completed: "#16A34A",
  };
  const insightBgColors: Record<string, string> = {
    on_track: "#DCFCE7",
    ahead: "#EEF2FF",
    delayed: "#FEF3C7",
    just_started: "#F1F5F9",
    completed: "#DCFCE7",
  };
  const insightIcons: Record<string, string> = {
    on_track: "trending-up-outline",
    ahead: "rocket-outline",
    delayed: "alert-circle-outline",
    just_started: "information-circle-outline",
    completed: "checkmark-circle-outline",
  };

  const insightColor = insightColors[insights.type] || "#64748B";
  const insightBg = insightBgColors[insights.type] || "#F1F5F9";
  const insightIcon = insightIcons[insights.type] || "information-circle-outline";

  return (
    <View style={s.goalCard}>
      <View style={s.goalTopRow}>
        <View style={[s.goalIcon, { backgroundColor: categoryColor + "20" }]}>
          <Ionicons name={categoryIcon as any} size={24} color={categoryColor} />
        </View>
        <View style={s.topRight}>
          <View style={s.percentBadge}>
            <Text style={[s.percentText, { color: percent >= 100 ? "#16A34A" : categoryColor }]}>
              {percent}%
            </Text>
            <Text style={s.percentLabel}>completed</Text>
          </View>
          <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(goal._id)} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.goalName}>{goal.name}</Text>
      <Text style={s.goalCategory}>{categoryName}</Text>

      <View style={s.progressSection}>
        <ProgressBar percent={percent} color={percent >= 100 ? "#16A34A" : categoryColor} />
        <View style={s.progressLabels}>
          <Text style={s.savedLabel}>
            <Text style={s.savedAmount}>{formatBalance(savedAmount)}</Text> saved
          </Text>
          <Text style={s.targetLabel}>
            of {formatShort(target)}
          </Text>
        </View>
      </View>

      <View style={s.goalAmounts}>
        <View style={s.amountBlock}>
          <Text style={s.amountLabel}>Target</Text>
          <Text style={s.amountValue}>{formatShort(target)}</Text>
        </View>
        <View style={s.amountDivider} />
        <View style={s.amountBlock}>
          <Text style={s.amountLabel}>Duration</Text>
          <Text style={s.amountValue}>{goal.duration}</Text>
        </View>
        <View style={s.amountDivider} />
        <View style={s.amountBlock}>
          <Text style={s.amountLabel}>Frequency</Text>
          <Text style={[s.amountValue, s.amountRemaining]}>{goal.frequency}</Text>
        </View>
      </View>

      <View style={[s.insightCard, { backgroundColor: insightBg }]}>
        <View style={s.insightTop}>
          <View style={s.insightIconWrap}>
            <Ionicons name={insightIcon as any} size={16} color={insightColor} />
          </View>
          <Text style={s.insightBadge}>ESTIMATION</Text>
        </View>
        <Text style={[s.insightText, { color: insightColor }]}>{insights.message}</Text>
      </View>

      <View style={s.goalFooter}>
        <TouchableOpacity
          style={[s.addSavingsBtn, { backgroundColor: categoryColor }]}
          onPress={() => onAddSavings(goal)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={s.addSavingsText}>Add Savings</Text>
        </TouchableOpacity>
        {goal.duration && (
          <View style={s.footerMeta}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={s.footerText}>{goal.duration} remaining</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function AllGoalsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ goalId?: string }>();
  const goals = useGoalsStore((s) => s.goals);
  const isLoading = useGoalsStore((s) => s.isLoading);
  const fetchGoals = useGoalsStore((s) => s.fetchGoals);
  const deleteGoal = useGoalsStore((s) => s.deleteGoal);
  const updateGoalSavings = useGoalsStore((s) => s.updateGoalSavings);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const balance = useTransactionStore((s) => s.balance);
  const [searchQuery, setSearchQuery] = useState("");
  const [savingsTarget, setSavingsTarget] = useState<any>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const { currency } = useCurrency();
  const formatShort = (n: number): string => fmtShort(n, currency);
  const formatBalance = (n: number): string => fmtBalance(n, currency);

  const filteredGoals = searchQuery.trim()
    ? goals.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : goals;

  const handleAddSavings = async (amount: number) => {
    if (!savingsTarget) return;
    const currentSaved = savingsTarget.savedAmount ?? 0;
    const newSaved = currentSaved + amount;

    if (newSaved > savingsTarget.target) {
      Alert.alert(
        "Over Target",
        `Adding ${formatBalance(amount)} would exceed your target of ${formatShort(savingsTarget.target)}. Maximum: ${formatBalance(savingsTarget.target - currentSaved)}`
      );
      return;
    }

    if (amount > balance) {
      Alert.alert(
        "Insufficient Balance",
        `Your current balance is ${formatBalance(balance)}. You need at least ${formatBalance(amount)}.`
      );
      return;
    }

    await updateGoalSavings(savingsTarget._id, newSaved);

    await addTransaction({
      title: `Savings: ${savingsTarget.name}`,
      category: "Savings",
      categoryId: "other",
      time: new Date().toLocaleDateString(),
      amount: -amount,
      status: "COMPLETED",
      icon: "wallet-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
    });
  };

  return (
    <ScreenWrapper backgroundColor="#F0F2F8" edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7f9" />

      <Header
        left={
          <TouchableOpacity style={s.backBtn} onPress={() => router.push("/(tabs)/home")}>
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
        }
        center={<Text style={s.headerTitle}>All Goals</Text>}
      />

      <View style={s.searchWrapper}>
        <Ionicons name="search" size={20} color="#94A3B8" />
        <TextInput
          style={s.searchInput}
          placeholder="Search by name or category..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.trim() && (
        <View style={s.resultsHeader}>
          <Text style={s.resultsText}>
            {filteredGoals.length}{filteredGoals.length === 1 ? " result" : " results"} for &quot;{searchQuery}&quot;
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color="#3B5BDB" />
          </View>
        ) : filteredGoals.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="flag-outline" size={64} color="#CBD5E1" />
            <Text style={s.emptyText}>
              {searchQuery.trim() ? "No goals found" : "No active goals yet"}
            </Text>
            <Text style={s.emptySubText}>
              {searchQuery.trim()
                ? "Try searching for a different name or category"
                : "Create your first savings goal to get started"}
            </Text>
          </View>
        ) : (
          filteredGoals.map((goal) => (
            <View key={goal._id} style={goal._id === params.goalId ? s.selectedCard : undefined}>
              <GoalCard
                goal={goal}
                formatShort={formatShort}
                formatBalance={formatBalance}
                onDelete={deleteGoal}
                onAddSavings={setSavingsTarget}
              />
            </View>
          ))
        )}
      </ScrollView>

      <AddSavingsModal
        visible={!!savingsTarget}
        onClose={() => setSavingsTarget(null)}
        onSave={handleAddSavings}
        goalName={savingsTarget?.name || ""}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 100 },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    height: 50,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#0F172A" },
  resultsHeader: { paddingHorizontal: 20, marginBottom: 10 },
  resultsText: { fontSize: 14, color: "#64748B", fontWeight: "500" },

  loadingContainer: { paddingVertical: 80, alignItems: "center" },

  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  goalTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  percentBadge: {
    alignItems: "flex-end",
  },
  percentText: {
    fontSize: 18,
    fontWeight: "800",
  },
  percentLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  goalIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  goalName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  goalCategory: {
    fontSize: 13,
    color: "#64748B",
    textTransform: "capitalize",
    marginBottom: 16,
  },

  progressSection: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  savedLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  savedAmount: {
    fontWeight: "700",
    color: "#0F172A",
  },
  targetLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },

  goalAmounts: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  amountBlock: { flex: 1, alignItems: "center" },
  amountDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  amountLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  amountValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  amountRemaining: { color: "#3B5BDB" },

  insightCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  insightTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  insightIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  insightBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
  },
  insightText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  goalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addSavingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addSavingsText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  footerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#64748B",
  },

  selectedCard: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#3B5BDB",
    marginBottom: 16,
    overflow: "hidden",
  },
  emptyState: { alignItems: "center", paddingVertical: 80, gap: 10 },
  emptyText: { fontSize: 17, fontWeight: "700", color: "#94A3B8" },
  emptySubText: { fontSize: 14, color: "#CBD5E1", textAlign: "center" },
});
