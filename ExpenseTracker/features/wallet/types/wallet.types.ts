// features/wallet/types/wallet.types.ts

export interface Card {
  id: string;
  label: string; // "ACTIVE CARD" / "SECOND CARD"
  name: string; // "Digital Black"
  last4: string; // "1095"
  expiry: string; // "08/28"
  network: string; // "VISA" / "GLOBAL"
  isDark: boolean; // dark card = true, light = false
  color1: string; // gradient start
  color2: string; // gradient end
}

export interface Account {
  id: string;
  name: string; // "Main Checking"
  bank: string; // "Chase"
  last4: string; // "4421"
  balance: number;
  icon: string; // Ionicons name
  iconBgColor: string;
  iconColor: string;
  badge?: string; // "4.2% APY"
  badgeColor?: string;
}

export interface WalletActivity {
  id: string;
  title: string;
  time: string;
  amount: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}
