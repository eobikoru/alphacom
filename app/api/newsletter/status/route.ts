import { NextResponse } from "next/server"

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api/subscribers"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUBSCRIBED_STATUSES = new Set(["active", "unconfirmed"])

export async function POST(request: Request) {
  const apiKey = process.env.MAILERLITE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ subscribed: false })
  }

  let email = ""
  try {
    const body = await request.json()
    email = String(body?.email ?? "").trim().toLowerCase()
  } catch {
    return NextResponse.json({ subscribed: false })
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ subscribed: false })
  }

  try {
    const response = await fetch(`${MAILERLITE_API_URL}/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (response.status === 404) return NextResponse.json({ subscribed: false })
    if (!response.ok) return NextResponse.json({ subscribed: false })

    const payload = await response.json()
    const status = String(payload?.data?.status ?? "").toLowerCase()
    return NextResponse.json({ subscribed: SUBSCRIBED_STATUSES.has(status) })
  } catch {
    return NextResponse.json({ subscribed: false })
  }
}
