"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { createTestimonialsTable, createTraineesTable } from "@/lib/db"

export async function approveTestimonial(testimonialId: number) {
  try {
    await createTestimonialsTable()

    const result = await sql`
      UPDATE testimonials 
      SET status = 'approved' 
      WHERE id = ${testimonialId}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Testimonial not found",
      }
    }

    revalidatePath("/admin")
    revalidatePath("/testimonials")

    return {
      success: true,
      message: "Testimonial approved successfully",
    }
  } catch (error) {
    console.error("Error approving testimonial:", error)
    return {
      success: false,
      message: "Failed to approve testimonial",
    }
  }
}

export async function rejectTestimonial(testimonialId: number) {
  try {
    await createTestimonialsTable()

    const result = await sql`
      UPDATE testimonials 
      SET status = 'rejected' 
      WHERE id = ${testimonialId}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Testimonial not found",
      }
    }

    revalidatePath("/admin")
    revalidatePath("/testimonials")

    return {
      success: true,
      message: "Testimonial rejected successfully",
    }
  } catch (error) {
    console.error("Error rejecting testimonial:", error)
    return {
      success: false,
      message: "Failed to reject testimonial",
    }
  }
}

export async function updateTestimonial(
  testimonialId: number,
  updates: {
    first_name: string
    last_name: string
    achievement: string
    comment: string
  },
) {
  try {
    await createTestimonialsTable()
    await createTraineesTable()

    // First get the testimonial to find the user_id
    const testimonialResult = await sql`
      SELECT user_id FROM testimonials WHERE id = ${testimonialId}
    `

    if (testimonialResult.rows.length === 0) {
      return {
        success: false,
        message: "Testimonial not found",
      }
    }

    const userId = testimonialResult.rows[0].user_id

    // Update the user information
    await sql`
      UPDATE trainees 
      SET first_name = ${updates.first_name}, last_name = ${updates.last_name}
      WHERE id = ${userId}
    `

    // Update the testimonial information
    await sql`
      UPDATE testimonials 
      SET achievement = ${updates.achievement}, comment = ${updates.comment}
      WHERE id = ${testimonialId}
    `

    revalidatePath("/admin")
    revalidatePath("/testimonials")

    return {
      success: true,
      message: "Testimonial updated successfully",
    }
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return {
      success: false,
      message: "Failed to update testimonial",
    }
  }
}
