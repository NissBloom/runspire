"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function createTestimonialsTable() {
  try {
    // First, create the table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        achievement VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        rating INTEGER NOT NULL,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Check if improvement_feedback column exists, and add it if it doesn't
    try {
      await sql`
        ALTER TABLE testimonials 
        ADD COLUMN IF NOT EXISTS improvement_feedback TEXT;
      `
      console.log("Added improvement_feedback column to testimonials table")
    } catch (columnError) {
      if (!columnError.message.includes("already exists")) {
        throw columnError
      }
      console.log("improvement_feedback column already exists")
    }

    // Check if email column exists, and add it if it doesn't
    try {
      await sql`
        ALTER TABLE testimonials 
        ADD COLUMN IF NOT EXISTS email TEXT;
      `
      console.log("Added email column to testimonials table")
    } catch (columnError) {
      if (!columnError.message.includes("already exists")) {
        throw columnError
      }
      console.log("email column already exists")
    }

    console.log("Created/updated testimonials table successfully")
    return { success: true }
  } catch (error) {
    console.error("Error creating/updating testimonials table:", error)
    return { success: false, error }
  }
}

export async function submitTestimonial(formData: FormData) {
  try {
    // Ensure the table exists with the required columns
    await createTestimonialsTable()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string // Add email field
    const achievement = formData.get("achievement") as string
    const comment = formData.get("comment") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const imageUrl = (formData.get("imageUrl") as string) || "/placeholder.svg?height=80&width=80"
    const improvementFeedback = (formData.get("improvementFeedback") as string) || ""

    // Validate required fields
    if (!firstName || !lastName || !achievement || !comment || isNaN(rating)) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Generate a unique ID for the testimonial
    const testimonialId = uuidv4()

    // Insert data into Vercel Postgres
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
        improvement_feedback
      ) 
      VALUES (
        ${testimonialId},
        ${firstName},
        ${lastName},
        ${email},
        ${achievement},
        ${comment},
        ${rating},
        ${imageUrl},
        ${improvementFeedback}
      )
    `

    console.log("Successfully submitted testimonial")

    // Revalidate the page to show fresh data
    revalidatePath("/testimonials")

    return {
      success: true,
      message: "Your testimonial has been submitted successfully!",
      testimonial: {
        id: testimonialId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        achievement: achievement,
        comment: comment,
        rating: rating,
        image_url: imageUrl,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    return {
      success: false,
      message: "There was an error submitting your testimonial. Please try again.",
    }
  }
}

export async function getApprovedTestimonials(userEmail?: string) {
  try {
    // If user email is provided, include their pending testimonials too
    if (userEmail) {
      const result = await sql`
        SELECT * FROM testimonials 
        WHERE (status = 'approved' AND rating > 3)
           OR (email = ${userEmail} AND status = 'pending')
        ORDER BY created_at DESC
      `
      return result.rows
    } else {
      // Otherwise just get approved testimonials
      const result = await sql`
        SELECT * FROM testimonials 
        WHERE status = 'approved' AND rating > 3
        ORDER BY created_at DESC
      `
      return result.rows
    }
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function getAllTestimonials() {
  try {
    const result = await sql`
      SELECT * FROM testimonials 
      ORDER BY created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}
