import { NextResponse } from "next/server"

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api/subscribers"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const apiKey = process.env.MAILERLITE_API_KEY
  const groupId = process.env.MAILERLITE_GROUP_ID

  if (!apiKey) {
    return NextResponse.json({ success: false, message: "Newsletter is not configured yet." }, { status: 500 })
  }

  let email = ""
  try {
    const body = await request.json()
    email = String(body?.email ?? "").trim().toLowerCase()
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 })
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 422 })
  }

  try {
    const response = await fetch(MAILERLITE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true, message: "You're subscribed. Welcome aboard!" })
    }

    if (response.status === 422) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address." }, { status: 422 })
    }

    console.error("MailerLite subscribe failed", response.status, await response.text())
    return NextResponse.json(
      { success: false, message: "We couldn't subscribe you right now. Please try again." },
      { status: 502 },
    )
  } catch (error) {
    console.error("MailerLite subscribe error", error)
    return NextResponse.json(
      { success: false, message: "We couldn't subscribe you right now. Please try again." },
      { status: 502 },
    )
  }
}
