import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./SignUpForm.styles"; // ← styles come from here

export default function SignUpForm() {
  const router = useRouter();
  const {
    form,
    errors,
    loading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSignUp,
  } = useSignUp();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand ── */}
        <View style={styles.brand}>
          <View style={styles.logoWrapper}>
            <Ionicons name="wallet-outline" size={26} color="#3B5BDB" />
          </View>
          <Text style={styles.brandName}>EXPENSE TRACKER</Text>
        </View>

        {/* ── Headline ── */}
        <Text style={styles.headline}>Create Account</Text>
        <Text style={styles.subtitle}>
          Take control of your finances and start growing.
        </Text>

        {/* ── Full Name ── */}
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <View
            style={[styles.inputWrapper, errors.fullName && styles.inputError]}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#9CA3AF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={form.fullName}
              onChangeText={(v) => handleChange("fullName", v)}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          {/* ── Email ── */}
          <Text style={[styles.label, { marginTop: 16 }]}>Email Address</Text>
          <View
            style={[styles.inputWrapper, errors.email && styles.inputError]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="#9CA3AF"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#9CA3AF"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* ── Password ── */}
          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View
            style={[styles.inputWrapper, errors.password && styles.inputError]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Create a strong password"
              placeholderTextColor="#9CA3AF"
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              secureTextEntry={!showPassword}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((p) => !p)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* ── CTA Button ── */}
        <TouchableOpacity
          style={[styles.ctaButton, loading && styles.ctaDisabled]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.ctaText}>Create Account</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or sign up with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Social Buttons ── */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Ionicons
              name="logo-google"
              size={18}
              color="#4285F4"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Ionicons
              name="logo-apple"
              size={18}
              color="#000"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
