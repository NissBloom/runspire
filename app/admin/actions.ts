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
