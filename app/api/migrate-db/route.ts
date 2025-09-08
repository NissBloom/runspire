import { NextResponse } from "next/server"
import { createTrainingPlanTable, addBundleColumnToTrainingPlans } from "@/lib/db"

export async function GET() {
  try {
    // Ensure the training plans table exists
    const tableResult = await createTrainingPlanTable()

    // Add the bundle column if it doesn't exist
    const columnResult = await addBundleColumnToTrainingPlans()

    return NextResponse.json({
      success: true,
      tableCreated: tableResult.success,
      columnAdded: columnResult.success,
    })
  } catch (error) {
    console.error("Error during database migration:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
