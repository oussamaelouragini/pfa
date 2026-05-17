// features/profile/components/EditProfileScreen.styles.ts

import { StyleSheet } from "react-native";

export const EC = {
  primary: "#3B5BDB",
  primaryLight: "#EEF2FF",
  primaryDim: "#2D4ED8",
  surface: "#F0F2F8",
  surfaceCard: "#FFFFFF",
  surfaceLow: "#E8EDF5",
  onSurface: "#0F172A",
  onVariant: "#64748B",
  red: "#EF4444",
  border: "#F1F5F9",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  green: "#16A34A",
};

export const es = StyleSheet.create({
  safe: { flex: 1, backgroundColor: EC.surface },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  // ── Header ──────────────────────────────────────────────────────────────────
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: EC.primary,
  },
  saveBtnDisabled: { opacity: 0.4 },

  // ── Avatar ───────────────────────────────────────────────────────────────────
  avatarSection: { alignItems: "center", paddingTop: 12, paddingBottom: 24 },
  avatarWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    marginBottom: 14,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: EC.surfaceLow,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    overflow: "hidden",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: EC.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#fff",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarName: {
    fontSize: 22,
    fontWeight: "800",
    color: EC.onSurface,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  avatarId: {
    fontSize: 13,
    color: EC.onVariant,
    fontWeight: "500",
  },

  // ── Form Fields ───────────────────────────────────────────────────────────────
  fieldBlock: { paddingHorizontal: 20, marginBottom: 16 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: EC.onVariant,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: EC.surfaceCard,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: EC.primary,
    shadowColor: EC.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  inputWrapperError: { borderColor: EC.red },
  input: {
    fontSize: 16,
    fontWeight: "500",
    color: EC.onSurface,
    padding: 0,
  },
  inputMultiline: { minHeight: 60, textAlignVertical: "top" },
  errorText: {
    fontSize: 12,
    color: EC.red,
    marginTop: 6,
    fontWeight: "500",
  },

  // ── Phone Input with Country Code ─────────────────────────────────────────
  phoneInputWrapper: {
    backgroundColor: EC.surfaceCard,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    overflow: "hidden",
  },
  countryCodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 12,
    paddingVertical: 16,
    gap: 4,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "600",
    color: EC.primary,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: EC.border,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: EC.onSurface,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  // ── Uploading Badge ─────────────────────────────────────────────────────────
  uploadingBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  uploadingText: {
    fontSize: 13,
    fontWeight: "600",
    color: EC.primary,
  },
});
