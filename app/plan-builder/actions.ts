"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { addBundleColumnToTrainingPlans } from "@/lib/db"

export async function createTrainingPlanTableInDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS training_plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        goal TEXT NOT NULL,
        experience TEXT NOT NULL,
        days_per_week INTEGER NOT NULL,
        current_mileage INTEGER NOT NULL,
        race_distance TEXT,
        personal_best TEXT,
        bundle TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log("Training plans table created successfully")
    return { success: true }
  } catch (error) {
    console.error("Error creating training plans table:", error)
    return { success: false, error }
  }
}

export async function saveTrainingPlan(formData: FormData) {
  try {
    // Ensure the table exists with the bundle column
    await createTrainingPlanTableInDB()
    await addBundleColumnToTrainingPlans()

    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const goal = formData.get("goal") as string
    const experience = formData.get("experience") as string
    const daysPerWeek = Number.parseInt(formData.get("daysPerWeek") as string)
    const currentMileage = Number.parseInt(formData.get("currentMileage") as string)
    const raceDistance = (formData.get("raceDistance") as string) || null
    const personalBest = (formData.get("personalBest") as string) || null
    const bundle = (formData.get("bundle") as string) || "basic"

    // Validate required fields
    if (!name || !email || !goal || !experience || isNaN(daysPerWeek) || isNaN(currentMileage)) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Generate a unique ID for the plan
    const planId = uuidv4()

    // Insert data into Vercel Postgres
    await sql`
      INSERT INTO training_plans (
        id,
        name,
        email,
        goal,
        experience,
        days_per_week,
        current_mileage,
        race_distance,
        personal_best,
        bundle
      ) 
      VALUES (
        ${planId},
        ${name},
        ${email},
        ${goal},
        ${experience},
        ${daysPerWeek},
        ${currentMileage},
        ${raceDistance},
        ${personalBest},
        ${bundle}
      )
    `

    console.log("Successfully saved training plan")

    // Revalidate the page to show fresh data
    revalidatePath("/plan-builder")

    return {
      success: true,
      message: "Your training plan has been saved successfully!",
      planId,
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
      SELECT * FROM training_plans WHERE id = ${planId}
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
