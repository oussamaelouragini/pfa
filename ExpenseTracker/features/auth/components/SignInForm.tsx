import { useGoogleSignIn } from "@/features/auth/hooks/useGoogleSignIn";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
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
import { styles } from "./SignInForm.styles";

export default function SignInForm() {
  const router = useRouter();
  const {
    form,
    errors,
    loading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSignIn,
  } = useSignIn();

  const { googleLoading, handleGoogleSignIn, isConfigured } = useGoogleSignIn();

  const isBusy = loading || googleLoading;

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
        <Text style={styles.headline}>Sign In</Text>
        <Text style={styles.subtitle}>
          Welcome back to your financial hub.
        </Text>

        {/* ── Form ── */}
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
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
              editable={!isBusy}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* ── Password ── */}
          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot?</Text>
            </TouchableOpacity>
          </View>
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
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
              editable={!isBusy}
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

        {/* ── Sign In Button ── */}
        <TouchableOpacity
          style={[styles.ctaButton, isBusy && styles.ctaDisabled]}
          onPress={handleSignIn}
          disabled={isBusy}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.ctaText}>Sign In</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </>
          )}
        </TouchableOpacity>

        {/* ── Google Sign-In ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialBtn, googleLoading && styles.socialDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isBusy || !isConfigured}
            activeOpacity={0.8}
          >
            {googleLoading ? (
              <ActivityIndicator color="#4285F4" />
            ) : (
              <>
                <Ionicons
                  name="logo-google"
                  size={18}
                  color="#4285F4"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.socialText}>Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
