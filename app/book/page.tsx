"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Calendly: any
  }
}

export default function BookPage() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/nissbloom/30min",
          parentElement: document.getElementById("calendly-inline-widget"),
          prefill: {},
          utm: {},
        })
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Free Consultation</h1>
          <p className="text-xl text-gray-600">Let's discuss your running goals and create a personalized plan</p>
        </div>

        <div
          id="calendly-inline-widget"
          style={{ minWidth: "320px", height: "700px" }}
          className="bg-white rounded-lg shadow-lg"
        ></div>
      </div>
    </div>
  )
}
