import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const ADMIN_EMAIL = "nissbloom@gmail.com";

export async function sendAdminNotification(subject: string, text: string) {
  if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error("Gmail credentials are not set in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: GMAIL_USER,
    to: ADMIN_EMAIL,
    subject,
    text,
  });
}
