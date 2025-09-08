import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token")
  if (!token || token !== process.env.ADMIN_INIT_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  try {
    const res = await initializeDatabase()
    return NextResponse.json({
      ok: res.success,
      error: res.error?.message || (res.success ? null : "Unknown error"),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "Database initialization failed",
      },
      { status: 500 },
    )
  }
}
