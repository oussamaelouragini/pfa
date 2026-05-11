// features/goals/components/CreateGoalScreen.styles.ts
// ✅ DESIGN.md applied — same token set

import { StyleSheet } from "react-native";
import { C } from "./GoalsScreen.styles";

export const createStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.surface },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  container: { paddingHorizontal: 22, paddingTop: 8 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { alignItems: "center" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.onSurface,
    letterSpacing: -0.3,
  },
  headerStep: {
    fontSize: 11,
    color: C.onVariant,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
  },

  // ── Progress bar ─────────────────────────────────────────────────────────────
  progressTrack: {
    height: 4,
    backgroundColor: C.surfaceLow,
    borderRadius: 2,
    marginBottom: 28,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    // gradient handled inline
  },

  // ── Icon Preview ──────────────────────────────────────────────────────────────
  iconPreviewWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconPreviewCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: C.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.onSurface,
    shadowOpacity: 0.06,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  // ── Category pills row ───────────────────────────────────────────────────────
  categoriesScroll: { marginBottom: 24 },
  categoryPill: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryPillActive: {
    backgroundColor: C.primary,
    shadowColor: C.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // ── Field card ───────────────────────────────────────────────────────────────
  fieldCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Amount
  amountWrapper: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 20,
  },
  amountRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  amountDollar: { fontSize: 36, fontWeight: "700", color: "#3B5BDB" },
  amountValue: {
    fontSize: 64,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -2,
  },
  amountHint: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 8,
  },
  quickAmountsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
  quickAmountBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  quickAmountBtnActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#3B5BDB",
  },
  quickAmountText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  quickAmountTextActive: {
    color: "#3B5BDB",
  },

  // Goal name input
  goalNameInput: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    padding: 0,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#3B5BDB",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  summaryLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },

  // Date row
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  dateText: { fontSize: 20, fontWeight: "700", color: C.onSurface },

  // Duration pills
  durationRow: { flexDirection: "row", gap: 10 },
  durationPill: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },
  durationPillActive: { backgroundColor: "#3B5BDB" },
  durationText: { fontSize: 13, fontWeight: "700", color: "#64748B" },
  durationTextActive: { color: "#fff" },

  // Frequency option row
  frequencyOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  frequencyOptionLast: { borderBottomWidth: 0 },
  frequencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  freqIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  frequencyText: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  frequencySub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  // Radio dot
  radioDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDotActive: { borderColor: "#3B5BDB" },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B5BDB",
  },

  // ── AI Estimation card ────────────────────────────────────────────────────────
  aiCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: { fontSize: 13, fontWeight: "800", color: "#3B5BDB", letterSpacing: 0.5 },
  aiBody: { fontSize: 14, color: "#475569", lineHeight: 22 },
  aiLink: { fontWeight: "800", color: "#3B5BDB" },

  // ── CTA Button ────────────────────────────────────────────────────────────────
  ctaWrapper: { paddingHorizontal: 22, marginBottom: 12, marginTop: 8 },
  ctaBtn: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaGradient: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 24,
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },
  ctaNote: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    letterSpacing: 1.2,
    marginTop: 12,
  },
});
