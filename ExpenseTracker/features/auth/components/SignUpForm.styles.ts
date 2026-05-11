import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },

  // ── Brand ──────────────────────────────
  brand: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#1E2A4A",
  },

  // ── Headline ───────────────────────────
  headline: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 32,
    lineHeight: 22,
  },

  // ── Form ───────────────────────────────
  form: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E2A4A",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  },

  // ── CTA Button ─────────────────────────
  ctaButton: {
    backgroundColor: "#3B5BDB",
    borderRadius: 50,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B5BDB",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: 28,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ── Divider ────────────────────────────
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#CBD5E1",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#94A3B8",
  },

  // ── Social ─────────────────────────────
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 52,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  socialText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E2A4A",
  },

  // ── Footer ─────────────────────────────
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
});
