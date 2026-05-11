import ScreenWrapper from "@/core/components/ScreenWrapper";
import AddTransactionScreen from "@/features/transactions/components/AddTransactionScreen";

export default function AddExpenseTab() {
  return (
    <ScreenWrapper backgroundColor="#F0F2F8">
      <AddTransactionScreen />
    </ScreenWrapper>
  );
}
