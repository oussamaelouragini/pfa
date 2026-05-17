import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenWrapper from "@/core/components/ScreenWrapper";
import Header from "@/core/components/Header";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useWallet } from "../hooks/useWallet";
import type { WalletActivity } from "../types/wallet.types";
import { styles } from "./WalletScreen.styles";

// ── Sub-components ──

function WalletHeader() {
  const router = useRouter();

  return (
    <Header
      showBack
      right={
        <Header.IconBtn onPress={() => router.push("/(tabs)/notifications")}>
          <Ionicons name="notifications-outline" size={20} color="#475569" />
        </Header.IconBtn>
      }
    />
  );
}

function BalanceCard({
  balance,
  formatBalance,
  onAddMoney,
  topUpSuccess,
}: {
  balance: number;
  formatBalance: (n: number) => string;
  onAddMoney: () => void;
  topUpSuccess: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (topUpSuccess) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [topUpSuccess]);

  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceCardAccent} />
      <View style={styles.balanceCardAccent2} />
      <View style={styles.cardTopRow}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <View style={styles.cardTypeBadge}>
          <Ionicons name="card-outline" size={11} color="#fff" />
          <Text style={styles.cardTypeBadgeText}>CARD</Text>
        </View>
      </View>
      <Text style={styles.balanceAmount}>{formatBalance(balance)}</Text>
      <View style={styles.cardDivider} />
      <View style={styles.cardBottomRow}>
        <View style={styles.visaGroup}>
          <View style={styles.visaCircle1}>
            <Text style={styles.visaText}>VIS</Text>
          </View>
          <View style={styles.visaCircle2}>
            <Ionicons
              name="ellipse"
              size={10}
              color="rgba(255,255,255,0.5)"
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.addMoneyBtn}
          onPress={onAddMoney}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={16} color="#3B5BDB" />
          <Text style={styles.addMoneyBtnText}>Add Money</Text>
        </TouchableOpacity>
      </View>
      {topUpSuccess && (
        <Animated.View style={[styles.successOverlay, { opacity: fadeAnim }]}>
          <View style={styles.successCheck}>
            <Ionicons name="checkmark" size={28} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Added Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Your balance has been updated
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

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

function AddMoneyModal({
  visible,
  onClose,
  onSave,
  loading,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
  loading: boolean;
}) {
  const { currency } = useCurrency();
  const [amountStr, setAmountStr] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const currencySymbol =
    currency === "TND"
      ? "TND"
      : currency === "USD"
        ? "$"
        : currency === "EUR"
          ? "\u20AC"
          : "\u00A3";

  useEffect(() => {
    if (visible) {
      setAmountStr("");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  const parsed = parseFloat(amountStr);
  const isValid = !isNaN(parsed) && parsed > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(parsed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Add Money</Text>
              <Text style={styles.modalSubtitle}>
                Enter the amount you want to add to your card
              </Text>
              <View
                style={[
                  styles.modalInputWrapper,
                  focused && styles.modalInputFocused,
                ]}
              >
                <Text style={styles.modalCurrencySign}>{currencySymbol}</Text>
                <TextInput
                  ref={inputRef}
                  style={styles.modalInput}
                  placeholder="0.00"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="decimal-pad"
                  value={amountStr}
                  onChangeText={setAmountStr}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  editable={!loading}
                />
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={onClose}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalSaveBtn,
                    (!isValid || loading) && styles.modalSaveDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!isValid || loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons name="wallet-outline" size={18} color="#fff" />
                      <Text style={styles.modalSaveText}>Add Money</Text>
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

// ── Main Screen ──

export default function WalletScreen() {
  const {
    balance,
    activity,
    isLoading,
    topUpLoading,
    topUpSuccess,
    formatBalance,
    formatAmount,
    topUpCard,
  } = useWallet();

  const [modalVisible, setModalVisible] = useState(false);

  const handleAddMoney = useCallback(
    async (amount: number) => {
      try {
        await topUpCard(amount);
        setModalVisible(false);
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add money";
        Alert.alert("Error", msg);
      }
    },
    [topUpCard]
  );

  return (
    <ScreenWrapper backgroundColor="#F0F2F8" edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <WalletHeader />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B5BDB" />
            </View>
          ) : (
            <BalanceCard
              balance={balance}
              formatBalance={formatBalance}
              onAddMoney={() => setModalVisible(true)}
              topUpSuccess={topUpSuccess}
            />
          )}

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Activity</Text>
          </View>

          <View style={styles.activityCard}>
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

      <AddMoneyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddMoney}
        loading={topUpLoading}
      />
    </ScreenWrapper>
  );
}
