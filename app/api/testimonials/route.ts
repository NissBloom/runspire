import { NextResponse } from "next/server"
import { getAllTestimonials } from "@/app/testimonials/actions"

export async function GET() {
  try {
    const testimonials = await getAllTestimonials()
    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
