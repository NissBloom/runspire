import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("Fixing training plans schema...")

    // First, let's see what columns exist
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'training_plans' AND table_schema = 'public'
    `

    console.log(
      "Current columns:",
      columns.rows.map((r) => r.column_name),
    )

    // Check if user_id column exists
    const hasUserId = columns.rows.some((row) => row.column_name === "user_id")

    if (!hasUserId) {
      console.log("Adding user_id column...")

      // Add user_id column
      await sql`
        ALTER TABLE training_plans 
        ADD COLUMN user_id INTEGER
      `

      // Now we need to populate user_id based on email/name matching
      // First, let's see what data we have
      const existingPlans = await sql`
        SELECT id, first_name, last_name, email 
        FROM training_plans 
        WHERE first_name IS NOT NULL AND email IS NOT NULL
      `

      console.log(`Found ${existingPlans.rows.length} plans to migrate`)

      // For each plan, find or create the corresponding user
      for (const plan of existingPlans.rows) {
        try {
          // Try to find existing user
          const userResult = await sql`
            SELECT id FROM trainees 
            WHERE email = ${plan.email}
          `

          let userId
          if (userResult.rows.length === 0) {
            // Create new user
            const newUser = await sql`
              INSERT INTO trainees (first_name, last_name, email)
              VALUES (${plan.first_name}, ${plan.last_name}, ${plan.email})
              RETURNING id
            `
            userId = newUser.rows[0].id
            console.log(`Created new user ${plan.first_name} ${plan.last_name}`)
          } else {
            userId = userResult.rows[0].id
            console.log(`Found existing user ${plan.first_name} ${plan.last_name}`)
          }

          // Update the training plan with user_id
          await sql`
            UPDATE training_plans 
            SET user_id = ${userId}
            WHERE id = ${plan.id}
          `
        } catch (error) {
          console.error(`Error migrating plan ${plan.id}:`, error)
        }
      }

      // Now add the foreign key constraint
      await sql`
        ALTER TABLE training_plans 
        ADD CONSTRAINT fk_training_plans_user_id 
        FOREIGN KEY (user_id) REFERENCES trainees(id) ON DELETE CASCADE
      `

      // Remove the old columns that are now redundant
      await sql`
        ALTER TABLE training_plans 
        DROP COLUMN IF EXISTS first_name,
        DROP COLUMN IF EXISTS last_name,
        DROP COLUMN IF EXISTS email
      `

      console.log("Migration completed successfully!")
    } else {
      console.log("user_id column already exists")
    }

    return NextResponse.json({
      success: true,
      message: "Training plans table schema fixed successfully",
    })
  } catch (error) {
    console.error("Error fixing training plans schema:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
