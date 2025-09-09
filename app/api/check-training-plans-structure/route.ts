import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Check the current structure of training_plans table
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'training_plans' AND table_schema = 'public'
      ORDER BY ordinal_position
    `

    // Check if there are any training plans
    const planCount = await sql`
      SELECT COUNT(*) as count FROM training_plans
    `

    // Check if user_id column exists and has data
    const hasUserId = columns.rows.some((row) => row.column_name === "user_id")

    let userIdData = null
    if (hasUserId) {
      userIdData = await sql`
        SELECT 
          COUNT(*) as total_plans,
          COUNT(user_id) as plans_with_user_id,
          COUNT(CASE WHEN user_id IS NULL THEN 1 END) as plans_without_user_id
        FROM training_plans
      `
    }

    // Try to do a sample JOIN to see what happens
    let sampleJoin = null
    if (hasUserId) {
      try {
        sampleJoin = await sql`
          SELECT 
            tp.id,
            tp.user_id,
            t.first_name,
            t.last_name,
            t.email
          FROM training_plans tp
          LEFT JOIN trainees t ON tp.user_id = t.id
          LIMIT 5
        `
      } catch (joinError) {
        sampleJoin = { error: joinError.message }
      }
    }

    return NextResponse.json({
      success: true,
      structure: {
        columns: columns.rows,
        totalPlans: planCount.rows[0].count,
        hasUserIdColumn: hasUserId,
        userIdData: userIdData?.rows[0] || null,
        sampleJoin: sampleJoin?.rows || sampleJoin?.error || null,
      },
    })
  } catch (error) {
    console.error("Error checking training plans structure:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
