import { validateSignUpForm } from "@/core/utils/validators";
import { authService } from "@/features/auth/services/authService";
import { SignUpPayload } from "@/features/auth/types/auth.types";
import { AuthContext } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { useUser } from "@/providers/UserProvider";

export function useSignUp() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const { updateUser } = useUser();
  const [form, setForm] = useState<SignUpPayload>({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpPayload, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSignUp = async () => {
    const validationErrors = validateSignUpForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const userData = await authService.signUp(form);
      updateUser(userData);
      signIn();
      router.replace("/");
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setErrors({ email: error.response.data.message });
      } else {
        setErrors({ email: "Registration failed. Please try again." });
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
    handleSignUp,
  };
}