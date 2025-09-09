import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("DEPRECATED: This endpoint is no longer needed.")
    console.log("Use /api/ensure-training-plans-structure instead for safe migration.")

    return NextResponse.json({
      success: true,
      message: "This endpoint is deprecated. Use /api/ensure-training-plans-structure for safe migration.",
      redirect: "/api/ensure-training-plans-structure",
    })
  } catch (error) {
    console.error("Error in deprecated migration endpoint:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
