"use client"

import { useEffect } from "react"

export function TestimonialsPreloader() {
  useEffect(() => {
    // Wait for the home page to fully load before preloading testimonials
    const preloadTestimonials = async () => {
      try {
        // Wait a bit to ensure home page is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Preloading testimonials in background...")

        // Fetch 5 testimonials and cache them
        const response = await fetch("/api/testimonials?preview=true")
        const data = await response.json()

        if (data.success && data.testimonials) {
          // Store in sessionStorage for instant access
          sessionStorage.setItem(
            "preloaded-testimonials",
            JSON.stringify({
              testimonials: data.testimonials,
              timestamp: Date.now(),
            }),
          )
          console.log(`Preloaded ${data.testimonials.length} testimonials`)
        }
      } catch (error) {
        console.log("Testimonials preload failed (non-critical):", error)
      }
    }

    // Only preload if we don't already have cached testimonials
    const cached = sessionStorage.getItem("preloaded-testimonials")
    if (!cached) {
      preloadTestimonials()
    }
  }, [])

  // This component renders nothing
  return null
}
