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
  const { updateUser } = useUser();
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

      updateUser(userData);
      setAuthSignedIn();
      router.replace("/");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
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