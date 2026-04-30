import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrencyByCountry } from "@/lib/currency";

export async function GET() {
  const headersList = await headers();
  const countryCode = headersList.get("x-vercel-ip-country") || "IL";

  const currency = getCurrencyByCountry(countryCode);

  try {
    // Fetch exchange rate from frankfurter.app (free, no auth required)
    const response = await fetch(`https://api.frankfurter.app/latest?from=ILS&to=${currency.code}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
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
