import ScreenWrapper from "@/core/components/ScreenWrapper";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function SignUpScreen() {
  return (
    // edges top+bottom — full screen protection
    <ScreenWrapper backgroundColor="#F0F4FF">
      <SignUpForm />
    </ScreenWrapper>
  );
}
