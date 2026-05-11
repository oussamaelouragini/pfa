import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/core/hooks/use-color-scheme";
import { AuthProvider } from "@/providers/AuthProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { UserProvider } from "@/providers/UserProvider";
import { useEffect } from "react";

// Keep the splash screen visible until we're done loading
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };
    const timer = setTimeout(hideSplash, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth screens */}
          <Stack.Screen name="(auth)" />
          {/* Tab screens */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <AuthProvider>
        <CurrencyProvider>
          <RootLayoutNav />
        </CurrencyProvider>
      </AuthProvider>
    </UserProvider>
  );
}
