// features/auth/components/SignInForm.styles.ts
// ✅ Styles only — all StyleSheets are defined here

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  // ── Top Bar ─────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B5BDB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E2A4A",
    letterSpacing: 0.3,
  },
  backText: {
    fontSize: 14,
    color: "#64748B",
  },

  // ── White Card ──────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 24,
  },

  // ── Headline ────────────────────────────────
  headline: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },

  // ── Form ────────────────────────────────────
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2A4A",
    marginBottom: 8,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B5BDB",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#E8EDF5",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
    marginBottom: 4,
  },

  // ── CTA Button ──────────────────────────────
  ctaButton: {
    backgroundColor: "#3B5BDB",
    borderRadius: 50,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 28,
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Divider ─────────────────────────────────
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1,
  },

  // ── Social Buttons ──────────────────────────
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    height: 54,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  googleG: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4285F4",
    marginRight: 8,
  },
  socialText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2A4A",
  },

  // ── Footer ──────────────────────────────────
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B5BDB",
  },

  // ── Bottom Links ────────────────────────────
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  bottomLinkText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  dot: {
    fontSize: 13,
    color: "#CBD5E1",
  },
});
