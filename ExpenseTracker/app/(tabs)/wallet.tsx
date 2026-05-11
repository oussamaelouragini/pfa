// app/(tabs)/wallet.tsx
// ✅ Screen file — thin, just renders
// ✅ ScreenWrapper bédal SafeAreaView direct
// ✅ edges sans "bottom" — tab bar yji min _layout.tsx

import ScreenWrapper from "@/core/components/ScreenWrapper";
import WalletScreen from "@/features/wallet/components/WalletScreen";

export default function WalletTab() {
  return (
    <ScreenWrapper
      backgroundColor="#F0F2F8"
      edges={["top", "left", "right"]} // ⚠️ sans bottom — tab bar géré par _layout
    >
      <WalletScreen />
    </ScreenWrapper>
  );
}
