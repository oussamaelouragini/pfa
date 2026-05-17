import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import ScreenWrapper from "@/core/components/ScreenWrapper";
import Header from "@/core/components/Header";
import {
  QUICK_ADD_ITEMS,
  useAddTransaction,
} from "../hooks/useAddTransaction";
import { useCategoriesStore } from "../store/categoriesStore";
import { useCurrency } from "@/providers/CurrencyProvider";
import { CURRENCIES } from "@/utils/currency";
import type {
  CategoryId,
  TransactionType,
  Category,
} from "../types/transaction.types";
import { styles } from "./AddTransactionScreen.styles";

const ICONS = [
  "bag-outline", "restaurant-outline", "car-outline", "home-outline",
  "medical-outline", "cash-outline", "cafe-outline", "fitness-outline",
  "game-controller-outline", "book-outline", "heart-outline", "star-outline",
  "gift-outline", "cart-outline", "pricetag-outline", "wallet-outline",
  "bed-outline", "phone-portrait-outline", "tv-outline",
  "musical-notes-outline", "diamond-outline", "bulb-outline",
  "shirt-outline", "footsteps-outline",
];

const COLORS = [
  "#3B5BDB", "#F59E0B", "#3B82F6", "#22C55E", "#F43F5E",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1",
  "#84CC16", "#06B6D4", "#EF4444", "#10B981",
];

function TypeToggle({
  active,
  onChange,
}: {
  active: TransactionType;
  onChange: (t: TransactionType) => void;
}) {
  return (
    <View style={styles.toggleWrapper}>
      <View style={styles.toggleContainer}>
        {(["Expense", "Income"] as TransactionType[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.toggleBtn, active === t && styles.toggleBtnActive]}
            onPress={() => onChange(t)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                active === t && styles.toggleTextActive,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function AmountInput({
  value,
  onChangeText,
  currencySymbol,
}: {
  value: string;
  onChangeText: (text: string) => void;
  currencySymbol: string;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const [intPart, decPart] = value.includes(".")
    ? value.split(".")
    : [value, "00"];

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E2E8F0", "#3B5BDB"],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <Animated.View
        style={[
          styles.amountCard,
          {
            borderColor,
            shadowOpacity,
          },
        ]}
      >
        <View style={styles.amountInner}>
          <View style={styles.currencySection}>
            <Text style={styles.currencySymbol}>{currencySymbol}</Text>
          </View>
          <View style={styles.amountDivider} />
          <View style={styles.amountSection}>
            <TextInput
              ref={inputRef}
              style={styles.amountValue}
              value={parseInt(intPart).toLocaleString() + "." + decPart.padEnd(2, "0")}
              onChangeText={onChangeText}
              keyboardType="decimal-pad"
              textAlign="left"
              caretHidden
              contextMenuHidden
              selectTextOnFocus={false}
              maxLength={10}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

function CategorySelector({
  selected,
  onSelect,
  onOpenCreate,
}: {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
  onOpenCreate: () => void;
}) {
  const router = useRouter();
  const userCategories = useCategoriesStore((s) => s.categories);
  const displayCategories = userCategories.slice(0, 4);

  return (
    <View style={styles.catSection}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <TouchableOpacity onPress={() => router.push("/select-category")}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoriesRow}>
        {displayCategories.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryItem, isActive && styles.categoryItemActive]}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryBox,
                  { backgroundColor: cat.iconBgColor },
                  isActive && styles.categoryBoxActive,
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={22}
                  color={isActive ? "#3B5BDB" : cat.iconColor}
                />
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  isActive && styles.categoryLabelActive,
                ]}
                numberOfLines={1}
              >
                {cat.label}
              </Text>
              {isActive && (
                <View style={styles.categoryCheck}>
                  <Ionicons name="checkmark-circle" size={16} color="#3B5BDB" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.createCategoryCard}
          onPress={onOpenCreate}
          activeOpacity={0.8}
        >
          <View style={styles.createCategoryIcon}>
            <Ionicons name="add" size={24} color="#3B5BDB" />
          </View>
          <Text style={styles.createCategoryLabel}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function QuickAdd({ onSelect, currencySymbol }: { onSelect: (item: { categoryLabel: string; label: string; amount: number }) => void; currencySymbol: string }) {
  return (
    <View style={styles.quickAddSection}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>QUICK ADD</Text>
      </View>
      <View style={styles.quickAddRow}>
        {QUICK_ADD_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.quickAddItem}
            onPress={() => onSelect(item)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.quickAddIconWrapper,
                { backgroundColor: item.iconBgColor },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={item.iconColor}
              />
            </View>
            <View>
              <Text style={styles.quickAddLabel}>{item.label}</Text>
              <Text style={styles.quickAddAmount}>
                {currencySymbol}{item.amount.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function CreateCategoryModal({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated: (id: CategoryId) => void;
}) {
  const addCategory = useCategoriesStore((s) => s.addCategory);
  const categories = useCategoriesStore((s) => s.categories);

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("bag-outline");
  const [selectedColor, setSelectedColor] = useState("#3B5BDB");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a category name");
      return;
    }
    if (categories.some((c) => c.label.toLowerCase() === trimmed.toLowerCase())) {
      setError("A category with this name already exists");
      return;
    }

    setError("");
    setIsCreating(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newCategory: Omit<Category, "id"> = {
      label: trimmed,
      icon: selectedIcon,
      iconBgColor: selectedColor + "20",
      iconColor: selectedColor,
    };

    try {
      await addCategory(newCategory);
      const updated = useCategoriesStore.getState().categories;
      const created = updated[updated.length - 1];
      onCreated(created.id);
      setName("");
      setSelectedIcon("bag-outline");
      setSelectedColor("#3B5BDB");
      onClose();
    } catch (err) {
      setError("Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <Ionicons name="close" size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Create Category</Text>
          <View style={styles.modalClose} />
        </View>

        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
          <View style={styles.modalPreview}>
            <View style={[styles.modalPreviewIcon, { backgroundColor: selectedColor + "20" }]}>
              <Ionicons name={selectedIcon as any} size={32} color={selectedColor} />
            </View>
            <Text style={styles.modalPreviewLabel}>{name || "Category Name"}</Text>
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalFieldLabel}>NAME</Text>
            <TextInput
              style={[styles.modalInput, error ? styles.modalInputError : null]}
              placeholder="Enter category name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={(t) => { setName(t); setError(""); }}
              maxLength={20}
              autoFocus
            />
            {error ? <Text style={styles.modalError}>{error}</Text> : null}
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalFieldLabel}>ICON</Text>
            <View style={styles.modalIconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.modalIconOption, selectedIcon === icon && styles.modalIconOptionSelected]}
                  onPress={() => { setSelectedIcon(icon); Haptics.selectionAsync(); }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={icon as any}
                    size={22}
                    color={selectedIcon === icon ? selectedColor : "#64748B"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalField}>
            <Text style={styles.modalFieldLabel}>COLOR</Text>
            <View style={styles.modalColorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.modalColorOption, { backgroundColor: color }, selectedColor === color && styles.modalColorOptionSelected]}
                  onPress={() => { setSelectedColor(color); Haptics.selectionAsync(); }}
                  activeOpacity={0.7}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalCreateBtn, (!name.trim() || isCreating) && styles.modalCreateBtnDisabled]}
            onPress={handleCreate}
            disabled={!name.trim() || isCreating}
            activeOpacity={0.85}
          >
            <Text style={styles.modalCreateBtnText}>
              {isCreating ? "Creating..." : "Create Category"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function AddTransactionScreen() {
  const router = useRouter();
  const { currency } = useCurrency();
  const currencySymbol = CURRENCIES[currency].symbol;
  const {
    type,
    setType,
    displayAmount,
    selectedCat,
    setSelectedCat,
    handleChangeText,
    handleQuickAdd,
    handleSubmit,
  } = useAddTransaction();

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleCategoryCreated = (newId: CategoryId) => {
    setSelectedCat(newId);
  };

  return (
    <ScreenWrapper backgroundColor="#F0F2F8" edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />

      <Header
        left={
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color="#475569" />
          </TouchableOpacity>
        }
        title="Add Transaction"
        right={
          <TouchableOpacity
            style={styles.checkBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TypeToggle active={type} onChange={setType} />
        <AmountInput value={displayAmount} onChangeText={handleChangeText} currencySymbol={currencySymbol} />
        <CategorySelector selected={selectedCat} onSelect={setSelectedCat} onOpenCreate={() => setCreateModalVisible(true)} />
        <QuickAdd onSelect={handleQuickAdd} currencySymbol={currencySymbol} />
      </ScrollView>

      <CreateCategoryModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreated={handleCategoryCreated}
      />
    </ScreenWrapper>
  );
}
