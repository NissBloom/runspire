import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    console.log("SAFE MODE: Only ensuring tables exist, never deleting data...")

    // SAFE: Only ensure tables exist, never drop anything
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Database tables ensured successfully. NO DATA WAS DELETED OR MODIFIED.",
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to ensure database tables" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error ensuring database tables:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
