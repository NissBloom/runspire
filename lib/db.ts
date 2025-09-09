import { sql } from "@vercel/postgres"
import { unstable_noStore as noStore } from "next/cache"

// Safe logging without exposing database details
console.log("DB: Initializing connection")

export async function createTraineesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS trainees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log("Ensured trainees table exists (no data modified)")
    return { success: true }
  } catch (error) {
    console.error("Error ensuring trainees table:", error)
    return { success: false, error }
  }
}

export async function createTestimonialsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE,
        achievement VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        rating INTEGER NOT NULL,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        improvement_feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    console.log("Ensured testimonials table exists (no data modified)")
    return { success: true }
  } catch (error) {
    console.error("Error ensuring testimonials table:", error)
    return { success: false, error }
  }
}

export async function createTrainingPlansTable() {
  try {
    // Create the table with the CORRECT structure from the start
    await sql`
      CREATE TABLE IF NOT EXISTS training_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
        goal TEXT NOT NULL,
        experience TEXT NOT NULL,
        days_per_week INTEGER NOT NULL,
        current_mileage INTEGER NOT NULL,
        race_distance TEXT,
        personal_best TEXT,
        bundle TEXT,
        cta TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log("Ensured training_plans table exists with CORRECT structure (user_id FK, no redundant columns)")
    return { success: true }
  } catch (error) {
    console.error("Error ensuring training_plans table:", error)
    return { success: false, error }
  }
}

export async function createCoachingRequestsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS coaching_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE,
        package_type VARCHAR(255) NOT NULL,
        goal INTEGER NOT NULL, -- goal in kilometers (5, 10, 21, 42, etc)
        experience INTEGER NOT NULL, -- experience level 1, 2, 3
        additional_info TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(255) DEFAULT 'pending'
      );
    `
    console.log("Ensured coaching_requests table exists (no data modified)")
    return { success: true }
  } catch (error) {
    console.error("Error ensuring coaching_requests table:", error)
    return { success: false, error }
  }
}

// SAFE INITIALIZATION - Only ensures tables exist with CORRECT structure
export async function initializeDatabase() {
  try {
    console.log("DB: Ensuring all tables exist with CORRECT structure (SAFE MODE)")

    // Create tables in correct order (trainees first, then tables that reference it)
    await createTraineesTable()
    await createTestimonialsTable()
    await createCoachingRequestsTable()

    // For training_plans, we need to handle potential migration
    // First check if it exists with wrong structure
    try {
      const columns = await sql`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'training_plans' AND table_schema = 'public'
      `

      const columnNames = columns.rows.map((r) => r.column_name)
      const hasOldStructure =
        columnNames.includes("first_name") || columnNames.includes("last_name") || columnNames.includes("email")

      if (hasOldStructure) {
        console.log(
          "WARNING: training_plans table has old structure. Please run /api/ensure-training-plans-structure to migrate.",
        )
      } else {
        await createTrainingPlansTable()
      }
    } catch (error) {
      // Table doesn't exist, create it with correct structure
      await createTrainingPlansTable()
    }

    console.log("DB: All tables ensured successfully - NO DATA WAS MODIFIED")
    return { success: true }
  } catch (error) {
    console.error("Error ensuring database tables:", error)
    return { success: false, error }
  }
}

// Helper function to create or get user
export async function createOrGetUser(firstName: string, lastName: string, email: string) {
  try {
    // First try to find existing user by email
    const existingUser = await sql`
      SELECT id FROM trainees WHERE email = ${email}
    `

    if (existingUser.rows.length > 0) {
      return { success: true, userId: existingUser.rows[0].id, isNew: false }
    }

    // Create new user
    const result = await sql`
      INSERT INTO trainees (first_name, last_name, email)
      VALUES (${firstName}, ${lastName}, ${email})
      RETURNING id
    `

    return { success: true, userId: result.rows[0].id, isNew: true }
  } catch (error) {
    console.error("Error creating/getting user:", error)
    return { success: false, error }
  }
}

// Helper function to convert goal string to kilometers
export function goalToKilometers(goal: string): number {
  switch (goal) {
    case "5k":
      return 5
    case "10k":
      return 10
    case "half":
      return 21
    case "full":
      return 42
    default:
      return 5
  }
}

// Helper function to convert experience to number
export function experienceToNumber(experience: string): number {
  switch (experience) {
    case "beginner":
      return 1
    case "intermediate":
      return 2
    case "advanced":
      return 3
    default:
      return 1
  }
}

// Helper function to convert kilometers back to goal string
export function kilometersToGoal(km: number): string {
  switch (km) {
    case 5:
      return "5k"
    case 10:
      return "10k"
    case 21:
      return "half"
    case 42:
      return "full"
    default:
      return "5k"
  }
}

// Helper function to convert number back to experience string
export function numberToExperience(num: number): string {
  switch (num) {
    case 1:
      return "beginner"
    case 2:
      return "intermediate"
    case 3:
      return "advanced"
    default:
      return "beginner"
  }
}

export async function getCoachingRequests() {
  noStore()
  try {
    const result = await sql`
      SELECT 
        cr.*,
        t.first_name,
        t.last_name,
        t.email
      FROM coaching_requests cr
      JOIN trainees t ON cr.user_id = t.id
      ORDER BY cr.created_at DESC
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
      SELECT 
        tp.*,
        t.first_name,
        t.last_name,
        t.email
      FROM training_plans tp
      JOIN trainees t ON tp.user_id = t.id
      ORDER BY tp.created_at DESC
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
    console.log("DB: Connection verified successfully")
    return {
      success: true,
      database: "connected",
    }
  } catch (error) {
    console.error("DB: Connection error")
    return {
      success: false,
      error: "Connection failed",
    }
  }
}

// Legacy function names for compatibility
export const createTrainingPlanTable = createTrainingPlansTable
export const addBundleColumnToTrainingPlans = async () => ({ success: true }) // No longer needed
export const addCtaColumnToTrainingPlans = async () => ({ success: true }) // No longer needed
