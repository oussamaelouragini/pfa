import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { profileService } from "@/features/profile/services/profileService";
import apiClient from "@/lib/apiClient";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  address: string;
  memberType: "PREMIUM MEMBER" | "STANDARD MEMBER";
  avatarUri: string | null;
  primaryCurrency: string;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile> | null) => void;
  clearUser: () => void;
  loadProfile: () => Promise<void>;
  isLoading: boolean;
  isHydrated: boolean;
}

const defaultUser: UserProfile = {
  id: "",
  fullName: "",
  email: "",
  phone: "",
  countryCode: "+216",
  address: "",
  memberType: "STANDARD MEMBER",
  avatarUri: null,
  primaryCurrency: "TND",
};

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  updateUser: () => {},
  clearUser: () => {},
  loadProfile: async () => {},
  isLoading: false,
  isHydrated: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const loadRef = useRef(false);

  const updateUser = useCallback((updates: Partial<UserProfile> | null) => {
    if (updates === null) {
      setUser(defaultUser);
    } else {
      setUser((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(defaultUser);
    loadRef.current = false;
  }, []);

  const loadProfile = useCallback(async () => {
    if (loadRef.current) return;
    loadRef.current = true;
    setIsLoading(true);
    try {
      const data = await profileService.getProfile();
      const baseUrl = apiClient.defaults.baseURL || "http://172.20.10.3:5000";
      const avatarUri = data.avatarUrl
        ? data.avatarUrl.startsWith("http")
          ? data.avatarUrl
          : `${baseUrl}${data.avatarUrl}`
        : null;
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        countryCode: data.countryCode,
        address: data.address,
        memberType: data.memberType as "PREMIUM MEMBER" | "STANDARD MEMBER",
        avatarUri,
        primaryCurrency: data.primaryCurrency,
      });
    } catch (err) {
      console.warn("Failed to load profile:", err);
    } finally {
      setIsLoading(false);
      setIsHydrated(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loadProfile, isLoading, isHydrated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
