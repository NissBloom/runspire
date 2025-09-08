import { sql } from "@vercel/postgres"
import { v4 as uuidv4 } from "uuid"

const testimonials = [
  {
    firstName: "Sarah",
    lastName: "M.",
    email: "sarah.m@example.com",
    achievement: "First 10K Completion",
    comment:
      "I never thought I could run 10K, but Nissan's structured approach made it feel achievable. The gradual build-up and weekly check-ins kept me motivated. Crossed the finish line in 58 minutes and felt amazing!",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
    improvementFeedback: "nothing_great",
  },
  {
    firstName: "David",
    lastName: "K.",
    email: "david.k@example.com",
    achievement: "Marathon PR - Sub 3:30",
    comment:
      "After years of running without structure, Nissan helped me break through my plateau. His data-driven approach and focus on recovery made all the difference. Shaved 12 minutes off my marathon time!",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
    improvementFeedback: "nothing_great",
  },
  {
    firstName: "Emma",
    lastName: "R.",
    email: "emma.r@example.com",
    achievement: "Return to Running After Injury",
    comment:
      "Coming back from a knee injury was scary, but Nissan's careful progression plan got me back to running stronger than before. His emphasis on easy runs and proper recovery was exactly what I needed.",
    rating: 5,
    imageUrl: "/placeholder.svg?height=80&width=80",
    status: "approved",
    improvementFeedback: "nothing_great",
  },
]

async function addTestimonials() {
  try {
    console.log("Adding testimonials to database...")

    // First ensure the testimonials table exists
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email TEXT,
        achievement VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        rating INTEGER NOT NULL,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        improvement_feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log("Testimonials table ready")

    // Add each testimonial
    for (const testimonial of testimonials) {
      const testimonialId = uuidv4()

      await sql`
        INSERT INTO testimonials (
          id,
          first_name,
          last_name,
          email,
          achievement,
          comment,
          rating,
          image_url,
          status,
          improvement_feedback
        ) 
        VALUES (
          ${testimonialId},
          ${testimonial.firstName},
          ${testimonial.lastName},
          ${testimonial.email},
          ${testimonial.achievement},
          ${testimonial.comment},
          ${testimonial.rating},
          ${testimonial.imageUrl},
          ${testimonial.status},
          ${testimonial.improvementFeedback}
        )
      `

      console.log(`✅ Added testimonial: ${testimonial.firstName} ${testimonial.lastName} - ${testimonial.achievement}`)
    }

    console.log("\n🎉 Successfully added all 3 testimonials to the database!")

    // Verify the testimonials were added
    const result = await sql`SELECT COUNT(*) as count FROM testimonials WHERE status = 'approved'`
    console.log(`📊 Total approved testimonials in database: ${result.rows[0].count}`)
  } catch (error) {
    console.error("❌ Error adding testimonials:", error)
  }
}

// Run the function
addTestimonials()
