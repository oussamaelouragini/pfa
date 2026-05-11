// features/profile/types/profile.types.ts — UPDATED

export interface UserProfile {
  id: string; // "294-883-2026"
  fullName: string;
  memberType: "PREMIUM MEMBER" | "STANDARD MEMBER";
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
}

export interface EditProfileForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface EditProfileErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface SecurityItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  type: "check" | "chevron"; // check = verified, chevron = navigable
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  enabled: boolean;
}

export interface AppPreference {
  id: string;
  label: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  value: string;
  options: string[];
}

export interface PersonalInfoItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}
