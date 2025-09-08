"use server"

import { sql } from "@vercel/postgres"
import { v4 as uuidv4 } from "uuid"
import { createTestimonialsTable } from "./actions"

const defaultTestimonials = [
  {
    firstName: "Sarah",
    lastName: "J.",
    email: "sarah.j@example.com",
    achievement: "First Marathon",
    comment:
      "I never thought I could run a marathon, but with the structured plan and support from Runspire, I crossed the finish line with a smile!",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
  },
  {
    firstName: "Michael",
    lastName: "T.",
    email: "michael.t@example.com",
    achievement: "10K Personal Best",
    comment:
      "Shaved 5 minutes off my 10K time in just 8 weeks. The targeted speedwork sessions made all the difference.",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
  },
  {
    firstName: "Elena",
    lastName: "R.",
    email: "elena.r@example.com",
    achievement: "Injury Recovery",
    comment:
      "After a frustrating injury, the custom plan helped me build back safely. Now I'm running stronger than before!",
    rating: 4,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
  },
  {
    firstName: "David",
    lastName: "K.",
    email: "david.k@example.com",
    achievement: "Ultra Marathon Finisher",
    comment:
      "The training plan perfectly balanced building endurance while keeping me healthy. Finished my first 50-miler thanks to this approach!",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
  },
]

export async function seedDefaultTestimonials() {
  try {
    // Ensure the table exists with all required columns
    await createTestimonialsTable()

    // Check if we already have testimonials
    const existingResult = await sql`SELECT COUNT(*) FROM testimonials`
    const count = Number.parseInt(existingResult.rows[0].count)

    // Only seed if we have fewer than the default testimonials
    if (count < defaultTestimonials.length) {
      console.log("Seeding default testimonials...")

      for (const testimonial of defaultTestimonials) {
        // Check if this testimonial already exists (by name and achievement)
        const checkResult = await sql`
          SELECT COUNT(*) FROM testimonials 
          WHERE first_name = ${testimonial.firstName} 
          AND last_name = ${testimonial.lastName}
          AND achievement = ${testimonial.achievement}
        `

        if (Number.parseInt(checkResult.rows[0].count) === 0) {
          // Insert the testimonial
          await sql`
            INSERT INTO testimonials (
              id,
              first_name,
              last_name,
              email,
              achievement,
              comment,
              rating,
              image_url,
              status,
              improvement_feedback
            ) 
            VALUES (
              ${uuidv4()},
              ${testimonial.firstName},
              ${testimonial.lastName},
              ${testimonial.email},
              ${testimonial.achievement},
              ${testimonial.comment},
              ${testimonial.rating},
              ${testimonial.imageUrl},
              ${testimonial.status},
              ${"nothing_great"}
            )
          `
          console.log(`Added testimonial for ${testimonial.firstName} ${testimonial.lastName}`)
        }
      }

      return { success: true, message: "Default testimonials seeded successfully" }
    } else {
      return { success: true, message: "Default testimonials already exist" }
    }
  } catch (error) {
    console.error("Error seeding default testimonials:", error)
    return { success: false, error }
  }
}
