// app/(tabs)/all-transactions.tsx
// ✅ Screen that shows all transactions with search and filter

import { useTransactionStore } from "@/features/transactions/store/transactionStore";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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
import { formatAmount as fmtAmount } from "@/utils/currency";

function TransactionItem({ tx, onDelete, formatAmount }: { tx: Transaction; onDelete: (id: string) => void; formatAmount: (n: number) => string }) {
  const isPos = tx.amount >= 0;
  return (
    <View style={s.txCard}>
      <View style={[s.txIcon, { backgroundColor: tx.iconBgColor }]}>
        <Ionicons name={tx.icon as any} size={22} color={tx.iconColor} />
      </View>
      <View style={s.txInfo}>
        <Text style={s.txTitle}>{tx.title}</Text>
        <Text style={s.txMeta}>
          {tx.category} • {tx.time}
        </Text>
      </View>
      <View style={s.txRight}>
        <Text style={[s.txAmount, isPos ? s.txPos : s.txNeg]}>
          {formatAmount(tx.amount)}
        </Text>
        <View style={s.txBottom}>
          <Text style={s.txStatus}>{tx.status}</Text>
          <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(tx.id)} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function AllTransactionsScreen() {
  const router = useRouter();
  const { currency } = useCurrency();
  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const [searchQuery, setSearchQuery] = React.useState("");

  const formatAmount = (n: number) => fmtAmount(n, currency);
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const filteredTransactions = searchQuery.trim()
    ? sortedTransactions.filter(
        (tx) =>
          tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedTransactions;

  return (
    <ScreenWrapper backgroundColor="#ECEEF5" edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ECEEF5" />
      
      <Header showBack title="All Transactions" />

      {/* Search Bar */}
      <View style={s.searchWrapper}>
        <Ionicons name="search" size={20} color="#94A3B8" />
        <TextInput
          style={s.searchInput}
          placeholder="Search by title or category..."
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

      {/* Results count */}
      {searchQuery.trim() && (
        <View style={s.resultsHeader}>
          <Text style={s.resultsText}>
            {filteredTransactions.length}{filteredTransactions.length === 1 ? " result" : " results"} for "{searchQuery}"
          </Text>
        </View>
      )}

      {/* Transaction List */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
            <Text style={s.emptyText}>
              {searchQuery.trim() ? "No transactions found" : "No transactions yet"}
            </Text>
            <Text style={s.emptySubText}>
              {searchQuery.trim()
                ? "Try searching for a different title or category"
                : "Press + to add your first transaction"}
            </Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} onDelete={deleteTransaction} formatAmount={formatAmount} />
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 100 },

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

  txCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  txIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  txMeta: { fontSize: 13, color: "#94A3B8" },
  txRight: { alignItems: "flex-end" },
  txAmount: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  txPos: { color: "#16A34A" },
  txNeg: { color: "#0F172A" },
  txBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  txStatus: { fontSize: 10, fontWeight: "600", color: "#94A3B8", letterSpacing: 0.8 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: { alignItems: "center", paddingVertical: 80, gap: 10 },
  emptyText: { fontSize: 17, fontWeight: "700", color: "#94A3B8" },
  emptySubText: { fontSize: 14, color: "#CBD5E1" },
});
