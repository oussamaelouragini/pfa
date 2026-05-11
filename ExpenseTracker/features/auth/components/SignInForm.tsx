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
        {/* ── Top Bar: Logo + Back to website ── */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="wallet-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.logoText}>Nexus</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.backText}>Back to website</Text>
          </TouchableOpacity>
        </View>

        {/* ── White Card ── */}
        <View style={styles.card}>
          {/* Headline */}
          <Text style={styles.headline}>Sign in</Text>
          <Text style={styles.subtitle}>
            Welcome back to your financial hub.
          </Text>

          {/* ── Email ── */}
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

          {/* ── Sign In Button ── */}
          <TouchableOpacity
            style={[styles.ctaButton, loading && styles.ctaDisabled]}
            onPress={handleSignIn}
            disabled={loading}
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

          {/* ── Divider ── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Social Buttons ── */}
          <View style={styles.socialRow}>
            {/* Google */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              {/* Google G colored icon using text trick */}
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
              <Ionicons
                name="logo-apple"
                size={20}
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer: Create Account ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Dont have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/sign-up")}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Bottom Links ── */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity>
            <Text style={styles.bottomLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>•</Text>
          <TouchableOpacity>
            <Text style={styles.bottomLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.dot}>•</Text>
          <TouchableOpacity>
            <Text style={styles.bottomLinkText}>Help Center</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
