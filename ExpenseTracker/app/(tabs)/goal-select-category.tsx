import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "@/core/components/ScreenWrapper";
import Header from "@/core/components/Header";
import { useGoalCategoriesStore } from "@/features/goals/store/goalCategoriesStore";
import type { GoalCategoryDisplay } from "@/features/goals/types/goals.types";
import { useCategoriesStore } from "@/features/transactions/store/categoriesStore";

interface CategoryItemProps {
  category: GoalCategoryDisplay;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete?: () => void;
}

function CategoryItem({ category, isSelected, onSelect, onDelete }: CategoryItemProps) {
  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onSelect(category.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.categoryIconBox, { backgroundColor: category.iconBgColor }]}>
        <Ionicons
          name={category.icon as any}
          size={24}
          color={category.iconColor}
        />
      </View>
      <Text style={styles.categoryName}>{category.label}</Text>
      {isSelected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={20} color="#3B5BDB" />
        </View>
      )}
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default function GoalSelectCategoryScreen() {
  const router = useRouter();
  const categories = useGoalCategoriesStore((s) => s.categories);
  const isLoading = useGoalCategoriesStore((s) => s.isLoading);
  const fetchCategories = useGoalCategoriesStore((s) => s.fetchCategories);
  const removeCategory = useCategoriesStore((s) => s.removeCategory);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDelete = (id: string) => {
    removeCategory(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleDone = () => {
    if (selectedId) {
      router.navigate({
        pathname: "/(tabs)/goals/create",
        params: { categoryId: selectedId },
      });
    } else {
      router.push("/(tabs)/goals");
    }
  };

  return (
    <ScreenWrapper backgroundColor="#F0F2F8">
      <SafeAreaView style={styles.safe}>
        <Header
          left={
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.push("/(tabs)/goals")}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#0F172A" />
            </TouchableOpacity>
          }
          title="Choose Category"
          right={
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          }
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B5BDB" />
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                isSelected={selectedId === item.id}
                onSelect={handleSelect}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        )}

        <View style={styles.createBtnWrapper}>
          <Text style={styles.noteText}>
            Categories are linked to your account. Create new categories from your profile.
          </Text>
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
  doneBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#3B5BDB",
    borderRadius: 8,
  },
  doneText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    margin: 4,
    maxWidth: "33.33%",
  },
  categoryIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryName: { fontSize: 12, fontWeight: "600", color: "#64748B", textAlign: "center" },
  checkmark: { position: "absolute", top: 8, right: 8 },
  deleteBtn: {
    position: "absolute",
    top: 4,
    left: 4,
    padding: 4,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  createBtnWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#F0F2F8",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  noteText: { fontSize: 13, color: "#94A3B8", textAlign: "center" },
});
