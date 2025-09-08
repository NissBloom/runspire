"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { createOrGetUser, createTraineesTable, createTrainingPlansTable } from "@/lib/db"

export async function saveTrainingPlan(formData: FormData) {
  try {
    // Ensure tables exist
    await createTraineesTable()
    await createTrainingPlansTable()

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const goal = formData.get("goal") as string
    const experience = formData.get("experience") as string
    const daysPerWeek = Number.parseInt(formData.get("daysPerWeek") as string)
    const currentMileage = Number.parseInt(formData.get("currentMileage") as string)
    const raceDistance = (formData.get("raceDistance") as string) || null
    const personalBest = (formData.get("personalBest") as string) || null
    const bundle = (formData.get("bundle") as string) || "basic"
    const cta = (formData.get("cta") as string) || null

    // Debug logging
    console.log("saveTrainingPlan - Form data:", {
      firstName,
      lastName,
      email,
      goal,
      experience,
      daysPerWeek,
      currentMileage,
    })

    // Validate required fields
    if (!firstName || !lastName || !email || !goal || !experience || isNaN(daysPerWeek) || isNaN(currentMileage)) {
      console.log("saveTrainingPlan - Validation failed")
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Create or get user
    const userResult = await createOrGetUser(firstName, lastName, email)
    if (!userResult.success) {
      console.log("saveTrainingPlan - User creation failed:", userResult.error)
      return {
        success: false,
        message: "Error creating user account.",
      }
    }

    // Insert training plan
    const result = await sql`
      INSERT INTO training_plans (
        user_id,
        goal,
        experience,
        days_per_week,
        current_mileage,
        race_distance,
        personal_best,
        bundle,
        cta
      ) 
      VALUES (
        ${userResult.userId},
        ${goal},
        ${experience},
        ${daysPerWeek},
        ${currentMileage},
        ${raceDistance},
        ${personalBest},
        ${bundle},
        ${cta}
      )
      RETURNING id
    `

    const planId = result.rows[0].id

    console.log("Successfully saved training plan with ID:", planId, "for user:", userResult.userId)

    // Revalidate the page to show fresh data
    revalidatePath("/plan-builder")

    return {
      success: true,
      message: "Your training plan has been saved successfully!",
      planId: planId.toString(),
    }
  } catch (error) {
    console.error("Error saving training plan:", error)
    return {
      success: false,
      message: "There was an error saving your plan. Please try again.",
    }
  }
}

export async function getTrainingPlan(planId: string) {
  try {
    const result = await sql`
      SELECT tp.*, t.first_name, t.last_name, t.email
      FROM training_plans tp
      JOIN trainees t ON tp.user_id = t.id
      WHERE tp.id = ${planId}
    `

    if (result.rows.length === 0) {
      return { success: false, message: "Plan not found" }
    }

    return { success: true, plan: result.rows[0] }
  } catch (error) {
    console.error("Error fetching training plan:", error)
    return { success: false, message: "Error fetching plan" }
  }
}

// New action to save initial plan data when user hits continue
export async function saveInitialPlanData(formData: FormData) {
  try {
    console.log("saveInitialPlanData - Starting...")

    // Ensure tables exist first
    const traineesResult = await createTraineesTable()
    const plansResult = await createTrainingPlansTable()

    console.log("saveInitialPlanData - Tables created:", { traineesResult, plansResult })

    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const goal = formData.get("goal") as string
    const experience = formData.get("experience") as string
    const daysPerWeek = Number.parseInt(formData.get("daysPerWeek") as string)
    const currentMileage = Number.parseInt(formData.get("currentMileage") as string)
    const raceDistance = (formData.get("raceDistance") as string) || null
    const personalBest = (formData.get("personalBest") as string) || null

    // Debug logging
    console.log("saveInitialPlanData - Form data:", {
      firstName,
      lastName,
      email,
      goal,
      experience,
      daysPerWeek,
      currentMileage,
      raceDistance,
      personalBest,
    })

    // More lenient validation - trim whitespace and check
    const trimmedFirstName = firstName?.trim()
    const trimmedLastName = lastName?.trim()
    const trimmedEmail = email?.trim()

    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !trimmedEmail ||
      !goal ||
      !experience ||
      isNaN(daysPerWeek) ||
      isNaN(currentMileage)
    ) {
      console.log("saveInitialPlanData - Validation failed:", {
        firstName: !!trimmedFirstName,
        lastName: !!trimmedLastName,
        email: !!trimmedEmail,
        goal: !!goal,
        experience: !!experience,
        daysPerWeek: !isNaN(daysPerWeek),
        currentMileage: !isNaN(currentMileage),
      })
      return {
        success: false,
        message: "Please fill in all required fields (First Name, Last Name, Email).",
      }
    }

    // Create or get user
    console.log("saveInitialPlanData - Creating/getting user...")
    const userResult = await createOrGetUser(trimmedFirstName, trimmedLastName, trimmedEmail)
    if (!userResult.success) {
      console.log("saveInitialPlanData - User creation failed:", userResult.error)
      return {
        success: false,
        message: "Error creating user account: " + (userResult.error?.message || "Unknown error"),
      }
    }

    console.log("saveInitialPlanData - User result:", userResult)

    // Insert training plan
    console.log("saveInitialPlanData - Inserting training plan...")
    const result = await sql`
      INSERT INTO training_plans (
        user_id,
        goal,
        experience,
        days_per_week,
        current_mileage,
        race_distance,
        personal_best
      ) 
      VALUES (
        ${userResult.userId},
        ${goal},
        ${experience},
        ${daysPerWeek},
        ${currentMileage},
        ${raceDistance},
        ${personalBest}
      )
      RETURNING id
    `

    const planId = result.rows[0].id

    console.log("Successfully saved initial training plan data with ID:", planId, "for user:", userResult.userId)

    return {
      success: true,
      planId: planId.toString(),
    }
  } catch (error) {
    console.error("Error saving initial training plan data:", error)
    return {
      success: false,
      message: "There was an error saving your plan data: " + (error?.message || "Unknown error"),
    }
  }
}

// Action to update CTA when user clicks a button
export async function updatePlanCta(planId: string, cta: string) {
  try {
    await sql`
      UPDATE training_plans 
      SET cta = ${cta}
      WHERE id = ${planId}
    `

    console.log("Successfully updated CTA for plan ID:", planId, "with CTA:", cta)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating plan CTA:", error)
    return {
      success: false,
    }
  }
}
