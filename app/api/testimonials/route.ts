import { NextResponse } from "next/server"
import { getAllTestimonials } from "@/app/testimonials/actions"

export async function GET() {
  try {
    const testimonials = await getAllTestimonials()

    return NextResponse.json(
      {
        testimonials: testimonials,
        success: true,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    console.error("API Error fetching testimonials:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch testimonials",
        testimonials: [],
        success: false,
      },
      { status: 500 },
    )
  }
}
