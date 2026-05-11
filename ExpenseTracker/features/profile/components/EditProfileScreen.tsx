// features/profile/components/EditProfileScreen.tsx
// ✅ Render only — Edit Profile screen matching design

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CountryPickerModal } from "./CountryPickerModal";
import { useEditProfile } from "../hooks/useEditProfile";
import { EC, es } from "./EditProfileScreen.styles";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Top Bar ────────────────────────────────────────────────────────────────
function TopBar({
  onBack,
  onSave,
  loading,
}: {
  onBack: () => void;
  onSave: () => void;
  loading: boolean;
}) {
  return (
    <View style={es.topBar}>
      <TouchableOpacity style={es.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color={EC.onSurface} />
      </TouchableOpacity>

      <Text style={es.topBarTitle}>Edit Profile</Text>

      <TouchableOpacity
        style={[es.saveBtn, loading && es.saveBtnDisabled]}
        onPress={onSave}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={EC.primary} />
        ) : (
          <Text style={es.saveBtnText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ── 2. Avatar Section ─────────────────────────────────────────────────────────
function AvatarSection({
  fullName,
  avatarUri,
  onPickImage,
}: {
  fullName: string;
  avatarUri: string | null;
  onPickImage: () => void;
}) {
  const userId = "294-883-2026";

  return (
    <View style={es.avatarSection}>
      <View style={es.avatarWrapper}>
        <TouchableOpacity
          style={es.avatarCircle}
          onPress={onPickImage}
          activeOpacity={0.8}
        >
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={es.avatarImage} />
          ) : (
            <Ionicons name="person" size={46} color={EC.primary} />
          )}
        </TouchableOpacity>
        {/* Camera button */}
        <TouchableOpacity style={es.cameraBtn} onPress={onPickImage} activeOpacity={0.8}>
          <Ionicons name="camera" size={14} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={es.avatarName}>{fullName}</Text>
      <Text style={es.avatarId}>ID: {userId}</Text>
    </View>
  );
}

// ── 3. Form Field ─────────────────────────────────────────────────────────────
function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  keyboardType = "default",
  multiline = false,
  autoCapitalize = "words",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
  autoCapitalize?: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={es.fieldBlock}>
      <Text style={es.fieldLabel}>{label}</Text>
      <View
        style={[
          es.inputWrapper,
          focused && es.inputWrapperFocused,
          !!error && es.inputWrapperError,
        ]}
      >
        <TextInput
          style={[es.input, multiline && es.inputMultiline]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={EC.onVariant}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {!!error && <Text style={es.errorText}>{error}</Text>}
    </View>
  );
}

// ── 3b. Phone Input with Country Code ───────────────────────────────────────
function PhoneInputWithCountry({
  label,
  value,
  countryCode,
  onChange,
  onCountryChange,
  error,
}: {
  label: string;
  value: string;
  countryCode: string;
  onChange: (v: string) => void;
  onCountryChange: (code: string) => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={es.fieldBlock}>
      <Text style={es.fieldLabel}>{label}</Text>
      <View
        style={[
          es.phoneInputWrapper,
          focused && es.inputWrapperFocused,
          !!error && es.inputWrapperError,
        ]}
      >
        {/* Country Code Button */}
        <TouchableOpacity
          style={es.countryCodeBtn}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={es.countryCodeText}>{countryCode}</Text>
          <Ionicons name="chevron-down" size={14} color={EC.onVariant} />
        </TouchableOpacity>

        {/* Divider */}
        <View style={es.phoneDivider} />

        {/* Phone Input */}
        <TextInput
          style={es.phoneInput}
          value={value}
          onChangeText={onChange}
          placeholder="XX XXX XXXX"
          placeholderTextColor={EC.onVariant}
          keyboardType="phone-pad"
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {!!error && <Text style={es.errorText}>{error}</Text>}

      <CountryPickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(country) => onCountryChange(country.callingCode)}
        selectedCode={countryCode}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function EditProfileScreen() {
  const {
    form,
    errors,
    loading,
    avatarUri,
    handleChange,
    handleSave,
    handleBack,
    pickImage,
    countryCode,
  } = useEditProfile();

  return (
    <View style={es.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={EC.surface} />

      {/* Top bar — fixed */}
      <TopBar onBack={handleBack} onSave={handleSave} loading={loading} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={es.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1 — Avatar */}
          <AvatarSection
            fullName={form.fullName}
            avatarUri={avatarUri}
            onPickImage={pickImage}
          />

          {/* 2 — Full Name */}
          <FormField
            label="FULL NAME"
            value={form.fullName}
            onChange={(v) => handleChange("fullName", v)}
            error={errors.fullName}
            placeholder="Enter your full name"
          />

          {/* 3 — Phone */}
          <PhoneInputWithCountry
            label="PHONE NUMBER"
            value={form.phone}
            countryCode={countryCode}
            onChange={(v) => handleChange("phone", v)}
            onCountryChange={(code) => handleChange("countryCode", code)}
            error={errors.phone}
          />

          {/* 4 — Address */}
          <FormField
            label="RESIDENTIAL ADDRESS"
            value={form.address}
            onChange={(v) => handleChange("address", v)}
            error={errors.address}
            placeholder="Enter your address"
            multiline={true}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
