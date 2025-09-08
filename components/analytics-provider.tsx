"use client"

import type React from "react"

import Script from "next/script"
import { env } from "@/lib/env"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${env.GA_MEASUREMENT_ID}');
        `}
      </Script>
      {children}
    </>
  )
}
