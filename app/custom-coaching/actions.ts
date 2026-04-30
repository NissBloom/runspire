"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import {
  createOrGetUser,
  goalToKilometers,
  experienceToNumber,
  createTraineesTable,
  createCoachingRequestsTable,
} from "@/lib/db"

export async function submitCoachingRequest(formData: FormData) {
  try {
    console.log("Submitting coaching request to database:", process.env.POSTGRES_DATABASE || "run_coach")

    // Ensure tables exist
    await createTraineesTable()
    await createCoachingRequestsTable()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const packageType = formData.get("package") as string
    const goalString = formData.get("goal") as string
    const experienceString = formData.get("experience") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !packageType || !goalString) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Create or get user
    const userResult = await createOrGetUser(firstName, lastName, email)
    if (!userResult.success) {
      return {
        success: false,
        message: "Error creating user account.",
      }
    }

    // Convert goal and experience to numbers
    const goal = goalToKilometers(goalString)
    const experience = experienceToNumber(experienceString || "beginner")

    // Insert coaching request
    await sql`
      INSERT INTO coaching_requests (
        user_id, 
        package_type, 
        goal, 
        experience,
        additional_info
      ) 
      VALUES (
        ${userResult.userId}, 
        ${packageType}, 
        ${goal}, 
        ${experience},
        ${experienceString || ""}
      )
    `

    console.log("Successfully inserted coaching request for user:", userResult.userId)

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
