import ScreenWrapper from "@/core/components/ScreenWrapper";
import StatsScreen from "@/features/stats/components/StatsScreen";

export default function StatsTab() {
  return (
    <ScreenWrapper backgroundColor="#F0F2F8" edges={["top", "left", "right"]}>
      <StatsScreen />
    </ScreenWrapper>
  );
}
