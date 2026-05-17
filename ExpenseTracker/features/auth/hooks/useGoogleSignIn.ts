import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useContext, useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { AuthContext } from "@/providers/AuthProvider";
import { useUser } from "@/providers/UserProvider";
import { authService } from "../services/authService";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";

export function useGoogleSignIn() {
  const router = useRouter();
  const { signIn: setAuthSignedIn } = useContext(AuthContext);
  const { updateUser, loadProfile } = useUser();
  const [googleLoading, setGoogleLoading] = useState(false);

  const [, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID || undefined,
    androidClientId: ANDROID_CLIENT_ID || undefined,
    scopes: ["openid", "profile", "email"],
    selectAccount: true,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleTokenExchange(idToken);
      } else {
        Alert.alert("Google Sign-In Error", "No ID token received. Make sure 'openid' scope is allowed in Google Console.");
      }
    } else if (response?.type === "error") {
      const errMsg = response.params?.error?.toLowerCase() || "";
      if (errMsg.includes("redirect_uri_mismatch")) {
        Alert.alert(
          "Google Sign-In Error",
          "Redirect URI mismatch. You need to create a Web OAuth client in Google Cloud Console and add the redirect URI.\n\n" +
            "1. Go to https://console.cloud.google.com/apis/credentials\n" +
            "2. Create OAuth client ID → Web application\n" +
            (Platform.OS === "android"
              ? "3. Add this Authorized redirect URI:\n   expensetracker://oauth2redirect/google\n"
              : "3. Add this Authorized redirect URI:\n   expensetracker://oauth2redirect/google\n") +
            "4. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env to your Web client ID"
        );
      } else {
        Alert.alert("Google Sign-In failed", response.params?.error || "Unknown error");
      }
      setGoogleLoading(false);
    }
  }, [response]);

  const handleTokenExchange = async (idToken: string) => {
    try {
      const userData = await authService.googleSignIn(idToken, Platform.OS);
      updateUser({
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
      });
      await loadProfile();
      setAuthSignedIn();
      router.replace("/home");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Google authentication failed.";
      Alert.alert("Sign In Failed", msg);
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (Platform.OS === "web") {
      if (!WEB_CLIENT_ID) {
        Alert.alert(
          "Google Sign-In not configured",
          "Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your .env file."
        );
        return;
      }
      setGoogleLoading(true);
      try {
        const { signInWithGoogle } = await import("../services/webGoogleSignIn");
        const idToken = await signInWithGoogle(WEB_CLIENT_ID);
        await handleTokenExchange(idToken);
      } catch (error: any) {
        Alert.alert("Google Sign-In Failed", error?.message || "An error occurred");
        setGoogleLoading(false);
      }
      return;
    }

    if (!ANDROID_CLIENT_ID) {
      Alert.alert(
        "Google Sign-In not configured",
        "Set EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID in your .env file."
      );
      return;
    }
    setGoogleLoading(true);
    await promptAsync();
  };

  return {
    googleLoading,
    handleGoogleSignIn,
    isConfigured:
      Platform.OS === "web"
        ? !!WEB_CLIENT_ID
        : !!ANDROID_CLIENT_ID,
  };
}
