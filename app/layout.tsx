import type React from "react"
import "./globals.css"
import { Nunito } from "next/font/google"
import { Header } from "@/components/header"
import { TestimonialsProvider } from "./providers/testimonials-provider"
import { FloatingCalendlyButton } from "@/components/floating-calendly-button"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
})

export const metadata = {
  title: "Runspire",
  description: "Your personal running coach, helping you train smarter, run better, and enjoy the journey",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-display`}>
        <Suspense fallback={null}>
          <AnalyticsProvider>
            <TestimonialsProvider>
              <Header />
              {children}
              <FloatingCalendlyButton />
              <SpeedInsights />
            </TestimonialsProvider>
          </AnalyticsProvider>
        </Suspense>
      </body>
    </html>
  )
}
