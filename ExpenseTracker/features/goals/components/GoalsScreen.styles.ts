// features/goals/components/GoalsScreen.styles.ts — FINAL
// ✅ Blue #3B5BDB — same as dashboard, wallet, stats, add-transaction
// ✅ AI card: indigo→purple gradient (premium look, not green)
// ✅ DESIGN.md rules: no borders, ambient shadows, large radius

import { Dimensions, StyleSheet } from "react-native";

const W = Dimensions.get("window").width;

export const C = {
  // ── Primary blue — consistent with ALL other screens ─────────────────────
  primary: "#3B5BDB",
  primaryLight: "#EEF2FF",
  primaryDim: "#2D4ED8",

  // ── AI card gradient — indigo to purple (premium) ─────────────────────────
  aiGradStart: "#4338ca", // deep indigo
  aiGradEnd: "#7c3aed", // violet

  // ── Surfaces ──────────────────────────────────────────────────────────────
  surface: "#F0F2F8", // same as dashboard bg
  surfaceLow: "#E8EDF5",
  surfaceCard: "#FFFFFF",
  onSurface: "#0F172A",
  onVariant: "#64748B",

  // ── FAB gradient ─────────────────────────────────────────────────────────
  gradStart: "#3B5BDB",
  gradEnd: "#2D4ED8",

  // ── Others ────────────────────────────────────────────────────────────────
  green: "#16A34A",
  greenLight: "#DCFCE7",
};

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  container: { paddingHorizontal: 22, paddingTop: 20 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerAvatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  headerBrand: {
    fontSize: 20,
    fontWeight: "800",
    color: C.onSurface,
    letterSpacing: -0.3,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  bellDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    position: "absolute",
    top: 8,
    right: 8,
    borderWidth: 1.5,
    borderColor: "#fff",
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

  // ── Active Progress Carousel ──────────────────────────────────────────────────
  progressScroll: { marginBottom: 28 },
  progressCard: {
    width: W * 0.55,
    backgroundColor: C.surfaceCard,
    borderRadius: 24,
    padding: 18,
    marginRight: 14,
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringBg: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: C.surfaceLow,
  },
  ringFill: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 4,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },
  ringText: { fontSize: 11, fontWeight: "800", color: C.primary },

  progressGoalName: {
    fontSize: 16,
    fontWeight: "800",
    color: C.onSurface,
    marginBottom: 2,
  },
  progressMonths: { fontSize: 12, color: C.onVariant, marginBottom: 10 },
  progressAmountRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  progressSaved: { fontSize: 18, fontWeight: "800", color: C.onSurface },
  progressTarget: { fontSize: 12, color: C.onVariant },

  // ── AI Card ─────────────────────────────────────────────────────────────────
  aiCard: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 32,
    overflow: "hidden",
  },
  aiTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1.5,
  },
  aiTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  aiBody: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 21,
    marginBottom: 18,
  },
  aiHighlight: { fontWeight: "800", color: "#fff" },
  aiBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
  },
  aiBtnText: { fontSize: 15, fontWeight: "700", color: C.primary },

  // ── Featured Card ─────────────────────────────────────────────────────────────
  featuredCard: {
    backgroundColor: C.surfaceCard,
    borderRadius: 28,
    padding: 24,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
    elevation: 4,
  },
  featuredIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: C.onSurface,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredDesc: {
    fontSize: 14,
    color: C.onVariant,
    lineHeight: 21,
    marginBottom: 16,
  },
  featuredLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  featuredLinkText: { fontSize: 15, fontWeight: "700", color: C.primary },

  // ── Explore Row ───────────────────────────────────────────────────────────────
  exploreCard: {
    backgroundColor: C.surfaceCard,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  exploreIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  exploreInfo: { flex: 1 },
  exploreTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.onSurface,
    marginBottom: 3,
  },
  exploreDesc: { fontSize: 13, color: C.onVariant },

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
