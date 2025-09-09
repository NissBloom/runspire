"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { createTestimonialsTable, createTraineesTable } from "@/lib/db"

const IS_PROD = process.env.NODE_ENV === "production"

export interface Testimonial {
  id: number
  first_name: string
  last_name: string
  achievement: string
  comment: string
  rating: number
  status: string
  created_at: string
  user_id: number
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    // Only create tables in development - skip in production for speed
    if (!IS_PROD) {
      await createTestimonialsTable()
      await createTraineesTable()
    }

    const result = await sql`
      SELECT 
        t.id,
        COALESCE(tr.first_name, 'Unknown') as first_name,
        COALESCE(tr.last_name, 'User') as last_name,
        t.achievement,
        t.comment,
        t.rating,
        t.status,
        t.created_at,
        t.user_id
      FROM testimonials t
      LEFT JOIN trainees tr ON t.user_id = tr.id
      ORDER BY t.created_at DESC
    `

    return result.rows as Testimonial[]
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
}

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    // Only create tables in development - skip in production for speed
    if (!IS_PROD) {
      await createTestimonialsTable()
      await createTraineesTable()
    }

    const result = await sql`
      SELECT 
        t.id,
        COALESCE(tr.first_name, 'Unknown') as first_name,
        COALESCE(tr.last_name, 'User') as last_name,
        t.achievement,
        t.comment,
        t.rating,
        t.status,
        t.created_at,
        t.user_id
      FROM testimonials t
      LEFT JOIN trainees tr ON t.user_id = tr.id
      WHERE t.status = 'approved'
      ORDER BY t.created_at DESC
    `

    return result.rows as Testimonial[]
  } catch (error) {
    console.error("Error fetching approved testimonials:", error)
    return []
  }
}

export async function getTestimonialsPreview(limit = 5): Promise<Testimonial[]> {
  try {
    // Only create tables in development - skip in production for speed
    if (!IS_PROD) {
      await createTestimonialsTable()
      await createTraineesTable()
    }

    const result = await sql`
      SELECT 
        t.id,
        COALESCE(tr.first_name, 'Unknown') as first_name,
        COALESCE(tr.last_name, 'User') as last_name,
        t.achievement,
        t.comment,
        t.rating,
        t.status,
        t.created_at,
        t.user_id
      FROM testimonials t
      LEFT JOIN trainees tr ON t.user_id = tr.id
      WHERE t.status = 'approved'
      ORDER BY t.created_at DESC
      LIMIT ${limit}
    `

    return result.rows as Testimonial[]
  } catch (error) {
    console.error("Error fetching preview testimonials:", error)
    return []
  }
}

export async function submitTestimonial(formData: FormData) {
  try {
    await createTestimonialsTable()
    await createTraineesTable()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const achievement = formData.get("achievement") as string
    const comment = formData.get("comment") as string
    const rating = Number.parseInt(formData.get("rating") as string)

    // First, insert or get the trainee
    const userResult = await sql`
      SELECT id FROM trainees WHERE email = ${email}
    `

    let userId: number

    if (userResult.rows.length === 0) {
      // Create new trainee
      const newUserResult = await sql`
        INSERT INTO trainees (first_name, last_name, email, created_at)
        VALUES (${firstName}, ${lastName}, ${email}, NOW())
        RETURNING id
      `
      userId = newUserResult.rows[0].id
    } else {
      userId = userResult.rows[0].id
      // Update existing trainee info
      await sql`
        UPDATE trainees 
        SET first_name = ${firstName}, last_name = ${lastName}
        WHERE id = ${userId}
      `
    }

    // Insert the testimonial
    await sql`
      INSERT INTO testimonials (user_id, achievement, comment, rating, status, created_at)
      VALUES (${userId}, ${achievement}, ${comment}, ${rating}, 'pending', NOW())
    `

    revalidatePath("/testimonials")
    revalidatePath("/admin")

    return { success: true, message: "Testimonial submitted successfully!" }
  } catch (error) {
    console.error("Error submitting testimonial:", error)
    return { success: false, message: "Failed to submit testimonial. Please try again." }
  }
}
