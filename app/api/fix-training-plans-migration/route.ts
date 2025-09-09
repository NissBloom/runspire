import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("Starting training plans migration...")

    // First, check current structure
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'training_plans' AND table_schema = 'public'
    `

    const columnNames = columns.rows.map((r) => r.column_name)
    console.log("Current columns:", columnNames)

    const hasUserId = columnNames.includes("user_id")
    const hasFirstName = columnNames.includes("first_name")
    const hasLastName = columnNames.includes("last_name")
    const hasEmail = columnNames.includes("email")

    let oldPlans // Declare oldPlans variable here

    if (!hasUserId) {
      console.log("Adding user_id column...")
      await sql`ALTER TABLE training_plans ADD COLUMN user_id INTEGER`
    }

    // If we still have the old columns, we need to migrate the data
    if (hasFirstName && hasLastName && hasEmail) {
      console.log("Migrating data from old structure...")

      // Get all training plans with the old structure
      oldPlans = await sql`
        SELECT id, first_name, last_name, email 
        FROM training_plans 
        WHERE first_name IS NOT NULL AND email IS NOT NULL
      `

      console.log(`Found ${oldPlans.rows.length} plans to migrate`)

      // For each plan, find or create the corresponding user
      for (const plan of oldPlans.rows) {
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
            console.log(`Created new user: ${plan.first_name} ${plan.last_name}`)
          } else {
            userId = userResult.rows[0].id
            console.log(`Found existing user: ${plan.first_name} ${plan.last_name}`)
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

      // Now add the foreign key constraint if it doesn't exist
      try {
        await sql`
          ALTER TABLE training_plans 
          ADD CONSTRAINT fk_training_plans_user_id 
          FOREIGN KEY (user_id) REFERENCES trainees(id) ON DELETE CASCADE
        `
        console.log("Added foreign key constraint")
      } catch (error) {
        console.log("Foreign key constraint might already exist:", error.message)
      }

      // Remove the old columns
      await sql`
        ALTER TABLE training_plans 
        DROP COLUMN IF EXISTS first_name,
        DROP COLUMN IF EXISTS last_name,
        DROP COLUMN IF EXISTS email
      `
      console.log("Removed old columns")
    }

    // Verify the migration worked
    const verifyResult = await sql`
      SELECT 
        tp.id,
        tp.user_id,
        t.first_name,
        t.last_name,
        t.email,
        tp.goal,
        tp.experience
      FROM training_plans tp
      LEFT JOIN trainees t ON tp.user_id = t.id
      ORDER BY tp.created_at DESC
      LIMIT 5
    `

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully",
      verification: verifyResult.rows,
      migrationSteps: {
        hadUserId: hasUserId,
        hadOldColumns: hasFirstName && hasLastName && hasEmail,
        migratedPlans: hasFirstName ? oldPlans?.rows?.length || 0 : 0,
      },
    })
  } catch (error) {
    console.error("Error in training plans migration:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
