"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"

export async function approveTestimonial(id: string) {
  try {
    await sql`
      UPDATE testimonials 
      SET status = 'approved' 
      WHERE id = ${id}
    `

    revalidatePath("/admin")
    revalidatePath("/testimonials")

    return { success: true }
  } catch (error) {
    console.error("Error approving testimonial:", error)
    return { success: false, error }
  }
}

export async function rejectTestimonial(id: string) {
  try {
    await sql`
      UPDATE testimonials 
      SET status = 'rejected' 
      WHERE id = ${id}
    `

    revalidatePath("/admin")

    return { success: true }
  } catch (error) {
    console.error("Error rejecting testimonial:", error)
    return { success: false, error }
  }
}

export async function updateTestimonial(
  id: string,
  data: {
    first_name: string
    last_name: string
    achievement: string
    comment: string
  },
) {
  try {
    await sql`
      UPDATE testimonials 
      SET 
        first_name = ${data.first_name},
        last_name = ${data.last_name},
        achievement = ${data.achievement},
        comment = ${data.comment}
      WHERE id = ${id}
    `

    revalidatePath("/admin")
    revalidatePath("/testimonials")

    return { success: true }
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return { success: false, error }
  }
}
