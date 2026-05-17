import { Platform } from "react-native";

function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    console.log(`[API Config] Using URL from env: ${envUrl}`);
    return envUrl;
  }

  if (Platform.OS === "web") {
    console.log("[API Config] Using localhost for web");
    return "http://localhost:5000";
  }

  console.log("[API Config] Using 10.0.2.2 for Android emulator");
  return "http://10.0.2.2:5000";
}

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 15000,
} as const;
