import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("Removing demo testimonials...")

    // Remove demo testimonials and their associated users
    const demoEmails = ["demo.sarah@example.com", "demo.david@example.com", "demo.emma@example.com"]

    let removedCount = 0

    for (const email of demoEmails) {
      // Find the user
      const userResult = await sql`
        SELECT id FROM trainees WHERE email = ${email}
      `

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id

        // Delete testimonials for this user (will cascade)
        const testimonialResult = await sql`
          DELETE FROM testimonials WHERE user_id = ${userId}
        `

        // Delete the user
        await sql`
          DELETE FROM trainees WHERE id = ${userId}
        `

        removedCount++
        console.log(`Removed demo user and testimonials for: ${email}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${removedCount} demo testimonials and users`,
    })
  } catch (error) {
    console.error("Error removing demo testimonials:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
