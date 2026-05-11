import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/providers/UserProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { formatBalance as fmtBalance } from "@/utils/currency";
import { useExploreGoals } from "../hooks/useExploreGoals";
import { C, styles } from "./GoalsScreen.styles";

function Header() {
  const { user } = useUser();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatarImg}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.headerAvatarImage} />
          ) : (
            <Ionicons name="person" size={22} color="#fff" />
          )}
        </View>
        <Text style={styles.headerBrand}>{user.fullName}</Text>
      </View>
      <TouchableOpacity style={styles.bellBtn}>
        <Ionicons name="notifications-outline" size={20} color="#1E2A4A" />
        <View style={styles.bellDot} />
      </TouchableOpacity>
    </View>
  );
}

function ActiveGoalCard({ goal, formatBalance }: { goal: any; formatBalance: (n: number) => string }) {
  const categoryIcon = goal.category?.icon || "flag-outline";
  const categoryColor = goal.category?.color || "#3B5BDB";

  return (
    <View style={styles.progressCard}>
      <View style={styles.progressIconWrapper}>
        <Ionicons name={categoryIcon as any} size={20} color={categoryColor} />
      </View>
      <Text style={styles.progressGoalName}>{goal.name}</Text>
      <Text style={styles.progressMonths}>{goal.duration}</Text>
      <View style={styles.progressAmountRow}>
        <Text style={styles.progressSaved}>{formatBalance(goal.target)}</Text>
        <Text style={styles.progressTarget}>target</Text>
      </View>
    </View>
  );
}

export default function GoalsScreen() {
  const router = useRouter();
  const { currency } = useCurrency();
  const { goals } = useExploreGoals();

  const formatBalance = (n: number) => fmtBalance(n, currency);

  const handleCreateGoal = () => router.push("/select-category?source=goal");

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Header />

          <Text style={styles.pageTitle}>Savings Goals</Text>
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
              <FlatList
                data={goals.slice(0, 3)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.progressScroll}
                renderItem={({ item }) => (
                  <ActiveGoalCard goal={item} formatBalance={formatBalance} />
                )}
              />
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
    </View>
  );
}
