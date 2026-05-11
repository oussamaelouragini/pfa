import { useGoalsStore } from "@/features/goals/store/goalsStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatShort as fmtShort, formatBalance as fmtBalance } from "@/utils/currency";

function GoalCard({ goal, formatShort, formatBalance, onDelete }: {
  goal: any;
  formatShort: (n: number) => string;
  formatBalance: (n: number) => string;
  onDelete: (id: string) => void;
}) {
  const categoryName = goal.category?.name || "Unknown";
  const categoryIcon = goal.category?.icon || "flag-outline";
  const categoryColor = goal.category?.color || "#3B5BDB";

  return (
    <View style={s.goalCard}>
      <View style={s.goalTopRow}>
        <View style={[s.goalIcon, { backgroundColor: categoryColor + "20" }]}>
          <Ionicons name={categoryIcon as any} size={24} color={categoryColor} />
        </View>
        <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(goal._id)} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <Text style={s.goalName}>{goal.name}</Text>
      <Text style={s.goalCategory}>{categoryName}</Text>

      <View style={s.goalAmounts}>
        <View style={s.amountBlock}>
          <Text style={s.amountLabel}>Target</Text>
          <Text style={s.amountValue}>{formatShort(goal.target)}</Text>
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

      <View style={s.goalFooter}>
        <Ionicons name="time-outline" size={14} color="#64748B" />
        <Text style={s.footerText}>{goal.duration} remaining</Text>
      </View>
    </View>
  );
}

export default function AllGoalsScreen() {
  const router = useRouter();
  const goals = useGoalsStore((s) => s.goals);
  const isLoading = useGoalsStore((s) => s.isLoading);
  const fetchGoals = useGoalsStore((s) => s.fetchGoals);
  const deleteGoal = useGoalsStore((s) => s.deleteGoal);
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7f9" />

      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.push("/(tabs)/goals")}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>All Goals</Text>
        <View style={s.placeholder} />
      </View>

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

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
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
            <GoalCard
              key={goal._id}
              goal={goal}
              formatShort={formatShort}
              formatBalance={formatBalance}
              onDelete={deleteGoal}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7f9" },
  scroll: { padding: 20, paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
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
  placeholder: { width: 44 },

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
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  goalTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  deleteBtn: {
    width: 36,
    height: 36,
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
    marginBottom: 4,
  },
  goalCategory: {
    fontSize: 13,
    color: "#64748B",
    textTransform: "capitalize",
    marginBottom: 16,
  },
  goalAmounts: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
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
  goalFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: "#64748B",
  },

  emptyState: { alignItems: "center", paddingVertical: 80, gap: 10 },
  emptyText: { fontSize: 17, fontWeight: "700", color: "#94A3B8" },
  emptySubText: { fontSize: 14, color: "#CBD5E1", textAlign: "center" },
});
