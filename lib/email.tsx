// Email utility functions for the run coaching website
import { Resend } from "resend"

const ADMIN_EMAIL = "nissbloom@gmail.com"
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    if (!resend) {
      console.warn("Resend not configured. Email not sent:", {
        to: options.to,
        subject: options.subject,
      })
      return {
        success: false,
        message: "Email service not configured",
      }
    }

    // Override to address - always send to admin email during sandbox/testing
    const response = await resend.emails.send({
      from: options.from || "Runspire <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: options.subject,
      html: options.html,
    })

    if (response.error) {
      console.error("Resend error:", response.error)
      return {
        success: false,
        message: "Failed to send email",
      }
    }

    console.log("Email sent successfully:", {
      id: response.data?.id,
      to: ADMIN_EMAIL,
      subject: options.subject,
    })

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

// ============ EMAIL TEMPLATE GENERATORS ============

export function generateTrainingPlanInitialEmail(data: {
  firstName: string
  lastName: string
  email: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Training Plan Started - Runspire</h1>
          <p>Hi ${data.firstName},</p>
          <p>Your training plan has been started! We've received your initial information:</p>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p>Continue filling out your training preferences to get a personalized plan tailored to your goals.</p>
          <p>Happy running!</p>
          <p><strong>The Runspire Team</strong></p>
        </div>
      </body>
    </html>
  `
}

export function generateTrainingPlanCompleteEmail(data: {
  firstName: string
  lastName: string
  email: string
  goal: string
  experience: string
  daysPerWeek: number
  currentMileage: number
  raceDistance?: string
  personalBest?: string
  bundle: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Your Training Plan is Ready! - Runspire</h1>
          <p>Hi ${data.firstName},</p>
          <p>Congratulations! Your personalized training plan has been created. Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Goal</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.goal}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Experience Level</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.experience}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Training Days/Week</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.daysPerWeek}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Current Weekly Mileage (km)</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.currentMileage}</td>
            </tr>
            ${data.raceDistance ? `<tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Race Distance</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.raceDistance}</td>
            </tr>` : ""}
            ${data.personalBest ? `<tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Personal Best</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.personalBest}</td>
            </tr>` : ""}
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Plan Package</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-transform: capitalize;">${data.bundle}</td>
            </tr>
          </table>
          <p>Your personalized training plan is now ready to use. Start training and achieve your running goals!</p>
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
  package: string
  goal: string
  experience: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Coaching Request Received - Runspire</h1>
          <p>Hi ${data.firstName},</p>
          <p>Thank you for submitting a coaching request! We've received your information:</p>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Package:</strong> ${data.package}</p>
          <p><strong>Goal:</strong> ${data.goal}</p>
          <p><strong>Experience Level:</strong> ${data.experience}</p>
          <p>Our team will review your request and contact you shortly to discuss your training goals.</p>
          <p><strong>The Runspire Team</strong></p>
        </div>
      </body>
    </html>
  `
}

export function generateTestimonialSubmittedEmail(data: {
  firstName: string
  lastName: string
  email: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">Your Testimonial Received - Runspire</h1>
          <p>Hi ${data.firstName},</p>
          <p>Thank you for sharing your success story with us!</p>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p>Your testimonial has been submitted and is pending approval. We'll review it shortly and feature it on our website if approved.</p>
          <p>We appreciate your support!</p>
          <p><strong>The Runspire Team</strong></p>
        </div>
      </body>
    </html>
  `
}

// ============ ADMIN NOTIFICATION GENERATORS ============

export function generateAdminTrainingPlanInitialNotification(data: {
  firstName: string
  lastName: string
  email: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">New Training Plan Started</h1>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p>A new user has started creating a training plan. Check admin dashboard for details.</p>
        </div>
      </body>
    </html>
  `
}

export function generateAdminTrainingPlanCompleteNotification(data: {
  firstName: string
  lastName: string
  email: string
  goal: string
  experience: string
  daysPerWeek: number
  currentMileage: number
  raceDistance?: string
  personalBest?: string
  bundle: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">New Training Plan Completed</h1>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Goal</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.goal}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Experience</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.experience}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Days/Week</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.daysPerWeek}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Mileage (km)</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.currentMileage}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Package</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.bundle}</td></tr>
          </table>
        </div>
      </body>
    </html>
  `
}

export function generateAdminCoachingRequestNotification(data: {
  firstName: string
  lastName: string
  email: string
  package: string
  goal: string
  experience: string
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">New Coaching Request</h1>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Package:</strong> ${data.package}</p>
          <p><strong>Goal:</strong> ${data.goal}</p>
          <p><strong>Experience:</strong> ${data.experience}</p>
          <p>Follow up with this lead as soon as possible!</p>
        </div>
      </body>
    </html>
  `
}

export function generateAdminTestimonialNotification(data: {
  firstName: string
  lastName: string
  email: string
  achievement: string
  comment: string
  rating: number
}): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">New Testimonial Submitted</h1>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Rating:</strong> ${'⭐'.repeat(data.rating)}</p>
          <p><strong>Achievement:</strong> ${data.achievement}</p>
          <p><strong>Comment:</strong></p>
          <p>${data.comment}</p>
          <p>Review and approve in the admin dashboard.</p>
        </div>
      </body>
    </html>
  `
}

export function generateAdminCtaClickNotification(data: {
  firstName: string
  lastName: string
  email: string
  ctaClicked: string
  goal?: string
}): string {
  const ctaLabels: Record<string, string> = {
    "book_consult": "Book Free Consultation",
    "whatsapp": "WhatsApp Contact",
    "request_plan": "Request Training Plan",
  }

  const ctaLabel = ctaLabels[data.ctaClicked] || data.ctaClicked

  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">CTA Action Taken</h1>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">CTA Clicked</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${ctaLabel}</td>
            </tr>
            ${data.goal ? `<tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Running Goal</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-transform: uppercase;">${data.goal}</td>
            </tr>` : ""}
          </table>
          <p>Follow up with this lead immediately!</p>
        </div>
      </body>
    </html>
  `
}
