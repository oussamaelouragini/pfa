// features/stats/components/StatsScreen.tsx
// ✅ Render (JSX) only — connected to real data

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/providers/UserProvider";
import { useStats } from "../hooks/useStats";
import type {
  ChartDataPoint,
  SummaryCard,
  TabPeriod,
} from "../types/stats.types";
import { CHART_HEIGHT, styles } from "./StatsScreen.styles";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Header ─────────────────────────────────────────────────────────────────
function Header() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/(tabs)/")} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color="#0F172A" />
      </TouchableOpacity>
      <View style={styles.headerLeft}>
        <View style={styles.avatarCircle}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.headerAvatarImage} />
          ) : (
            <Ionicons name="person" size={22} color="#fff" />
          )}
        </View>
        <Text style={styles.headerName}>{user.fullName}</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={20} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 2. Balance Card ───────────────────────────────────────────────────────────
function BalanceCard({
  balance,
  formatBalance,
}: {
  balance: number;
  formatBalance: (n: number) => string;
}) {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{formatBalance(balance)}</Text>
    </View>
  );
}

// ── 3. Period Toggle ──────────────────────────────────────────────────────────
function PeriodToggle({
  active,
  onChange,
}: {
  active: TabPeriod;
  onChange: (p: TabPeriod) => void;
}) {
  return (
    <View style={styles.periodToggle}>
      {(["Weekly", "Monthly"] as TabPeriod[]).map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.periodBtn, active === p && styles.periodBtnActive]}
          onPress={() => onChange(p)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.periodBtnText,
              active === p && styles.periodBtnTextActive,
            ]}
          >
            {p}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── 4. Bar Chart ──────────────────────────────────────────────────────────────
function BarChart({
  data,
  totalIncomeLabel,
}: {
  data: ChartDataPoint[];
  totalIncomeLabel: string;
}) {
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  const chartInnerHeight = CHART_HEIGHT - 24;

  const getBarHeight = (val: number) =>
    Math.max(4, (val / maxVal) * chartInnerHeight);

  const activeIndex = data.length - 1;

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartTopRow}>
        <View>
          <Text style={styles.chartLabel}>Income vs Expenses</Text>
          <Text style={styles.chartAmount}>
            {totalIncomeLabel}
          </Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: "#16A34A" }]} />
          <Text style={styles.legendText}>Income</Text>
          <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.legendText}>Exp.</Text>
        </View>
      </View>

      {data.length === 0 || data.every((d) => d.income === 0 && d.expense === 0) ? (
        <View style={styles.chartEmpty}>
          <Ionicons name="bar-chart-outline" size={32} color="#CBD5E1" />
          <Text style={styles.chartEmptyText}>No data for this period</Text>
        </View>
      ) : (
        <View style={styles.chartContainer}>
          {data.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <View key={item.day} style={styles.barGroup}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: getBarHeight(item.income),
                        opacity: isActive ? 1 : 0.35,
                        backgroundColor: "#16A34A",
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      {
                        height: getBarHeight(item.expense),
                        opacity: isActive ? 1 : 0.5,
                        backgroundColor: "#EF4444",
                      },
                    ]}
                  />
                </View>
                <View style={styles.barLabelRow}>
                  <Text
                    style={[styles.barLabel, isActive && styles.barLabelActive]}
                  >
                    {item.day}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── 5. Summary Cards ──────────────────────────────────────────────────────────
function SummaryCards({
  cards,
  formatShort,
}: {
  cards: SummaryCard[];
  formatShort: (n: number) => string;
}) {
  return (
    <View style={styles.summaryRow}>
      {cards.map((card) => (
        <View key={card.id} style={styles.summaryCard}>
          <View
            style={[
              styles.summaryCardAccent,
              { backgroundColor: card.accentColor },
            ]}
          />
          <View
            style={[
              styles.summaryIconWrapper,
              { backgroundColor: card.iconBgColor },
            ]}
          >
            <Ionicons
              name={card.icon as any}
              size={20}
              color={card.iconColor}
            />
          </View>
          <Text style={styles.summaryLabel}>{card.label}</Text>
          <Text style={styles.summaryAmount}>{formatShort(card.amount)}</Text>
          <View
            style={[
              styles.summaryUnderline,
              { backgroundColor: card.accentColor },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function StatsScreen() {
  const {
    activePeriod,
    setActivePeriod,
    balance,
    chartData,
    totalIncome,
    summaryCards,
    formatBalance,
    formatShort,
    isLoading,
    error,
    hasData,
  } = useStats();

  if (isLoading) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B5BDB" />
        </View>
      </View>
    );
  }

  if (error && !hasData) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Unable to load stats</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* 1 — Header */}
          <Header />

          {/* 2 — Balance Card */}
          <BalanceCard balance={balance} formatBalance={formatBalance} />

          {/* 3 — Analysis title + Period Toggle */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Analysis</Text>
            <PeriodToggle active={activePeriod} onChange={setActivePeriod} />
          </View>

          {/* 4 — Bar Chart */}
          <BarChart data={chartData} totalIncomeLabel={formatBalance(totalIncome)} />

          {/* 5 — Summary Cards */}
          <SummaryCards cards={summaryCards} formatShort={formatShort} />

          {!hasData && (
            <View style={styles.emptyContainer}>
              <Ionicons name="analytics-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No statistics yet</Text>
              <Text style={styles.emptySubtext}>
                Add transactions to see your financial stats
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
