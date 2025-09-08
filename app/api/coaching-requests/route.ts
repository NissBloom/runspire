import { NextResponse } from "next/server"
import { getCoachingRequests } from "@/lib/db"

export async function GET() {
  try {
    const requests = await getCoachingRequests()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Error fetching coaching requests:", error)
    return NextResponse.json({ error: "Failed to fetch coaching requests" }, { status: 500 })
  }
}
