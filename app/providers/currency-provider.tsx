"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Currency } from "@/lib/currency";

const CurrencyContext = createContext<Currency | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("/api/currency");
        const data = await response.json();
        setCurrency(data);
      } catch (error) {
        console.error("[v0] Failed to fetch currency:", error);
        // Default to ILS if fetch fails
        setCurrency({
          code: "ILS",
          symbol: "₪",
          rate: 1,
          countryCode: "IL",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, []);

  // Show default while loading to avoid hydration mismatch
  if (loading) {
    return (
      <CurrencyContext.Provider
        value={{
          code: "ILS",
          symbol: "₪",
          rate: 1,
          countryCode: "IL",
        }}
      >
        {children}
      </CurrencyContext.Provider>
    );
  }

  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const currency = useContext(CurrencyContext);
  if (!currency) {
    return {
      code: "ILS",
      symbol: "₪",
      rate: 1,
      countryCode: "IL",
    };
  }
  return currency;
}
