// ─── Reusable field validators ───────────────────────────────────────────────

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
  return undefined;
};

const validatePassword = (
  password: string,
  minLength: number = 8,
): string | undefined => {
  if (!password) return "Password is required";
  if (password.length < minLength)
    return `Password must be at least ${minLength} characters`;
  return undefined;
};

const validateFullName = (fullName: string): string | undefined => {
  if (!fullName.trim()) return "Full name is required";
  return undefined;
};

// ─── Form validators ────────────────────────────────────────────────────────

export function validateSignInForm(form: { email: string; password: string }) {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(form.email);
  const passwordError = validatePassword(form.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateSignUpForm(form: {
  fullName: string;
  email: string;
  password: string;
}) {
  const errors: Record<string, string> = {};
  const fullNameError = validateFullName(form.fullName);
  const emailError = validateEmail(form.email);
  const passwordError = validatePassword(form.password);

  if (fullNameError) errors.fullName = fullNameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}
