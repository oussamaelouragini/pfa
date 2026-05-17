// features/stats/components/StatsScreen.styles.ts
// ✅ Styles only

import { Dimensions, StyleSheet } from "react-native";

export const CHART_HEIGHT = 160;
export const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F0F2F8" },

  scroll: { flexGrow: 1, paddingBottom: 32 },

  container: { paddingHorizontal: 20, paddingTop: 16 },

  // ── Balance Card ─────────────────────────────────────────────────────────────
  balanceCard: {
    backgroundColor: "#3B5BDB",
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 14,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    gap: 6,
  },
  growthText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  growthSub: { fontSize: 13, color: "rgba(255,255,255,0.7)" },

  // ── Analysis Section ──────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  periodToggle: {
    flexDirection: "row",
    backgroundColor: "#E8EDF5",
    borderRadius: 20,
    padding: 3,
  },
  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
  },
  periodBtnActive: { backgroundColor: "#fff" },
  periodBtnText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  periodBtnTextActive: { color: "#0F172A" },

  // ── Chart Card ────────────────────────────────────────────────────────────────
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  chartEmpty: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  chartEmptyText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  chartTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  chartLabel: { fontSize: 12, color: "#94A3B8", marginBottom: 4 },
  chartAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  chartGrowth: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22C55E",
    marginLeft: 8,
  },
  legendRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: "#64748B" },

  // Chart bars container
  chartContainer: {
    height: CHART_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  barGroup: { alignItems: "center", flex: 1, gap: 3 },
  barWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: CHART_HEIGHT - 24,
  },
  bar: { width: 8, borderRadius: 4, minHeight: 4 },
  barLabelRow: { alignItems: "center" },
  barLabel: { fontSize: 10, color: "#94A3B8", marginTop: 4 },
  barLabelActive: { color: "#3B5BDB", fontWeight: "700" },

  // ── Summary Cards ─────────────────────────────────────────────────────────────
  summaryRow: { flexDirection: "row", gap: 14, marginBottom: 24 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryCardAccent: {
    position: "absolute",
    left: 0,
    top: 20,
    bottom: 20,
    width: 4,
    borderRadius: 2,
  },
  summaryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 13, color: "#94A3B8", marginBottom: 6 },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  summaryUnderline: { height: 3, borderRadius: 2, marginTop: 10, width: "60%" },

  // ── Spending Categories ───────────────────────────────────────────────────────
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  categoryInfo: { flex: 1 },
  categoryLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },
  categoryAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 12,
  },

  // ── Tab Bar ───────────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    alignItems: "center",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
  tabLabel: { fontSize: 11, fontWeight: "600", marginTop: 3 },
  tabLabelActive: { color: "#3B5BDB" },
  tabLabelInactive: { color: "#94A3B8" },
  fabWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1A1A2E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  statsTabActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B5BDB",
    alignItems: "center",
    justifyContent: "center",
  },
  seeAllText: { fontSize: 14, fontWeight: "600", color: "#3B5BDB" },

  // ── Loading / Error / Empty ────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  errorSubtext: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#94A3B8",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#CBD5E1",
  },
});
