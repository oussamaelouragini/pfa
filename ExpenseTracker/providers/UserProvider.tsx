import React, { createContext, useContext, useState, useCallback } from "react";

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
  isLoading: false,
  isHydrated: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(true);

  const updateUser = useCallback((updates: Partial<UserProfile> | null) => {
    if (updates === null) {
      setUser(defaultUser);
    } else {
      setUser((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(defaultUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, isLoading, isHydrated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
