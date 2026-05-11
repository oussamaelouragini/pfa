// features/wallet/components/WalletScreen.styles.ts
// ✅ Styles only

import { Dimensions, StyleSheet } from "react-native";

export const CARD_WIDTH = Dimensions.get("window").width - 80;
export const CARD_HEIGHT = 180;

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2F8" },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  container: { paddingHorizontal: 20, paddingTop: 16 },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#3B5BDB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerAvatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
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

  // ── Total Net Worth ──────────────────────────────────────────────────────────
  netWorthSection: { marginBottom: 28 },
  netWorthLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  netWorthAmount: {
    fontSize: 42,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1.5,
  },

  // ── Cards Carousel ────────────────────────────────────────────────────────────
  cardsSection: { marginBottom: 32 },
  cardsScroll: { gap: 16 },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 22,
    justifyContent: "space-between",
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    marginRight: 16,
  },

  // Card — light variant
  cardLight: { backgroundColor: "#EEF2FF" },
  cardDark: { backgroundColor: "#1E293B" },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardLabelLight: { color: "#3B5BDB" },
  cardLabelDark: { color: "#94A3B8" },
  cardName: { fontSize: 20, fontWeight: "800", marginTop: 4 },
  cardNameLight: { color: "#0F172A" },
  cardNameDark: { color: "#FFFFFF" },

  // Contactless icon background
  contactlessLight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(59,91,219,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  contactlessDark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardNumber: { fontSize: 16, letterSpacing: 3, fontWeight: "600" },
  cardNumberLight: { color: "#475569" },
  cardNumberDark: { color: "#94A3B8" },

  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Overlapping circles (Visa / Mastercard style)
  circlesRow: { flexDirection: "row", alignItems: "center" },
  circleA: {
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.7,
  },
  circleB: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: -12,
    opacity: 0.5,
  },
  circleLightA: { backgroundColor: "#6366F1" },
  circleLightB: { backgroundColor: "#A5B4FC" },
  circleDarkA: { backgroundColor: "#475569" },
  circleDarkB: { backgroundColor: "#94A3B8" },

  cardExpiry: { fontSize: 11, fontWeight: "600" },
  cardExpiryLight: { color: "#64748B" },
  cardExpiryDark: { color: "#94A3B8" },

  cardNetwork: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
  cardNetworkLight: { color: "#3B5BDB" },
  cardNetworkDark: { color: "#94A3B8" },

  // Dots indicator
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#CBD5E1" },
  dotActive: { width: 20, backgroundColor: "#3B5BDB" },

  // ── Section Header ────────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  manageBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
  },
  manageBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B5BDB",
    letterSpacing: 1,
  },
  seeAllText: { fontSize: 14, fontWeight: "600", color: "#3B5BDB" },

  // ── Account Card ──────────────────────────────────────────────────────────────
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  accountIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  accountInfo: { flex: 1 },
  accountName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  accountMeta: { fontSize: 13, color: "#94A3B8" },
  accountRight: { alignItems: "flex-end", gap: 4 },
  accountBalance: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  accountBadge: { fontSize: 12, fontWeight: "700" },

  // ── Activity Item ─────────────────────────────────────────────────────────────
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  activityIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  activityInfo: { flex: 1 },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  activityTime: { fontSize: 12, color: "#94A3B8" },
  activityAmount: { fontSize: 15, fontWeight: "700" },
  activityNeg: { color: "#0F172A" },
  activityPos: { color: "#3B5BDB" },

  // ── Loading ─────────────────────────────────────────────────────────────
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  // ── Empty Activity ──────────────────────────────────────────────────────
  emptyActivity: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyActivityText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#94A3B8",
  },
  emptyActivitySubtext: {
    fontSize: 13,
    color: "#CBD5E1",
  },
});
