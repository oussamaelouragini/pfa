import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import Header from "@/core/components/Header";
import { useAddTransaction } from "@/features/transactions/hooks/useAddTransaction";
import { useCategoriesStore } from "@/features/transactions/store/categoriesStore";
import type { Category, CategoryId } from "@/features/transactions/types/transaction.types";
import ScreenWrapper from "@/core/components/ScreenWrapper";

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (id: CategoryId) => void;
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

export default function SelectCategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const isGoalSource = params.source === "goal";
  const { selectedCat: transactionSelectedCat, setSelectedCat: setTransactionSelectedCat } = useAddTransaction();
  const categories = useCategoriesStore((s) => s.categories);
  const removeCategory = useCategoriesStore((s) => s.removeCategory);
  const fetchCategories = useCategoriesStore((s) => s.fetchCategories);
  const isLoading = useCategoriesStore((s) => s.isLoading);

  const [goalSelectedCat, setGoalSelectedCat] = React.useState<CategoryId | null>(null);

  const selectedCat = isGoalSource ? goalSelectedCat : transactionSelectedCat;

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allCategories = categories;

  const handleSelect = (id: CategoryId) => {
    if (isGoalSource) {
      setGoalSelectedCat(id);
    } else {
      setTransactionSelectedCat(id);
    }
  };

  const handleDelete = (id: CategoryId) => {
    removeCategory(id);
  };

  const handleBack = () => {
    if (isGoalSource) {
      router.push("/(tabs)/goals");
    } else {
      router.replace("/add-expense");
    }
  };

  const handleDone = () => {
    if (isGoalSource) {
      const catId = selectedCat || (allCategories.length > 0 ? allCategories[0].id : null);
      if (catId) {
        router.navigate({
          pathname: "/(tabs)/goals/create",
          params: { categoryId: catId as string },
        });
      } else {
        router.navigate("/(tabs)/goals/create");
      }
    } else {
      router.replace("/add-expense");
    }
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
          center={
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Select Category</Text>
              {isGoalSource && <Text style={styles.headerStep}>STEP 1 OF 3</Text>}
            </View>
          }
          right={
            <TouchableOpacity
              style={[styles.doneBtn, !selectedCat && isGoalSource && styles.doneBtnDisabled]}
              onPress={handleDone}
              activeOpacity={0.8}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          }
        />

        {isGoalSource && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "33.33%" }]} />
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B5BDB" />
          </View>
        ) : (
          <FlatList
            data={allCategories}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CategoryItem
                category={item}
                isSelected={selectedCat === item.id}
                onSelect={handleSelect}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        )}

        <View style={styles.createBtnWrapper}>
          {isGoalSource && selectedCat && (
            <View style={styles.selectedFeedback}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.selectedFeedbackText}>Category selected</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push({ pathname: "/create-category", params: { source: "goal" } })}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={22} color="#3B5BDB" />
            <Text style={styles.createBtnText}>Create New Category</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2F8" },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  headerStep: { fontSize: 11, fontWeight: "700", color: "#94A3B8", marginTop: 2 },
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
  doneBtnDisabled: {
    opacity: 0.5,
  },
  doneText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  progressTrack: {
    height: 3,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: "#3B5BDB",
    borderRadius: 2,
  },
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
  selectedFeedback: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 12,
  },
  selectedFeedbackText: { fontSize: 13, fontWeight: "600", color: "#16A34A" },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3B5BDB",
  },
  createBtnText: { fontSize: 16, fontWeight: "700", color: "#3B5BDB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 80 },
});