"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingCalendlyButton() {
  const [isOpen, setIsOpen] = useState(false)

  const openCalendly = () => {
    window.open("https://calendly.com/nissbloom/30min", "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={openCalendly}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        <Calendar className="h-6 w-6 mr-2" />
        Book Call
      </Button>
    </div>
  )
}
