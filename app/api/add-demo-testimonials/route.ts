import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { createOrGetUser, createTraineesTable, createTestimonialsTable } from "@/lib/db"

const demoTestimonials = [
  {
    firstName: "Sarah",
    lastName: "M.",
    email: "demo.sarah@example.com",
    achievement: "First 5K Completion",
    comment:
      "I never thought I could run 5K without stopping, but Nissan's structured approach made it feel achievable. The gradual build-up from walk-run intervals to continuous running was perfect for my fitness level. The weekly check-ins kept me motivated, and his encouragement during tough weeks made all the difference. Crossed the finish line in 28 minutes and felt absolutely amazing! Now I'm already thinking about my next goal - maybe a 10K?",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
    improvementFeedback: "nothing_great",
  },
  {
    firstName: "David",
    lastName: "K.",
    email: "demo.david@example.com",
    achievement: "Marathon PR - Sub 3:30",
    comment:
      "After years of running without structure, I hit a plateau and couldn't break 3:45 in the marathon. Nissan's data-driven approach completely changed my training. He analyzed my previous races, identified that I was running my easy runs too fast, and restructured my entire approach. The combination of proper easy pace, targeted tempo work, and strategic long runs made all the difference. Just ran 3:28 at Berlin - 17 minutes faster than my previous best! The science-backed training really works.",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
    improvementFeedback: "nothing_great",
  },
  {
    firstName: "Emma",
    lastName: "R.",
    email: "demo.emma@example.com",
    achievement: "Return to Running After Injury",
    comment:
      "Coming back from a knee injury was scary - I was afraid I'd never run pain-free again. Nissan's careful progression plan started with just 10-minute walk-run sessions and built up so gradually that I never felt overwhelmed. His emphasis on listening to my body, proper recovery, and strength work alongside running was exactly what I needed. Six months later, I'm running stronger than before my injury and just completed my first half marathon in 1:52. The patience and expertise he showed during my comeback was incredible.",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
    improvementFeedback: "nothing_great",
  },
]

export async function GET() {
  try {
    console.log("Adding demo testimonials...")

    // Ensure tables exist
    await createTraineesTable()
    await createTestimonialsTable()

    let addedCount = 0

    // Add each demo testimonial
    for (const testimonial of demoTestimonials) {
      // Create or get user
      const userResult = await createOrGetUser(testimonial.firstName, testimonial.lastName, testimonial.email)
      if (!userResult.success) {
        console.error(`Failed to create user for ${testimonial.firstName}`)
        continue
      }

      // Check if testimonial already exists for this user
      const existingTestimonial = await sql`
        SELECT id FROM testimonials WHERE user_id = ${userResult.userId} AND achievement = ${testimonial.achievement}
      `

      if (existingTestimonial.rows.length > 0) {
        console.log(`Testimonial already exists for ${testimonial.firstName} ${testimonial.lastName}`)
        continue
      }

      // Insert the testimonial
      await sql`
        INSERT INTO testimonials (
          user_id,
          achievement,
          comment,
          rating,
          image_url,
          status,
          improvement_feedback
        ) 
        VALUES (
          ${userResult.userId},
          ${testimonial.achievement},
          ${testimonial.comment},
          ${testimonial.rating},
          ${testimonial.imageUrl},
          ${testimonial.status},
          ${testimonial.improvementFeedback}
        )
      `

      addedCount++
      console.log(`Added demo testimonial: ${testimonial.firstName} ${testimonial.lastName}`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedCount} demo testimonials`,
      note: "These are example testimonials to help users understand how to write their stories. You can remove them later by visiting /api/remove-demo-testimonials",
    })
  } catch (error) {
    console.error("Error adding demo testimonials:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
