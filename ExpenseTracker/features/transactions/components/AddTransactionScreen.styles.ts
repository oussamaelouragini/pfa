// features/transactions/components/AddTransactionScreen.styles.ts

import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2F8" },
  scroll: { flexGrow: 1, paddingBottom: 24 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  checkBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B5BDB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // ── Type Toggle ──────────────────────────────────────────────────────────────
  toggleWrapper: { paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#E8EDF5",
    borderRadius: 50,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  toggleText: { fontSize: 15, fontWeight: "700", color: "#94A3B8" },
  toggleTextActive: { color: "#3B5BDB" },

  // ── Amount ───────────────────────────────────────────────────────────────────
  amountSection: { alignItems: "center", paddingVertical: 28 },
  amountLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 2,
    marginBottom: 8,
  },
  amountRow: { flexDirection: "row", alignItems: "flex-start" },
  amountDollar: {
    fontSize: 32,
    fontWeight: "700",
    color: "#94A3B8",
    marginTop: 10,
  },
  amountValue: {
    fontSize: 64,
    fontWeight: "800",
    color: "#3B5BDB",
    letterSpacing: -2,
    lineHeight: 72,
  },

  // ── Section Header ────────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
  },
  seeAllText: { fontSize: 14, fontWeight: "600", color: "#3B5BDB" },

  // ── Categories ────────────────────────────────────────────────────────────────
  categoriesRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  categoryItem: { alignItems: "center", gap: 8 },
  categoryBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryBoxActive: { borderColor: "#3B5BDB", backgroundColor: "#EEF2FF" },
  categoryLabel: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  categoryLabelActive: { color: "#3B5BDB", fontWeight: "700" },
  createCategoryBox: {
    borderStyle: "dashed",
    borderColor: "#3B5BDB",
    backgroundColor: "#EEF2FF",
  },

  // ── Quick Add ─────────────────────────────────────────────────────────────────
  quickAddRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  quickAddItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickAddIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAddLabel: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  quickAddAmount: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
});
