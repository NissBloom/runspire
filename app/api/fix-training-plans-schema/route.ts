import { NextResponse } from "next/server"
import { createTraineesTable, createTrainingPlansTable } from "@/lib/db"

export async function GET() {
  try {
    console.log("Fixing training plans schema...")

    // Ensure trainees table exists first
    await createTraineesTable()

    // This will drop and recreate the training_plans table with correct schema
    await createTrainingPlansTable()

    return NextResponse.json({
      success: true,
      message: "Training plans table schema fixed successfully",
    })
  } catch (error) {
    console.error("Error fixing training plans schema:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
