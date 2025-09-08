import { NextResponse } from "next/server"
import { getAllTestimonials } from "@/app/testimonials/actions"

export async function GET() {
  try {
    console.log("API: Fetching testimonials...")
    const testimonials = await getAllTestimonials()
    console.log(`API: Retrieved ${testimonials.length} testimonials`)

    return NextResponse.json({
      testimonials,
      count: testimonials.length,
      success: true,
    })
  } catch (error) {
    console.error("API Error fetching testimonials:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch testimonials",
        testimonials: [],
        count: 0,
        success: false,
      },
      { status: 500 },
    )
  }
}
