// features/wallet/components/WalletScreen.tsx
// ✅ Render (JSX) only — connected to real data

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/providers/UserProvider";
import { useWallet } from "../hooks/useWallet";
import type { WalletActivity } from "../types/wallet.types";
import { CARD_WIDTH, styles } from "./WalletScreen.styles";

// ── Static card data (UI placeholder — no backend for bank cards) ──
const WALLET_CARDS = [
  {
    id: "c1",
    label: "MAIN ACCOUNT",
    name: "Digital Wallet",
    last4: "••••",
    expiry: "",
    network: "VISA",
    isDark: false,
    color1: "EEF2FF",
    color2: "E0E7FF",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Header ─────────────────────────────────────────────────────────────────
function Header() {
  const { user } = useUser();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatarCircle}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.headerAvatarImage} />
          ) : (
            <Ionicons name="person" size={22} color="#fff" />
          )}
        </View>
        <Text style={styles.headerTitle}>{user.fullName}</Text>
      </View>

      <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
        <Ionicons name="notifications-outline" size={20} color="#1E2A4A" />
        <View style={styles.bellDot} />
      </TouchableOpacity>
    </View>
  );
}

// ── 2. Balance Section ────────────────────────────────────────────────────────
function BalanceSection({
  balance,
  formatBalance,
}: {
  balance: number;
  formatBalance: (n: number) => string;
}) {
  return (
    <View style={styles.netWorthSection}>
      <Text style={styles.netWorthLabel}>TOTAL BALANCE</Text>
      <Text style={styles.netWorthAmount}>{formatBalance(balance)}</Text>
    </View>
  );
}

// ── 3. Single Bank Card ───────────────────────────────────────────────────────
function BankCard({ card }: { card: typeof WALLET_CARDS[0] }) {
  const dark = card.isDark;

  return (
    <View
      style={[styles.cardWrapper, dark ? styles.cardDark : styles.cardLight]}
    >
      <View style={styles.cardTopRow}>
        <View>
          <Text
            style={[
              styles.cardLabel,
              dark ? styles.cardLabelDark : styles.cardLabelLight,
            ]}
          >
            {card.label}
          </Text>
          <Text
            style={[
              styles.cardName,
              dark ? styles.cardNameDark : styles.cardNameLight,
            ]}
          >
            {card.name}
          </Text>
        </View>
        <View style={dark ? styles.contactlessDark : styles.contactlessLight}>
          <Ionicons
            name="wifi-outline"
            size={18}
            color={dark ? "#94A3B8" : "#3B5BDB"}
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </View>
      </View>

      <Text
        style={[
          styles.cardNumber,
          dark ? styles.cardNumberDark : styles.cardNumberLight,
        ]}
      >
        {"• • • •   " + card.last4}
      </Text>

      <View style={styles.cardBottomRow}>
        <View style={styles.circlesRow}>
          <View
            style={[
              styles.circleA,
              dark ? styles.circleDarkA : styles.circleLightA,
            ]}
          />
          <View
            style={[
              styles.circleB,
              dark ? styles.circleDarkB : styles.circleLightB,
            ]}
          />
        </View>

        <Text
          style={[
            styles.cardNetwork,
            dark ? styles.cardNetworkDark : styles.cardNetworkLight,
          ]}
        >
          {card.network}
        </Text>
      </View>
    </View>
  );
}

// ── 4. Cards Carousel ─────────────────────────────────────────────────────────
function CardsCarousel({ cards }: { cards: typeof WALLET_CARDS }) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + 16));
    setActiveIndex(index);
  };

  return (
    <View style={styles.cardsSection}>
      <ScrollView
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentInset={{ right: 40 }}
      >
        {cards.map((card) => (
          <BankCard key={card.id} card={card} />
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {cards.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

// ── 5. Activity Item ──────────────────────────────────────────────────────────
function ActivityItem({
  item,
  formatAmount,
}: {
  item: WalletActivity;
  formatAmount: (n: number) => string;
}) {
  const isPos = item.amount >= 0;
  return (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIconWrapper,
          { backgroundColor: item.iconBgColor },
        ]}
      >
        <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
      </View>

      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>

      <Text
        style={[
          styles.activityAmount,
          isPos ? styles.activityPos : styles.activityNeg,
        ]}
      >
        {formatAmount(item.amount)}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function WalletScreen() {
  const {
    balance,
    activity,
    isLoading,
    formatBalance,
    formatAmount,
  } = useWallet();

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* 1 — Header */}
          <Header />

          {/* 2 — Balance */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B5BDB" />
            </View>
          ) : (
            <BalanceSection
              balance={balance}
              formatBalance={formatBalance}
            />
          )}

          {/* 3 — Cards Carousel */}
          <CardsCarousel cards={WALLET_CARDS} />

          {/* 4 — Activity */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Activity</Text>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              paddingHorizontal: 16,
              marginBottom: 8,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            {activity.length === 0 ? (
              <View style={styles.emptyActivity}>
                <Ionicons name="time-outline" size={32} color="#CBD5E1" />
                <Text style={styles.emptyActivityText}>No activity yet</Text>
                <Text style={styles.emptyActivitySubtext}>
                  Your transactions will appear here
                </Text>
              </View>
            ) : (
              activity.map((item) => (
                <ActivityItem
                  key={item.id}
                  item={item}
                  formatAmount={formatAmount}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
