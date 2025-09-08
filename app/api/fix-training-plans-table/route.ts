import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Drop the existing table if it has issues
    await sql`DROP TABLE IF EXISTS training_plans CASCADE;`

    // Create a fresh table with the correct schema
    await sql`
      CREATE TABLE training_plans (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
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

    console.log("Successfully recreated training_plans table")

    return NextResponse.json({
      success: true,
      message: "Training plans table recreated successfully",
    })
  } catch (error) {
    console.error("Error fixing training plans table:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
