// features/profile/hooks/useProfile.ts
// ✅ Uses shared UserContext — changes persist across screens
// ✅ Ready for backend integration (updateUser can call API)

import React, { useContext, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useUser } from "@/providers/UserProvider";
import { AuthContext } from "@/providers/AuthProvider";
import { CURRENCIES } from "@/utils/currency";
import type { CurrencyCode } from "@/utils/currency";
import type {
  AppPreference,
  NotificationSetting,
  PersonalInfoItem,
} from "../types/profile.types";

export function useProfile() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const { signOut } = useContext(AuthContext);

  // ── Personal Info Rows ────────────────────────────────────────────────────
  const personalInfo: PersonalInfoItem[] = [
    {
      id: "email",
      label: "EMAIL ADDRESS",
      value: user.email,
      icon: "mail-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
    },
    {
      id: "phone",
      label: "PHONE NUMBER",
      value: `${user.countryCode} ${user.phone}`,
      icon: "call-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
    },
    {
      id: "address",
      label: "RESIDENTIAL ADDRESS",
      value: user.address,
      icon: "location-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
    },
  ];

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifications, setNotifications] = React.useState<NotificationSetting[]>([
    {
      id: "push",
      label: "Push Notifications",
      description: "Alerts, updates & activity",
      icon: "notifications-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
      enabled: true,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  // ── Currency (global) ────────────────────────────────────────────────────
  const { currency, setCurrency } = useCurrency();
  const currencyCodes: CurrencyCode[] = ["USD", "EUR", "GBP", "TND"];
  const currencyOptions = currencyCodes.map((c) => CURRENCIES[c].label);

  // ── App Preferences ───────────────────────────────────────────────────────
  const [preferences, setPreferences] = React.useState<AppPreference[]>([
    {
      id: "currency",
      label: "Primary Currency",
      icon: "card-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
      value: CURRENCIES[currency].label,
      options: currencyOptions,
    },
    {
      id: "language",
      label: "App Language",
      icon: "language-outline",
      iconBgColor: "#EEF2FF",
      iconColor: "#3B5BDB",
      value: "English",
      options: ["English", "French", "Arabic"],
    },
  ]);

  useEffect(() => {
    setPreferences((prev) =>
      prev.map((p) =>
        p.id === "currency" ? { ...p, value: CURRENCIES[currency].label } : p,
      ),
    );
  }, [currency]);

  const cyclePreference = (id: string) => {
    if (id === "currency") {
      const currentIdx = currencyCodes.indexOf(currency);
      const next = currencyCodes[(currentIdx + 1) % currencyCodes.length];
      setCurrency(next);
    } else {
      setPreferences((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const idx = p.options.indexOf(p.value);
          const next = p.options[(idx + 1) % p.options.length];
          return { ...p, value: next };
        }),
      );
    }
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleEditProfile = () => {
    router.push("/(tabs)/profile/edit");
  };

  const handleLogOut = () => {
    signOut();
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Coming soon!");
  };

  const handleInfoPress = (id: string) => {
    router.push("/(tabs)/profile/edit");
  };

  return {
    user,
    updateUser,
    personalInfo,
    notifications,
    preferences,
    toggleNotification,
    cyclePreference,
    handleEditProfile,
    handleLogOut,
    handleSettings,
    handleInfoPress,
  };
}
