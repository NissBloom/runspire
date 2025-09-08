"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getApprovedTestimonials } from "../testimonials/actions"
import { seedDefaultTestimonials } from "../testimonials/seed"

// Define the context type
type TestimonialsContextType = {
  testimonials: any[]
  loading: boolean
  error: string | null
  refreshTestimonials: (email?: string) => Promise<void>
}

// Create the context with default values
const TestimonialsContext = createContext<TestimonialsContextType>({
  testimonials: [],
  loading: true,
  error: null,
  refreshTestimonials: async () => {},
})

// Hook to use the testimonials context
export const useTestimonials = () => useContext(TestimonialsContext)

// Provider component
export function TestimonialsProvider({ children }: { children: React.ReactNode }) {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to refresh testimonials
  const refreshTestimonials = useCallback(async (email?: string) => {
    try {
      setLoading(true)
      // Get user email from localStorage if not provided
      const userEmail = email || localStorage.getItem("userEmail")
      const data = await getApprovedTestimonials(userEmail)
      setTestimonials(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching testimonials:", err)
      setError("Failed to load testimonials")
    } finally {
      setLoading(false)
    }
  }, [])

  // Load testimonials on initial mount
  useEffect(() => {
    async function initializeTestimonials() {
      try {
        // Just ensure table exists, don't seed default testimonials
        await seedDefaultTestimonials()
        // Then load testimonials
        await refreshTestimonials()
      } catch (err) {
        console.error("Error initializing testimonials:", err)
        setError("Failed to initialize testimonials")
        setLoading(false)
      }
    }

    initializeTestimonials()
  }, [refreshTestimonials])

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        loading,
        error,
        refreshTestimonials,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  )
}
