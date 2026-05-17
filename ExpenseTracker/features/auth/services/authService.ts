import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/lib/apiClient";

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
}

export const authService = {
  signIn: async (payload: {
    email: string;
    password: string;
  }): Promise<StoredUser> => {
    const response = await apiClient.post("/auth/login", payload);
    const { accessToken, id, email, name } = response.data;

    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("userId", id);
    await AsyncStorage.setItem("userEmail", email);
    await AsyncStorage.setItem("userName", name || email.split("@")[0]);

    return { id, fullName: name || email.split("@")[0], email };
  },

  signUp: async (payload: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<StoredUser> => {
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

    return { id: id || "", fullName: userName, email: email || payload.email };
  },

  googleSignIn: async (
    idToken: string,
    platform: string
  ): Promise<StoredUser> => {
    const response = await apiClient.post("/auth/google", { idToken, platform });
    const { token, refreshToken, user } = response.data;

    await AsyncStorage.setItem("accessToken", token);
    await AsyncStorage.setItem("userId", user.id);
    await AsyncStorage.setItem("userEmail", user.email);
    await AsyncStorage.setItem("userName", user.name || user.email.split("@")[0]);

    return { id: user.id, fullName: user.name || user.email.split("@")[0], email: user.email };
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
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
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  },
};
