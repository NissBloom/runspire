import { sql } from "@vercel/postgres"

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

async function addDemoTestimonials() {
  try {
    console.log("Adding demo testimonials to help users understand how to write their stories...")

    // First ensure the tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS trainees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES trainees(id) ON DELETE CASCADE,
        achievement VARCHAR(255) NOT NULL,
        comment TEXT NOT NULL,
        rating INTEGER NOT NULL,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        improvement_feedback TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    console.log("Tables ready")

    // Add each demo testimonial
    for (const testimonial of demoTestimonials) {
      // First create or get the user
      let userId
      try {
        // Try to find existing user
        const existingUser = await sql`
          SELECT id FROM trainees WHERE email = ${testimonial.email}
        `

        if (existingUser.rows.length > 0) {
          userId = existingUser.rows[0].id
          console.log(`Found existing user: ${testimonial.firstName} ${testimonial.lastName}`)
        } else {
          // Create new user
          const userResult = await sql`
            INSERT INTO trainees (first_name, last_name, email)
            VALUES (${testimonial.firstName}, ${testimonial.lastName}, ${testimonial.email})
            RETURNING id
          `
          userId = userResult.rows[0].id
          console.log(`Created new user: ${testimonial.firstName} ${testimonial.lastName}`)
        }
      } catch (userError) {
        console.error(`Error creating user ${testimonial.firstName}:`, userError)
        continue
      }

      // Check if testimonial already exists for this user
      const existingTestimonial = await sql`
        SELECT id FROM testimonials WHERE user_id = ${userId} AND achievement = ${testimonial.achievement}
      `

      if (existingTestimonial.rows.length > 0) {
        console.log(
          `Testimonial already exists for ${testimonial.firstName} ${testimonial.lastName} - ${testimonial.achievement}`,
        )
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
          ${userId},
          ${testimonial.achievement},
          ${testimonial.comment},
          ${testimonial.rating},
          ${testimonial.imageUrl},
          ${testimonial.status},
          ${testimonial.improvementFeedback}
        )
      `

      console.log(
        `✅ Added demo testimonial: ${testimonial.firstName} ${testimonial.lastName} - ${testimonial.achievement}`,
      )
    }

    console.log("\n🎉 Successfully added all 3 demo testimonials to the database!")

    // Verify the testimonials were added
    const result = await sql`SELECT COUNT(*) as count FROM testimonials WHERE status = 'approved'`
    console.log(`📊 Total approved testimonials in database: ${result.rows[0].count}`)

    console.log("\n📝 These are demo testimonials to help users understand how to write their stories.")
    console.log("You can remove them later by visiting /api/remove-demo-testimonials")
  } catch (error) {
    console.error("❌ Error adding demo testimonials:", error)
  }
}

// Run the function
addDemoTestimonials()
