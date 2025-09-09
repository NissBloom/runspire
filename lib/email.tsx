// Email utility functions for the run coaching website

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    // In a real implementation, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES

    // For now, we'll simulate email sending
    console.log("Email would be sent:", {
      to: options.to,
      subject: options.subject,
      from: options.from || "noreply@runspire.com",
      html: options.html,
    })

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send email",
    }
  }
}

export function generateWelcomeEmail(firstName: string): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Welcome to Runspire!</h1>
          <p>Hi ${firstName},</p>
          <p>Thank you for joining Runspire! We're excited to help you on your running journey.</p>
          <p>Here's what you can expect:</p>
          <ul>
            <li>Personalized training plans</li>
            <li>Expert coaching guidance</li>
            <li>Community support</li>
            <li>Progress tracking</li>
          </ul>
          <p>Get started by exploring our training plans or booking a consultation call.</p>
          <p>Happy running!</p>
          <p><strong>The Runspire Team</strong></p>
        </div>
      </body>
    </html>
  `
}

export function generateCoachingRequestEmail(data: {
  firstName: string
  lastName: string
  email: string
  experience: string
  goals: string
  availability: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">New Coaching Request</h1>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Experience Level:</strong> ${data.experience}</p>
          <p><strong>Goals:</strong> ${data.goals}</p>
          <p><strong>Availability:</strong> ${data.availability}</p>
        </div>
      </body>
    </html>
  `
}
