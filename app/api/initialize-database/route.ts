import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    console.log("SAFE MODE: Only ensuring database tables exist...")

    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Database initialized successfully - NO DATA WAS DELETED OR MODIFIED",
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
