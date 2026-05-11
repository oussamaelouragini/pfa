// core/components/ScreenWrapper.tsx
// ✅ Reusable wrapper — every screen uses this instead of SafeAreaView directly
// Usage: <ScreenWrapper> ... </ScreenWrapper>

import React from "react";
import { StatusBar, StatusBarStyle, StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Props ─────────────────────────────────────────────────────────────────────
interface ScreenWrapperProps {
  children: React.ReactNode;

  // Background color of the screen — default #F0F2F8
  backgroundColor?: string;

  // Status bar style — default "dark-content"
  statusBarStyle?: StatusBarStyle;

  // Override edges — default all edges are protected
  // Example: edges={["top","left","right"]} — without bottom (for tab bar screens)
  edges?: ("top" | "bottom" | "left" | "right")[];

  // Extra style
  style?: ViewStyle;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ScreenWrapper({
  children,
  backgroundColor = "#F0F2F8",
  statusBarStyle = "dark-content",
  edges = ["top", "left", "right", "bottom"],
  style,
}: ScreenWrapperProps) {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
