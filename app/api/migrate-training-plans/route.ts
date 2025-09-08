import { NextResponse } from "next/server"
import { createTrainingPlansTable, addBundleColumnToTrainingPlans, addCtaColumnToTrainingPlans } from "@/lib/db"

export async function GET() {
  try {
    // Ensure the training plans table exists with correct schema
    const tableResult = await createTrainingPlansTable()

    // Add the bundle column if it doesn't exist
    const bundleResult = await addBundleColumnToTrainingPlans()

    // Add the cta column if it doesn't exist
    const ctaResult = await addCtaColumnToTrainingPlans()

    return NextResponse.json({
      success: true,
      tableCreated: tableResult.success,
      bundleColumnAdded: bundleResult.success,
      ctaColumnAdded: ctaResult.success,
    })
  } catch (error) {
    console.error("Error during training plans migration:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
