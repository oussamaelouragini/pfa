import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");

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
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Ionicons name="key-outline" size={32} color="#3B5BDB" />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries, we'll send you reset instructions.
          </Text>
        </View>

        {/* Email Input */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Reset Password</Text>
        </TouchableOpacity>

        {/* Back to Sign In */}
        <TouchableOpacity
          style={styles.backToSignIn}
          onPress={() => router.push("/auth/sign-in")}
        >
          <Ionicons name="arrow-back" size={16} color="#3B5BDB" />
          <Text style={styles.backToSignInText}> Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, flexGrow: 1 },
  topBar: { marginBottom: 24 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: { alignItems: "center", marginBottom: 32 },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#64748B", textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#0F172A" },
  ctaButton: {
    backgroundColor: "#3B5BDB",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  ctaText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  backToSignIn: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  backToSignInText: { fontSize: 15, fontWeight: "600", color: "#3B5BDB" },
});
