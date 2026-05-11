// app/(tabs)/profile.tsx
// ✅ Screen entry — thin, just renders
// ✅ edges sans "bottom" — tab bar géré par _layout.tsx

import ScreenWrapper from "@/core/components/ScreenWrapper";
import ProfileScreen from "@/features/profile/components/ProfileScreen";

export default function ProfileTab() {
  return (
    <ScreenWrapper backgroundColor="#F0F2F8" edges={["top", "left", "right"]}>
      <ProfileScreen />
    </ScreenWrapper>
  );
}
