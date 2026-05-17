import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/core/components/ScreenWrapper";
import Header from "@/core/components/Header";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatBalance as fmtBalance } from "@/utils/currency";
import { calculateGoalInsights } from "@/utils/goalEstimations";
import { useExploreGoals } from "../hooks/useExploreGoals";
import { C, styles } from "./GoalsScreen.styles";

function ActiveGoalCard({ goal, formatBalance, onPress }: {
  goal: any;
  formatBalance: (n: number) => string;
  onPress: () => void;
}) {
  const categoryIcon = goal.category?.icon || "flag-outline";
  const categoryColor = goal.category?.color || "#3B5BDB";
  const savedAmount = goal.savedAmount ?? 0;
  const target = goal.target || 1;
  const percent = Math.min(Math.round((savedAmount / target) * 100), 100);

  const insights = React.useMemo(
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

  return (
    <TouchableOpacity
      style={styles.progressCard}
      activeOpacity={0.92}
      onPress={onPress}
    >
      <View style={styles.progressCardTop}>
        <View style={[styles.progressIconWrapper, { backgroundColor: categoryColor + "20" }]}>
          <Ionicons name={categoryIcon as any} size={22} color={categoryColor} />
        </View>
        <View style={[styles.ringWrapper, { borderColor: categoryColor + "20" }]}>
          <Text style={[styles.ringText, { color: categoryColor }]}>{percent}%</Text>
        </View>
      </View>
      <Text style={styles.progressGoalName}>{goal.name}</Text>
      <Text style={styles.progressMonths}>{goal.duration}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: categoryColor }]} />
      </View>
      <View style={styles.progressAmountRow}>
        <Text style={styles.progressSaved}>{formatBalance(savedAmount)}</Text>
        <Text style={styles.progressTarget}>of {formatBalance(target)}</Text>
      </View>
      <Text style={styles.progressInsight}>{insights.message}</Text>
    </TouchableOpacity>
  );
}

export default function GoalsScreen() {
  const router = useRouter();
  const { currency } = useCurrency();
  const { goals } = useExploreGoals();

  const formatBalance = (n: number) => fmtBalance(n, currency);

  const handleCreateGoal = () => router.push("/select-category?source=goal");

  return (
    <ScreenWrapper backgroundColor={C.surface} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Header
          left={
            <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.push("/(tabs)/home")}>
              <Ionicons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
          }
          center={<Text style={styles.pageTitle}>Savings Goals</Text>}
        />
        <View style={styles.container}>

          <Text style={styles.pageSubtitle}>
            Dream big, save smart, reach faster.
          </Text>

          {goals.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Active Goals</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/all-goals")}>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.goalsList}>
                {goals.slice(0, 3).map((goal) => (
                  <ActiveGoalCard
                    key={goal._id}
                    goal={goal}
                    formatBalance={formatBalance}
                    onPress={() => router.push({ pathname: "/(tabs)/all-goals", params: { goalId: goal._id } })}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={handleCreateGoal}
      >
        <LinearGradient
          colors={[C.gradStart, C.gradEnd]}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
