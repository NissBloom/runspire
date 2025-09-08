import { NextResponse } from "next/server"
import { getTrainingPlans } from "@/lib/db"

export async function GET() {
  try {
    const plans = await getTrainingPlans()
    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Error fetching training plans:", error)
    return NextResponse.json({ error: "Failed to fetch training plans" }, { status: 500 })
  }
}
