import { NextResponse } from "next/server"
import { getAllTestimonials } from "@/app/testimonials/actions"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get("preview")

    let testimonials
    if (preview === "true") {
      const { getTestimonialsPreview } = await import("@/app/testimonials/actions")
      testimonials = await getTestimonialsPreview(5)
    } else {
      testimonials = await getAllTestimonials()
    }

    return NextResponse.json(
      {
        testimonials: testimonials,
        success: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
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
