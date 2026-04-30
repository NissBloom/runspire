import { NextResponse } from "next/server";
import { headers } from "next/server";
import { getCurrencyByCountry } from "@/lib/currency";

// Static exchange rates from ILS to other currencies (as of 2026-04)
// These are approximate and should be updated periodically
const EXCHANGE_RATES: Record<string, number> = {
  ILS: 1,
  USD: 0.27,
  EUR: 0.25,
  GBP: 0.21,
  JPY: 40,
  CNY: 1.95,
  INR: 22.5,
  AUD: 0.42,
  NZD: 0.46,
  SGD: 0.36,
  HKD: 2.1,
  THB: 9.5,
  KRW: 352,
  CAD: 0.38,
  MXN: 4.7,
  BRL: 1.35,
  ARS: 27,
  SAR: 1.01,
  AED: 0.99,
  QAR: 0.98,
  CHF: 0.24,
  SEK: 2.9,
  NOK: 2.8,
  DKK: 1.87,
};

export async function GET() {
  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || "IL";

  const currency = getCurrencyByCountry(countryCode);
  const rate = EXCHANGE_RATES[currency.code] || 1;

  return NextResponse.json({
    countryCode,
    currencyCode: currency.code,
    currencySymbol: currency.symbol,
    rate,
  });
}


    const data = await response.json();
    const rate = data.rates?.[currency.code] || 1;

    return NextResponse.json({
      countryCode,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
      rate,
    });
  } catch (error) {
    console.error("[v0] Currency API error:", error);
    // Fall back to 1:1 rate if API fails
    return NextResponse.json({
      countryCode,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
      rate: 1,
    });
  }
}
