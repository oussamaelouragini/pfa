import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CurrencyCode } from "@/utils/currency";
import { useUser } from "./UserProvider";

const STORAGE_KEY = "primaryCurrency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TND",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("TND");
  const { updateUser } = useUser();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored && ["TND", "USD", "EUR", "GBP"].includes(stored)) {
        setCurrencyState(stored as CurrencyCode);
      }
    });
  }, []);

  const setCurrency = useCallback(
    (code: CurrencyCode) => {
      setCurrencyState(code);
      AsyncStorage.setItem(STORAGE_KEY, code);
      updateUser({ primaryCurrency: code });
    },
    [updateUser],
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
