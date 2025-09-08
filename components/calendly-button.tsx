"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface CalendlyButtonProps {
  text?: string
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function CalendlyButton({
  text = "Book Free Consultation",
  variant = "default",
  size = "default",
  className = "",
}: CalendlyButtonProps) {
  const openCalendly = () => {
    window.open("https://calendly.com/nissbloom/30min", "_blank")
  }

  return (
    <Button
      onClick={openCalendly}
      variant={variant}
      size={size}
      className={`${className} inline-flex items-center gap-2`}
    >
      <Calendar className="h-4 w-4" />
      {text}
    </Button>
  )
}
