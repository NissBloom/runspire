"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { createOrGetUser, createTraineesTable, createTestimonialsTable } from "@/lib/db"

export async function submitTestimonial(formData: FormData) {
  try {
    // Ensure tables exist
    await createTraineesTable()
    await createTestimonialsTable()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
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

    // Create or get user
    const userResult = await createOrGetUser(firstName, lastName, email || "")
    if (!userResult.success) {
      return {
        success: false,
        message: "Error creating user account.",
      }
    }

    // Insert testimonial
    const result = await sql`
      INSERT INTO testimonials (
        user_id,
        achievement,
        comment,
        rating,
        image_url,
        improvement_feedback
      ) 
      VALUES (
        ${userResult.userId},
        ${achievement},
        ${comment},
        ${rating},
        ${imageUrl},
        ${improvementFeedback}
      )
      RETURNING id
    `

    const testimonialId = result.rows[0].id

    console.log("Successfully submitted testimonial with ID:", testimonialId, "for user:", userResult.userId)

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
    // Ensure tables exist first
    await createTraineesTable()
    await createTestimonialsTable()

    if (userEmail) {
      // Get user ID first
      const userResult = await sql`
        SELECT id FROM trainees WHERE email = ${userEmail}
      `

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id
        const result = await sql`
          SELECT t.*, tr.first_name, tr.last_name, tr.email
          FROM testimonials t
          JOIN trainees tr ON t.user_id = tr.id
          WHERE (t.status = 'approved' AND t.rating > 3)
             OR (t.user_id = ${userId} AND t.status = 'pending')
          ORDER BY t.created_at DESC
        `
        return result.rows
      }
    }

    // Otherwise just get approved testimonials
    const result = await sql`
      SELECT t.*, tr.first_name, tr.last_name, tr.email
      FROM testimonials t
      JOIN trainees tr ON t.user_id = tr.id
      WHERE t.status = 'approved' AND t.rating > 3
      ORDER BY t.created_at DESC
    `
    return result.rows
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function getAllTestimonials() {
  try {
    // Ensure tables exist first
    await createTraineesTable()
    await createTestimonialsTable()

    // First try to get testimonials with user info via JOIN
    const result = await sql`
      SELECT 
        t.id,
        t.user_id,
        t.achievement,
        t.comment,
        t.rating,
        t.image_url,
        t.improvement_feedback,
        t.status,
        t.created_at,
        COALESCE(tr.first_name, 'Unknown') as first_name,
        COALESCE(tr.last_name, 'User') as last_name,
        COALESCE(tr.email, '') as email
      FROM testimonials t
      LEFT JOIN trainees tr ON t.user_id = tr.id
      ORDER BY t.created_at DESC
    `

    console.log(`Found ${result.rows.length} testimonials in database`)
    return result.rows
  } catch (error) {
    console.error("Error fetching testimonials:", error)

    // Fallback: try to get testimonials without JOIN
    try {
      const fallbackResult = await sql`
        SELECT * FROM testimonials ORDER BY created_at DESC
      `
      console.log(`Fallback query found ${fallbackResult.rows.length} testimonials`)

      // Add default user info for testimonials without user data
      return fallbackResult.rows.map((testimonial) => ({
        ...testimonial,
        first_name: "Unknown",
        last_name: "User",
        email: "",
      }))
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError)
      return []
    }
  }
}
