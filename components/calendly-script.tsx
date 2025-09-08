"use client"

import { useEffect } from "react"

export function CalendlyScript() {
  useEffect(() => {
    // This ensures the Calendly script is loaded and initialized
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Clean up
      document.body.removeChild(script)
    }
  }, [])

  return null
}
