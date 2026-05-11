import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Country {
  name: string;
  code: string;
  callingCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: "Tunisia", code: "TN", callingCode: "+216", flag: "🇹🇳" },
  { name: "United States", code: "US", callingCode: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", callingCode: "+44", flag: "🇬🇧" },
  { name: "France", code: "FR", callingCode: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "DE", callingCode: "+49", flag: "🇩🇪" },
  { name: "Italy", code: "IT", callingCode: "+39", flag: "🇮🇹" },
  { name: "Spain", code: "ES", callingCode: "+34", flag: "🇪🇸" },
  { name: "Portugal", code: "PT", callingCode: "+351", flag: "🇵🇹" },
  { name: "Netherlands", code: "NL", callingCode: "+31", flag: "🇳🇱" },
  { name: "Belgium", code: "BE", callingCode: "+32", flag: "🇧🇪" },
  { name: "Switzerland", code: "CH", callingCode: "+41", flag: "🇨🇭" },
  { name: "Austria", code: "AT", callingCode: "+43", flag: "🇦🇹" },
  { name: "Sweden", code: "SE", callingCode: "+46", flag: "🇸🇪" },
  { name: "Norway", code: "NO", callingCode: "+47", flag: "🇳🇴" },
  { name: "Denmark", code: "DK", callingCode: "+45", flag: "🇩🇰" },
  { name: "Finland", code: "FI", callingCode: "+358", flag: "🇫🇮" },
  { name: "Poland", code: "PL", callingCode: "+48", flag: "🇵🇱" },
  { name: "Czech Republic", code: "CZ", callingCode: "+420", flag: "🇨🇿" },
  { name: "Greece", code: "GR", callingCode: "+30", flag: "🇬🇷" },
  { name: "Turkey", code: "TR", callingCode: "+90", flag: "🇹🇷" },
  { name: "Russia", code: "RU", callingCode: "+7", flag: "🇷🇺" },
  { name: "Ukraine", code: "UA", callingCode: "+380", flag: "🇺🇦" },
  { name: "China", code: "CN", callingCode: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "JP", callingCode: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", callingCode: "+82", flag: "🇰🇷" },
  { name: "India", code: "IN", callingCode: "+91", flag: "🇮🇳" },
  { name: "Pakistan", code: "PK", callingCode: "+92", flag: "🇵🇰" },
  { name: "Bangladesh", code: "BD", callingCode: "+880", flag: "🇧🇩" },
  { name: "Indonesia", code: "ID", callingCode: "+62", flag: "🇮🇩" },
  { name: "Malaysia", code: "MY", callingCode: "+60", flag: "🇲🇾" },
  { name: "Singapore", code: "SG", callingCode: "+65", flag: "🇸🇬" },
  { name: "Thailand", code: "TH", callingCode: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", callingCode: "+84", flag: "🇻🇳" },
  { name: "Philippines", code: "PH", callingCode: "+63", flag: "🇵🇭" },
  { name: "Australia", code: "AU", callingCode: "+61", flag: "🇦🇺" },
  { name: "New Zealand", code: "NZ", callingCode: "+64", flag: "🇳🇿" },
  { name: "Canada", code: "CA", callingCode: "+1", flag: "🇨🇦" },
  { name: "Mexico", code: "MX", callingCode: "+52", flag: "🇲🇽" },
  { name: "Brazil", code: "BR", callingCode: "+55", flag: "🇧🇷" },
  { name: "Argentina", code: "AR", callingCode: "+54", flag: "🇦🇷" },
  { name: "Colombia", code: "CO", callingCode: "+57", flag: "🇨🇴" },
  { name: "Chile", code: "CL", callingCode: "+56", flag: "🇨🇱" },
  { name: "Peru", code: "PE", callingCode: "+51", flag: "🇵🇪" },
  { name: "Egypt", code: "EG", callingCode: "+20", flag: "🇪🇬" },
  { name: "Morocco", code: "MA", callingCode: "+212", flag: "🇲🇦" },
  { name: "Algeria", code: "DZ", callingCode: "+213", flag: "🇩🇿" },
  { name: "Libya", code: "LY", callingCode: "+218", flag: "🇱🇾" },
  { name: "Saudi Arabia", code: "SA", callingCode: "+966", flag: "🇸🇦" },
  { name: "United Arab Emirates", code: "AE", callingCode: "+971", flag: "🇦🇪" },
  { name: "Qatar", code: "QA", callingCode: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "KW", callingCode: "+965", flag: "🇰🇼" },
  { name: "Nigeria", code: "NG", callingCode: "+234", flag: "🇳🇬" },
  { name: "South Africa", code: "ZA", callingCode: "+27", flag: "🇿🇦" },
  { name: "Kenya", code: "KE", callingCode: "+254", flag: "🇰🇪" },
];

export function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  selectedCode,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  selectedCode: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.callingCode.includes(search)
  );

  const renderItem = ({ item }: { item: Country }) => {
    const isSelected = item.callingCode === selectedCode;
    return (
      <TouchableOpacity
        style={pickerStyles.countryItem}
        onPress={() => {
          onSelect(item);
          setSearch("");
          onClose();
        }}
        activeOpacity={0.7}
      >
        <Text style={pickerStyles.flag}>{item.flag}</Text>
        <View style={pickerStyles.countryInfo}>
          <Text style={pickerStyles.countryName}>{item.name}</Text>
          <Text style={pickerStyles.callingCode}>{item.callingCode}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#3B5BDB" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.container}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>Select Country</Text>
            <TouchableOpacity onPress={onClose} style={pickerStyles.closeBtn}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <View style={pickerStyles.searchWrapper}>
            <Ionicons name="search" size={20} color="#64748B" />
            <TextInput
              style={pickerStyles.searchInput}
              placeholder="Search country..."
              placeholderTextColor="#64748B"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={pickerStyles.list}
          />
        </View>
      </View>
    </Modal>
  );
}

const pickerStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end" as const,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0F172A",
  },
  closeBtn: {
    padding: 4,
  },
  searchWrapper: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F0F2F8",
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
  list: {
    paddingHorizontal: 16,
  },
  countryItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 14,
  },
  flag: {
    fontSize: 28,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#0F172A",
  },
  callingCode: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
};
