"use server"
import { createTestimonialsTable, createTraineesTable } from "@/lib/db"

export async function seedDefaultTestimonials() {
  try {
    // Ensure the tables exist with all required columns
    await createTraineesTable()
    await createTestimonialsTable()

    // No longer seed default testimonials - just ensure tables exist
    return { success: true, message: "Testimonials table ready" }
  } catch (error) {
    console.error("Error preparing testimonials table:", error)
    return { success: false, error }
  }
}
