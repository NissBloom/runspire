import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("Ensuring training plans table has correct structure...")

    // First, ensure trainees table exists
    await sql`
      CREATE TABLE IF NOT EXISTS trainees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Check current structure of training_plans table
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'training_plans' AND table_schema = 'public'
    `

    const columnNames = columns.rows.map((r) => r.column_name)
    console.log("Current training_plans columns:", columnNames)

    const hasUserId = columnNames.includes("user_id")
    const hasFirstName = columnNames.includes("first_name")
    const hasLastName = columnNames.includes("last_name")
    const hasEmail = columnNames.includes("email")

    // If table doesn't exist or has wrong structure, create/fix it
    if (columnNames.length === 0) {
      // Table doesn't exist, create it with correct structure
      await sql`
        CREATE TABLE training_plans (
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
      console.log("Created training_plans table with correct structure")
    } else {
      // Table exists, need to migrate if it has old structure
      if (hasFirstName || hasLastName || hasEmail) {
        console.log("Found old structure, migrating data...")

        // Add user_id column if it doesn't exist
        if (!hasUserId) {
          await sql`ALTER TABLE training_plans ADD COLUMN user_id INTEGER;`
        }

        // Get all training plans with old structure
        const oldPlans = await sql`
          SELECT id, first_name, last_name, email 
          FROM training_plans 
          WHERE first_name IS NOT NULL AND email IS NOT NULL
        `

        console.log(`Migrating ${oldPlans.rows.length} training plans...`)

        // Migrate each plan
        for (const plan of oldPlans.rows) {
          try {
            // Find or create user
            const userResult = await sql`
              SELECT id FROM trainees WHERE email = ${plan.email}
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
              console.log(`Created user: ${plan.first_name} ${plan.last_name}`)
            } else {
              userId = userResult.rows[0].id
            }

            // Update training plan with user_id
            await sql`
              UPDATE training_plans 
              SET user_id = ${userId}
              WHERE id = ${plan.id}
            `
          } catch (error) {
            console.error(`Error migrating plan ${plan.id}:`, error)
          }
        }

        // Add foreign key constraint
        try {
          await sql`
            ALTER TABLE training_plans 
            ADD CONSTRAINT fk_training_plans_user_id 
            FOREIGN KEY (user_id) REFERENCES trainees(id) ON DELETE CASCADE
          `
        } catch (e) {
          console.log("Foreign key constraint might already exist")
        }

        // Remove old columns
        if (hasFirstName) {
          await sql`ALTER TABLE training_plans DROP COLUMN first_name;`
        }
        if (hasLastName) {
          await sql`ALTER TABLE training_plans DROP COLUMN last_name;`
        }
        if (hasEmail) {
          await sql`ALTER TABLE training_plans DROP COLUMN email;`
        }

        console.log("Removed old columns: first_name, last_name, email")
      } else if (!hasUserId) {
        // Table exists but missing user_id column
        await sql`
          ALTER TABLE training_plans 
          ADD COLUMN user_id INTEGER NOT NULL REFERENCES trainees(id) ON DELETE CASCADE
        `
        console.log("Added user_id column with foreign key")
      }

      // Ensure other columns exist
      if (!columnNames.includes("bundle")) {
        await sql`ALTER TABLE training_plans ADD COLUMN bundle TEXT;`
      }
      if (!columnNames.includes("cta")) {
        await sql`ALTER TABLE training_plans ADD COLUMN cta TEXT;`
      }
    }

    // Verify final structure
    const finalColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'training_plans' AND table_schema = 'public'
      ORDER BY ordinal_position
    `

    // Test the JOIN to make sure it works
    const testJoin = await sql`
      SELECT 
        tp.id,
        tp.goal,
        tp.experience,
        t.first_name,
        t.last_name,
        t.email
      FROM training_plans tp
      JOIN trainees t ON tp.user_id = t.id
      LIMIT 3
    `

    return NextResponse.json({
      success: true,
      message: "Training plans table structure ensured successfully",
      finalStructure: finalColumns.rows,
      testData: testJoin.rows,
    })
  } catch (error) {
    console.error("Error ensuring training plans structure:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
