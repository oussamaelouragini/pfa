import apiClient from "@/lib/apiClient";
import { Platform } from "react-native";

export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  address: string;
  avatarUrl: string | null;
  primaryCurrency: string;
  memberType: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  countryCode?: string;
  address?: string;
  primaryCurrency?: string;
}

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<ProfileData> => {
    const response = await apiClient.put("/users/profile", payload);
    return response.data;
  },

  uploadAvatar: async (uri: string): Promise<string> => {
    const formData = new FormData();
    const isWeb = Platform.OS === "web";

    if (isWeb) {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("avatar", blob, "avatar.jpg");
    } else {
      const filename = uri.split("/").pop() || "avatar.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;
      formData.append("avatar", {
        uri,
        type: mimeType,
        name: filename,
      } as any);
    }

    const response = await apiClient.post("/users/avatar", formData);
    return response.data.avatarUrl;
  },

  deleteAvatar: async (): Promise<void> => {
    await apiClient.delete("/users/avatar");
  },
};
