import { validateSignInForm } from "@/core/utils/validators";
import { authService } from "@/features/auth/services/authService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function useSignIn() {
  const router = useRouter();
  const { updateUser, loadProfile } = useUser();
  const { signIn: setAuthSignedIn } = useContext(AuthContext);

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors = validateSignInForm(form);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      const userData = await authService.signIn({
        email: form.email,
        password: form.password,
      });

      updateUser({ id: userData.id, fullName: userData.fullName, email: userData.email });
      await loadProfile();
      setAuthSignedIn();
      router.replace("/home");
    } catch (error: any) {
      console.error("[SignIn] Error:", error.message || error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.message === "Network Error" || error.message?.includes("Network")) {
        setErrors({ general: "Cannot reach the server. Check your connection and make sure the backend is running." });
      } else if (error.message?.includes("timeout") || error.message?.includes("timed out")) {
        setErrors({ general: "Server took too long to respond. Please try again." });
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Unable to connect to server. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSignIn,
  };
}