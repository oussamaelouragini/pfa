import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/lib/apiClient";
import { UserProfile } from "@/providers/UserProvider";

export const authService = {
  signIn: async (payload: {
    email: string;
    password: string;
  }): Promise<UserProfile> => {
    const response = await apiClient.post("/auth/login", payload);
    const { accessToken, id, email, name } = response.data;

    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("userId", id);
    await AsyncStorage.setItem("userEmail", email);
    await AsyncStorage.setItem("userName", name || email.split("@")[0]);

    const userName = name || email.split("@")[0];

    const user: UserProfile = {
      id,
      fullName: userName,
      email,
      phone: "",
      countryCode: "+216",
      address: "",
      memberType: "STANDARD MEMBER",
      avatarUri: null,
      primaryCurrency: "TND",
    };

    return user;
  },

  signUp: async (payload: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<UserProfile> => {
    const response = await apiClient.post("/auth/register", {
      name: payload.fullName,
      email: payload.email,
      password: payload.password,
    });

    const { accessToken, id, email, name } = response.data;

    if (accessToken) {
      await AsyncStorage.setItem("accessToken", accessToken);
    }
    if (id) {
      await AsyncStorage.setItem("userId", id);
    }
    if (email) {
      await AsyncStorage.setItem("userEmail", email);
    }

    const userName = name || payload.fullName;
    await AsyncStorage.setItem("userName", userName);

    const user: UserProfile = {
      id: id || "",
      fullName: userName,
      email: email || payload.email,
      phone: "",
      countryCode: "+216",
      address: "",
      memberType: "STANDARD MEMBER",
      avatarUri: null,
      primaryCurrency: "TND",
    };

    return user;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.get("/auth/logout", { withCredentials: true });
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userName");
    }
  },

  getStoredToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem("accessToken");
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await apiClient.get("/auth/refresh", {
        withCredentials: true,
      });
      const newToken = response.data.accessToken;
      if (newToken) {
        await AsyncStorage.setItem("accessToken", newToken);
        console.log("Token refreshed successfully");
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Don't throw - let the caller handle the error
      return null;
    }
  },
};
