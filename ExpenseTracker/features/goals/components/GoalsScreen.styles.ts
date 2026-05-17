// features/goals/components/GoalsScreen.styles.ts
// ✅ Blue #3B5BDB — same as dashboard, wallet, stats, add-transaction
// ✅ DESIGN.md rules: no borders, ambient shadows, large radius

import { StyleSheet } from "react-native";

export const C = {
  primary: "#3B5BDB",
  primaryLight: "#EEF2FF",
  primaryDim: "#2D4ED8",

  aiGradStart: "#4338ca",
  aiGradEnd: "#7c3aed",

  surface: "#F0F2F8",
  surfaceLow: "#E8EDF5",
  surfaceCard: "#FFFFFF",
  onSurface: "#0F172A",
  onVariant: "#64748B",

  gradStart: "#3B5BDB",
  gradEnd: "#2D4ED8",

  green: "#16A34A",
  greenLight: "#DCFCE7",
};

export const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: 40 },
  container: { paddingHorizontal: 22, paddingTop: 20 },

  // ── Header ────────────────────────────────────────────────────────────────────
  headerBackBtn: {
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

  // ── Page Title ────────────────────────────────────────────────────────────────
  pageTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: C.onSurface,
    letterSpacing: -1,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 15,
    color: C.onVariant,
    marginBottom: 28,
  },

  // ── Section Row ───────────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.onSurface,
    letterSpacing: -0.4,
  },
  seeAllText: { fontSize: 13, fontWeight: "600", color: C.primary },

  // ── Active Goals Vertical List ────────────────────────────────────────────────
  goalsList: {
    gap: 14,
    marginBottom: 28,
  },
  progressCard: {
    backgroundColor: C.surfaceCard,
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 5,
  },
  progressCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  progressIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // Circular ring
  ringWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: { fontSize: 11, fontWeight: "800", color: C.primary },

  progressGoalName: {
    fontSize: 16,
    fontWeight: "800",
    color: C.onSurface,
    marginBottom: 2,
  },
  progressMonths: { fontSize: 12, color: C.onVariant, marginBottom: 8 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.surfaceLow,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressAmountRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  progressSaved: { fontSize: 18, fontWeight: "800", color: C.onSurface },
  progressTarget: { fontSize: 11, color: C.onVariant },
  progressInsight: {
    fontSize: 11,
    color: C.primary,
    fontWeight: "600",
    marginTop: 8,
  },

  // ── In-screen FAB ─────────────────────────────────────────────────────────────
  fab: {
    position: "absolute",
    bottom: 24,
    right: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.primary,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
});
