// app/(tabs)/profile/edit.tsx
// ✅ Edit Profile screen — accessible via router.push("/(tabs)/profile/edit")
// ✅ Full screen edges — no tab bar on this screen

import ScreenWrapper from "@/core/components/ScreenWrapper";
import EditProfileScreen from "@/features/profile/components/EditProfileScreen";

export default function EditProfileRoute() {
  return (
    <ScreenWrapper backgroundColor="#F0F2F8">
      <EditProfileScreen />
    </ScreenWrapper>
  );
}
