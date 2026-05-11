// features/profile/hooks/useEditProfile.ts
// ✅ Syncs with shared UserContext — changes reflect everywhere
// ✅ Ready for backend: replace mock save with API call

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useUser } from "@/providers/UserProvider";
import type { EditProfileErrors } from "../types/profile.types";

function validate(form: { fullName: string; email: string; phone: string; address: string }): EditProfileErrors {
  const errors: EditProfileErrors = {};

  if (!form.fullName.trim()) errors.fullName = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email address";
  if (!form.phone.trim()) errors.phone = "Phone number is required";
  if (!form.address.trim()) errors.address = "Address is required";

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
export function useEditProfile() {
  const router = useRouter();
  const { user, updateUser } = useUser();

  // ── Form State — synced with UserContext ─────────────────────────────────
  const [form, setForm] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    countryCode: user.countryCode,
  });

  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  // ── Field change ──────────────────────────────────────────────────────────
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
    if (field !== "countryCode" && errors[field as keyof EditProfileErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ── Save — updates UserContext (and later, backend) ───────────────────────
  const handleSave = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with real API call when backend is ready
      // const response = await api.updateProfile(form);
      // if (!response.ok) throw new Error(response.error);
      
      // Mock API delay
      await new Promise((res) => setTimeout(res, 800));

      // Update shared user state
      updateUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        countryCode: form.countryCode,
        address: form.address,
      });

      setDirty(false);
      Alert.alert(
        "Profile Updated",
        "Your changes have been saved successfully.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (err) {
      Alert.alert("Error", "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Back — warn if dirty ──────────────────────────────────────────────────
  const handleBack = () => {
    if (dirty) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ],
      );
    } else {
      router.back();
    }
  };

  // ── Image Picker ──────────────────────────────────────────────────────────
  const pickImage = async () => {
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
      updateUser({ avatarUri: result.assets[0].uri });
    }
  };

  return {
    form,
    errors,
    loading,
    dirty,
    avatarUri: user.avatarUri,
    handleChange,
    handleSave,
    handleBack,
    pickImage,
    countryCode: form.countryCode,
  };
}
