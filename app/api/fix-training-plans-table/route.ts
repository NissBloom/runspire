import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("SAFE MODE: Only ensuring training plans table structure is correct...")

    // SAFE: Only ensure the table exists with correct structure
    // DO NOT DROP existing table - this would delete all data
    await sql`
      CREATE TABLE IF NOT EXISTS training_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE,
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

    // SAFE: Add missing columns if they don't exist
    try {
      await sql`ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS user_id INTEGER;`
      await sql`ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS bundle TEXT;`
      await sql`ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS cta TEXT;`
    } catch (e) {
      // Columns might already exist
    }

    console.log("Training plans table structure ensured (no data deleted)")

    return NextResponse.json({
      success: true,
      message: "Training plans table structure ensured successfully - NO DATA WAS DELETED",
    })
  } catch (error) {
    console.error("Error ensuring training plans table:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
