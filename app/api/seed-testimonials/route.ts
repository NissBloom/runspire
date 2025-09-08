import { NextResponse } from "next/server"
import { seedDefaultTestimonials } from "@/app/testimonials/seed"

export async function GET() {
  try {
    const result = await seedDefaultTestimonials()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error seeding testimonials:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
