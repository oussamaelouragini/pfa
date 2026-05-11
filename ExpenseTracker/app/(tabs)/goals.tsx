// app/(tabs)/goals.tsx
// ✅ Screen entry — thin, just renders
// ✅ edges sans "bottom" — tab bar géré par _layout.tsx

import ScreenWrapper from "@/core/components/ScreenWrapper";
import GoalsScreen from "@/features/goals/components/GoalsScreen";

export default function GoalsTab() {
  return (
    <ScreenWrapper backgroundColor="#f5f7f9" edges={["top", "left", "right"]}>
      <GoalsScreen />
    </ScreenWrapper>
  );
}
