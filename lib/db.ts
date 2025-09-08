import { sql } from "@vercel/postgres"
import { unstable_noStore as noStore } from "next/cache"

// Log database connection to verify we're connecting to the right database
console.log("Connecting to database:", process.env.POSTGRES_DATABASE || "run_coach")

export async function createCoachingRequestsTable() {
  try {
    // Create the coaching_requests table if it doesn't exist
    await sql`
    CREATE TABLE IF NOT EXISTS coaching_requests (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      package_type VARCHAR(255) NOT NULL,
      goal VARCHAR(255) NOT NULL,
      experience TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(255) DEFAULT 'pending'
    );
  `

    console.log("Created coaching_requests table in database:", process.env.POSTGRES_DATABASE || "run_coach")
    return { success: true }
  } catch (error) {
    console.error("Error creating coaching_requests table:", error)
    return { success: false, error }
  }
}

export async function createTrainingPlansTable() {
  try {
    // Create the training_plans table if it doesn't exist
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

    console.log("Created training_plans table in database:", process.env.POSTGRES_DATABASE || "run_coach")
    return { success: true }
  } catch (error) {
    console.error("Error creating training_plans table:", error)
    return { success: false, error }
  }
}

// Function to add bundle column to training_plans table if it doesn't exist
export async function addBundleColumnToTrainingPlans() {
  try {
    // Check if the bundle column exists
    const checkResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'training_plans' AND column_name = 'bundle';
    `

    // If the column doesn't exist, add it
    if (checkResult.rows.length === 0) {
      await sql`
        ALTER TABLE training_plans 
        ADD COLUMN bundle TEXT;
      `
      console.log("Added bundle column to training_plans table")
    } else {
      console.log("Bundle column already exists in training_plans table")
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding bundle column to training_plans table:", error)
    return { success: false, error }
  }
}

export async function getCoachingRequests() {
  noStore()
  try {
    const result = await sql`
    SELECT * FROM coaching_requests 
    ORDER BY created_at DESC
  `
    return result.rows
  } catch (error) {
    console.error("Error fetching coaching requests:", error)
    throw new Error("Failed to fetch coaching requests")
  }
}

export async function getTrainingPlans() {
  noStore()
  try {
    const result = await sql`
    SELECT * FROM training_plans 
    ORDER BY created_at DESC
  `
    return result.rows
  } catch (error) {
    console.error("Error fetching training plans:", error)
    throw new Error("Failed to fetch training plans")
  }
}

// Function to verify database connection
export async function verifyDatabaseConnection() {
  try {
    const result = await sql`SELECT current_database() as database_name;`
    console.log("Successfully connected to database:", result.rows[0].database_name)
    return {
      success: true,
      database: result.rows[0].database_name,
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export const createTrainingPlanTable = createTrainingPlansTable
