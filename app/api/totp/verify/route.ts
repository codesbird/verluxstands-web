import { NextRequest, NextResponse } from "next/server"
import speakeasy from "speakeasy"

export async function POST(request: NextRequest) {
  try {
    const { secret, code, email } = await request.json()

    if (!secret || !code || !email) {
      return NextResponse.json(
        { error: "Secret, code, and email are required" },
        { status: 400 }
      )
    }

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: String(secret).trim(),
      encoding: "base32",
      token: String(code).trim(),
      window: 2,
    })

    const isValid = verified !== false && verified !== null

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error("TOTP verification error:", error)
    return NextResponse.json(
      { error: "Failed to verify TOTP code", details: String(error) },
      { status: 500 }
    )
  }
}

