// features/profile/components/ProfileScreen.tsx
// ✅ Render only — full profile screen matching design

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../hooks/useProfile";
import type {
  AppPreference,
  NotificationSetting,
  PersonalInfoItem,
} from "../types/profile.types";
import { PC, ps } from "./ProfileScreen.styles";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Top Bar ────────────────────────────────────────────────────────────────
function TopBar({
  onBack,
  onSettings,
}: {
  onBack: () => void;
  onSettings: () => void;
}) {
  return (
    <View style={ps.topBar}>
      <TouchableOpacity style={ps.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={22} color={PC.onSurface} />
      </TouchableOpacity>

      <Text style={ps.topBarTitle}>Profile</Text>

      <TouchableOpacity
        style={ps.settingsBtn}
        onPress={onSettings}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={22} color={PC.primary} />
      </TouchableOpacity>
    </View>
  );
}

// ── 2. Avatar + Name + Badge ──────────────────────────────────────────────────
function AvatarSection({
  fullName,
  memberType,
  avatarUri,
  onEdit,
}: {
  fullName: string;
  memberType: string;
  avatarUri: string | null;
  onEdit: () => void;
}) {
  return (
    <View style={ps.avatarSection}>
      {/* Avatar */}
      <View style={ps.avatarWrapper}>
        <View style={ps.avatarCircle}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={ps.avatarImage} />
          ) : (
            <Ionicons name="person" size={52} color={PC.primary} />
          )}
        </View>
        {/* Verified blue badge */}
        <View style={ps.verifiedBadge}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      </View>

      {/* Name */}
      <Text style={ps.userName}>{fullName}</Text>

      {/* Premium badge */}
      <View style={ps.memberBadge}>
        <Ionicons name="star" size={11} color={PC.primary} />
        <Text style={ps.memberText}>{memberType}</Text>
      </View>

      {/* Edit button */}
      <TouchableOpacity style={ps.editBtn} onPress={onEdit} activeOpacity={0.8}>
        <Ionicons name="pencil-outline" size={16} color={PC.primary} />
        <Text style={ps.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── 3. Personal Information Card ──────────────────────────────────────────────
function PersonalInfoCard({
  items,
  onPress,
}: {
  items: PersonalInfoItem[];
  onPress: (id: string) => void;
}) {
  return (
    <>
      <Text style={ps.sectionLabel}>PERSONAL INFORMATION</Text>
      <View style={ps.infoCard}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isEmail = item.id === "email";

          const content = (
            <>
              <View
                style={[
                  ps.infoIconWrapper,
                  { backgroundColor: item.iconBgColor },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.iconColor}
                />
              </View>

              <View style={ps.infoTextBlock}>
                <Text style={ps.infoLabel}>{item.label}</Text>
                <Text style={ps.infoValue}>{item.value}</Text>
              </View>

              {!isEmail && (
                <View style={ps.infoChevron}>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={PC.onVariant}
                  />
                </View>
              )}
            </>
          );

          if (isEmail) {
            return (
              <View
                key={item.id}
                style={[ps.infoRow, !isLast && ps.infoRowBorder]}
              >
                {content}
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={item.id}
              style={[ps.infoRow, !isLast && ps.infoRowBorder]}
              onPress={() => onPress(item.id)}
              activeOpacity={0.7}
            >
              {content}
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

// ── 4. Notification Row ───────────────────────────────────────────────────────
function NotificationCard({
  items,
  onToggle,
}: {
  items: NotificationSetting[];
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <Text style={ps.sectionLabel}>NOTIFICATIONS</Text>
      <View style={ps.notifCard}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <View
              key={item.id}
              style={[ps.notifRow, !isLast && ps.notifRowBorder]}
            >
              {/* Icon */}
              <View
                style={[
                  ps.notifIconWrapper,
                  { backgroundColor: item.iconBgColor },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.iconColor}
                />
              </View>

              {/* Text */}
              <View style={ps.notifTextBlock}>
                <Text style={ps.notifLabel}>{item.label}</Text>
                <Text style={ps.notifDesc}>{item.description}</Text>
              </View>

              {/* Toggle */}
              <TouchableOpacity
                style={[ps.toggle, item.enabled ? ps.toggleOn : ps.toggleOff]}
                onPress={() => onToggle(item.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    ps.toggleThumb,
                    item.enabled ? ps.toggleThumbOn : ps.toggleThumbOff,
                  ]}
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </>
  );
}

// ── 5. App Preferences Card ───────────────────────────────────────────────────
function PreferencesCard({
  items,
  onPress,
}: {
  items: AppPreference[];
  onPress: (id: string) => void;
}) {
  return (
    <>
      <Text style={ps.sectionLabel}>APP PREFERENCES</Text>
      <View style={ps.prefCard}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <TouchableOpacity
              key={item.id}
              style={[ps.prefRow, !isLast && ps.prefRowBorder]}
              onPress={() => onPress(item.id)}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View
                style={[
                  ps.prefIconWrapper,
                  { backgroundColor: item.iconBgColor },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.iconColor}
                />
              </View>

              {/* Label */}
              <Text style={ps.prefLabel}>{item.label}</Text>

              {/* Value + chevron */}
              <View style={ps.prefValueRow}>
                <Text style={ps.prefValue}>{item.value}</Text>
                <Ionicons name="chevron-down" size={16} color={PC.onVariant} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

// ── 6. Log Out ────────────────────────────────────────────────────────────────
function LogOutButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={ps.logOutSection}>
      <TouchableOpacity
        style={ps.logOutBtn}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color={PC.red} />
        <Text style={ps.logOutText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const router = useRouter();
  const {
    user,
    personalInfo,
    notifications,
    preferences,
    toggleNotification,
    cyclePreference,
    handleEditProfile,
    handleLogOut,
    handleSettings,
    handleInfoPress,
  } = useProfile();

  return (
    <View style={ps.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={PC.surface} />

      {/* Top bar — fixed above scroll */}
      <TopBar onBack={() => router.back()} onSettings={handleSettings} />

      <ScrollView
        contentContainerStyle={ps.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 — Avatar + Name */}
        <AvatarSection
          fullName={user.fullName}
          memberType={user.memberType}
          avatarUri={user.avatarUri}
          onEdit={handleEditProfile}
        />

        {/* 2 — Personal Info */}
        <PersonalInfoCard items={personalInfo} onPress={handleInfoPress} />

        {/* 3 — Notifications */}
        <NotificationCard items={notifications} onToggle={toggleNotification} />

        {/* 4 — App Preferences */}
        <PreferencesCard items={preferences} onPress={cyclePreference} />

        {/* 5 — Log Out */}
        <LogOutButton onPress={handleLogOut} />
      </ScrollView>
    </View>
  );
}
