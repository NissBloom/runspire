"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { createCoachingRequestsTable } from "@/lib/db"

export async function submitCoachingRequest(formData: FormData) {
  try {
    console.log("Submitting coaching request to database:", process.env.POSTGRES_DATABASE || "run_coach")

    // Ensure the table exists
    await createCoachingRequestsTable()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const packageType = formData.get("package") as string
    const goal = formData.get("goal") as string
    const experience = formData.get("experience") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !packageType || !goal) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Insert data into Vercel Postgres
    await sql`
      INSERT INTO coaching_requests (
        first_name, 
        last_name, 
        email, 
        package_type, 
        goal, 
        experience
      ) 
      VALUES (
        ${firstName}, 
        ${lastName}, 
        ${email}, 
        ${packageType}, 
        ${goal}, 
        ${experience}
      )
    `

    console.log("Successfully inserted coaching request into database:", process.env.POSTGRES_DATABASE || "run_coach")

    // Revalidate the page to show fresh data
    revalidatePath("/custom-coaching")
    revalidatePath("/admin")

    return {
      success: true,
      message: "Your coaching request has been submitted successfully!",
    }
  } catch (error) {
    console.error("Error submitting coaching request:", error)
    return {
      success: false,
      message: "There was an error submitting your request. Please try again.",
    }
  }
}
