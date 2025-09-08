import { NextResponse } from "next/server"
import { verifyDatabaseConnection } from "@/lib/db"

export async function GET() {
  const connectionResult = await verifyDatabaseConnection()

  return NextResponse.json(connectionResult)
}
