import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    console.log("Rebuilding database with correct schema...")

    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Database rebuilt successfully with correct schema. All tables dropped and recreated.",
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to rebuild database" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error rebuilding database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
