import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

type Body = {
  repName?: string
  companyName?: string
  email?: string
  phone?: string
  date?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body
    const { repName, companyName, email, phone, date } = body || {}

    // Basic server-side validation (all required)
    if (!repName || !repName.trim()) return NextResponse.json({ error: "Rep Name is required." }, { status: 400 })
    if (!companyName || !companyName.trim())
      return NextResponse.json({ error: "Company Name is required." }, { status: 400 })
    if (!email || !email.trim()) return NextResponse.json({ error: "Email is required." }, { status: 400 })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    if (!phone || !phone.trim()) return NextResponse.json({ error: "Phone Number is required." }, { status: 400 })
    if (!/^[0-9]+$/.test(phone)) return NextResponse.json({ error: "Phone Number must be numeric." }, { status: 400 })
    if (!date) return NextResponse.json({ error: "Date is required." }, { status: 400 })

    // Environment variables for SMTP
    const host = process.env.EMAIL_HOST
    const portRaw = process.env.EMAIL_PORT
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    if (!host || !portRaw || !user || !pass) {
      return NextResponse.json(
        { error: "Email configuration is missing. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS." },
        { status: 500 },
      )
    }

    const port = Number(portRaw)
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for others like 587
      auth: { user, pass },
    })

    // Send confirmation email
    const mailResult = await transporter.sendMail({
      from: user,
      to: email,
      subject: "Appointment Confirmation",
      text: "Your Appointment has been fixed",
      html: "<p>Your Appointment has been fixed</p>",
    })

    return NextResponse.json({ ok: true, messageId: mailResult.messageId })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 })
  }
}
