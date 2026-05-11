import { useRouter, useSegments } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/features/auth/services/authService";
import { useUser } from "./UserProvider";

interface AuthContextType {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const { updateUser } = useUser();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          try {
            // Try to refresh token, but don't fail if it's unavailable
            const newToken = await authService.refreshToken();
            if (newToken) {
              const storedId = await AsyncStorage.getItem("userId");
              const storedEmail = await AsyncStorage.getItem("userEmail");

              if (storedId) {
                const storedEmail = await AsyncStorage.getItem("userEmail");
                const storedName = await AsyncStorage.getItem("userName");
                const userName = storedEmail ? storedEmail.split("@")[0] : "";
                updateUser({ id: storedId, email: storedEmail || "", fullName: storedName || userName });
              }
              setIsSignedIn(true);
            } else {
              throw new Error("Token refresh returned null");
            }
          } catch (error) {
            console.warn("Token refresh failed, clearing session:", error);
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("userId");
            setIsSignedIn(false);
          }
        }
      } catch (e) {
        console.warn("Auth initialization error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/auth/sign-in");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/");
    }
  }, [isSignedIn, segments, isLoading, router]);

  const signIn = () => setIsSignedIn(true);
  const signOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn("Logout API error:", error);
    }
    setIsSignedIn(false);
    router.replace("/auth/sign-in");
  };

  const value = {
    isSignedIn,
    signIn,
    signOut,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B5BDB" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
