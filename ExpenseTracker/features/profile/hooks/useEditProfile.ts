import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useUser } from "@/providers/UserProvider";
import { profileService } from "@/features/profile/services/profileService";
import apiClient from "@/lib/apiClient";
import type { EditProfileErrors } from "../types/profile.types";

const API_BASE_URL = apiClient.defaults.baseURL || "http://172.20.10.3:5000";

function validateForm(form: { fullName: string; phone: string; address: string }): EditProfileErrors {
  const errors: EditProfileErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  return errors;
}

export function useEditProfile() {
  const router = useRouter();
  const { user, updateUser } = useUser();

  const [form, setForm] = useState({
    fullName: user.fullName,
    phone: user.phone,
    address: user.address,
    countryCode: user.countryCode,
  });
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(user.avatarUri);

  useEffect(() => {
    setForm({
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
      countryCode: user.countryCode,
    });
    setAvatarUri(user.avatarUri);
  }, [user.fullName, user.phone, user.address, user.countryCode, user.avatarUri]);

  const handleChange = useCallback((field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    if (field !== "countryCode" && errors[field as keyof EditProfileErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleSave = useCallback(async () => {
      const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaveLoading(true);

      const updatedProfile = await profileService.updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        countryCode: form.countryCode,
        address: form.address,
      });

      updateUser({
        fullName: updatedProfile.fullName,
        phone: updatedProfile.phone,
        countryCode: updatedProfile.countryCode,
        address: updatedProfile.address,
      });

      setDirty(false);
      Alert.alert(
        "Profile Updated",
        "Your changes have been saved successfully.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to save changes. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setSaveLoading(false);
    }
  }, [form, router, updateUser]);

  const handleBack = useCallback(() => {
    if (dirty) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() },
        ],
      );
    } else {
      router.back();
    }
  }, [dirty, router]);

  function getErrorMessage(err: any): string {
    const status = err?.response?.status;
    const message = err?.response?.data?.message || err?.message || "";

    if (status === 413) return "Image size exceeds 5 MB limit.";
    if (status === 500) return "Upload failed. Please try another image or reduce image size.";
    if (status === 400 && message.includes("Invalid image format")) return "Invalid image type. Allowed: JPEG, PNG, WebP.";
    if (message.includes("Network Error") || message.includes("ERR_CONNECTION")) return "Network issue. Please check your connection.";
    if (status && status >= 400) return message || "Upload failed. Please try again.";
    if (message) return message;
    return "Failed to upload image. Please try again.";
  }

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const localUri = asset.uri;

      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert("File Too Large", "Selected image is too large. Maximum size is 5 MB.");
        return;
      }

      setAvatarUri(localUri);
      setLoading(true);

      try {
        const avatarUrl = await profileService.uploadAvatar(localUri);
        const fullUrl = avatarUrl.startsWith("http") ? avatarUrl : `${API_BASE_URL}${avatarUrl}`;
        updateUser({ avatarUri: fullUrl });
        Alert.alert("Success", "Profile picture updated.");
      } catch (err: any) {
        Alert.alert("Upload Error", getErrorMessage(err));
        setAvatarUri(user.avatarUri);
      } finally {
        setLoading(false);
      }
    }
  }, [updateUser, user.avatarUri]);

  return {
    form,
    errors,
    loading,
    saveLoading,
    dirty,
    avatarUri,
    handleChange,
    handleSave,
    handleBack,
    pickImage,
    countryCode: form.countryCode,
  };
}
