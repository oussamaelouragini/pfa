// app/(tabs)/create-category.tsx

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useCategoriesStore } from "@/features/transactions/store/categoriesStore";
import type { Category } from "@/features/transactions/types/transaction.types";
import Header from "@/core/components/Header";
import ScreenWrapper from "@/core/components/ScreenWrapper";

const ICON_COLLECTION = [
  "bag-outline", "restaurant-outline", "car-outline", "home-outline",
  "medical-outline", "cash-outline", "cafe-outline", "fitness-outline",
  "game-controller-outline", "book-outline", "heart-outline", "star-outline",
  "gift-outline", "cart-outline", "pricetag-outline", "wallet-outline",
  "bed-outline", "paw-outline", "phone-portrait-outline", "tv-outline",
  "musical-notes-outline", "film-outline", "fly-outline", "barbell-outline",
  "cut-outline", "color-palette-outline", "diamond-outline", "bulb-outline",
  "hardware-chip-outline", "glasses-outline", "shirt-outline", "footsteps-outline",
];

const COLOR_COLLECTION = [
  "#3B5BDB", "#F59E0B", "#3B82F6", "#22C55E", "#F43F5E",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1",
  "#84CC16", "#06B6D4", "#EF4444", "#10B981", "#D946EF",
];

export default function CreateCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const source = params.source;
  const categories = useCategoriesStore((s) => s.categories);
  const addCategory = useCategoriesStore((s) => s.addCategory);

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName("");
      setSelectedIcon("");
      setSelectedColor("");
      setIsCreating(false);
    }, [])
  );

  const isFormValid = name.trim().length > 0 && selectedIcon && selectedColor;

  const isDuplicate = name.trim().length > 0 && categories.some(
    (c) => c.label.toLowerCase() === name.trim().toLowerCase()
  );

  const handleCreate = async () => {
    if (!isFormValid || isDuplicate) return;

    setIsCreating(true);

    const newCategory: Omit<Category, "id"> = {
      label: name.trim(),
      icon: selectedIcon,
      iconBgColor: selectedColor + "20",
      iconColor: selectedColor,
    };

    try {
      await addCategory(newCategory);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({
        pathname: "/(tabs)/select-category",
        params: { source: source || "goal" },
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to create category. Please try again."
      );
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    router.replace({
      pathname: "/(tabs)/select-category",
      params: { source: source || "goal" },
    });
  };

  return (
    <ScreenWrapper backgroundColor="#F0F2F8">
      <SafeAreaView style={styles.safe}>
        <Header
          left={
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          }
          title="Create Category"
        />

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Preview */}
          <View style={styles.previewSection}>
            <View style={[styles.previewIcon, { backgroundColor: selectedColor ? selectedColor + "20" : "#E2E8F0" }]}>
              {selectedIcon ? (
                <Ionicons name={selectedIcon as any} size={32} color={selectedColor || "#94A3B8"} />
              ) : (
                <Ionicons name="image-outline" size={28} color="#94A3B8" />
              )}
            </View>
            <Text style={[styles.previewLabel, !name && { color: "#94A3B8" }]}>
              {name || "Category Name"}
            </Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>CATEGORY NAME</Text>
            <TextInput
              style={[styles.input, isDuplicate && styles.inputError]}
              placeholder="Enter category name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              maxLength={20}
            />
            {isDuplicate && (
              <Text style={styles.errorText}>This category already exists</Text>
            )}
          </View>

          {/* Icon Picker */}
          <View style={styles.pickerSection}>
            <Text style={styles.inputLabel}>SELECT ICON</Text>
            <View style={styles.iconGrid}>
              {ICON_COLLECTION.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    selectedIcon === icon && styles.iconOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedIcon(icon);
                    Haptics.selectionAsync();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={icon as any}
                    size={24}
                    color={selectedIcon === icon ? selectedColor || "#3B5BDB" : "#64748B"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Picker */}
          <View style={styles.pickerSection}>
            <Text style={styles.inputLabel}>SELECT COLOR</Text>
            <View style={styles.colorGrid}>
              {COLOR_COLLECTION.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedColor(color);
                    Haptics.selectionAsync();
                  }}
                  activeOpacity={0.7}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Create Button */}
        <View style={styles.createBtnWrapper}>
          <TouchableOpacity
            style={[
              styles.createBtn,
              (!isFormValid || isDuplicate) && styles.createBtnDisabled,
            ]}
            onPress={handleCreate}
            disabled={!isFormValid || isDuplicate || isCreating}
            activeOpacity={0.85}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.createBtnText}>Create Category</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2F8" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  form: { flex: 1, paddingHorizontal: 20 },
  previewSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  previewLabel: { fontSize: 20, fontWeight: "700", color: "#0F172A" },
  inputSection: { marginBottom: 24 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 6,
    fontWeight: "600",
  },
  pickerSection: { marginBottom: 24 },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconOptionSelected: { borderColor: "#3B5BDB", backgroundColor: "#EEF2FF" },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorOptionSelected: { borderColor: "#fff" },
  createBtnWrapper: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  createBtn: {
    backgroundColor: "#3B5BDB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  createBtnDisabled: { backgroundColor: "#94A3B8" },
  createBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
