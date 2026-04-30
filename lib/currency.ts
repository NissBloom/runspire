// Country code to currency mapping
export const countryToCurrency: Record<string, { code: string; symbol: string }> = {
  // Middle East
  IL: { code: "ILS", symbol: "₪" },
  SA: { code: "SAR", symbol: "﷼" },
  AE: { code: "AED", symbol: "د.إ" },
  QA: { code: "QAR", symbol: "﷼" },
  
  // Europe
  GB: { code: "GBP", symbol: "£" },
  DE: { code: "EUR", symbol: "€" },
  FR: { code: "EUR", symbol: "€" },
  IT: { code: "EUR", symbol: "€" },
  ES: { code: "EUR", symbol: "€" },
  NL: { code: "EUR", symbol: "€" },
  BE: { code: "EUR", symbol: "€" },
  AT: { code: "EUR", symbol: "€" },
  CH: { code: "CHF", symbol: "CHF" },
  SE: { code: "SEK", symbol: "kr" },
  NO: { code: "NOK", symbol: "kr" },
  DK: { code: "DKK", symbol: "kr" },
  
  // Americas
  US: { code: "USD", symbol: "$" },
  CA: { code: "CAD", symbol: "$" },
  MX: { code: "MXN", symbol: "$" },
  BR: { code: "BRL", symbol: "R$" },
  AR: { code: "ARS", symbol: "$" },
  
  // Asia
  JP: { code: "JPY", symbol: "¥" },
  CN: { code: "CNY", symbol: "¥" },
  IN: { code: "INR", symbol: "₹" },
  AU: { code: "AUD", symbol: "$" },
  NZ: { code: "NZD", symbol: "$" },
  SG: { code: "SGD", symbol: "$" },
  HK: { code: "HKD", symbol: "$" },
  TH: { code: "THB", symbol: "฿" },
  KR: { code: "KRW", symbol: "₩" },
};

// Default to ILS if country is not found
const DEFAULT_CURRENCY = { code: "ILS", symbol: "₪" };

export function getCurrencyByCountry(countryCode: string) {
  return countryToCurrency[countryCode] || DEFAULT_CURRENCY;
}

// Round to nearest 5
function roundToNearest5(num: number): number {
  return Math.round(num / 5) * 5;
}

// Format price with conversion and rounding
export function formatPrice(
  baseAmountILS: number,
  exchangeRate: number,
  currencyCode: string,
  currencySymbol: string
): string {
  const converted = baseAmountILS * exchangeRate;
  const rounded = roundToNearest5(converted);

  // Format with appropriate locale
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(rounded);
}

export type Currency = {
  code: string;
  symbol: string;
  rate: number;
  countryCode: string;
};
