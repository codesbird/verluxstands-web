import { NextRequest, NextResponse } from "next/server"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getDatabase } from "firebase-admin/database"
import speakeasy from "speakeasy"

/**
 * Encode email for use as Firebase Realtime Database path
 * Firebase paths cannot contain ".", "#", "$", "[", or "]"
 */
function encodeEmailForPath(email: string): string {
  return email.toLowerCase().replace(/\./g, "_")
}

// Initialize Firebase Admin
const initializeFirebaseAdmin = () => {
  const apps = getApps()
  if (apps.length > 0) {
    return apps[0]
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }

  return initializeApp({
    credential: cert(serviceAccount as any),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { secret, code, action, email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (action === "enable") {
      if (!secret || !code) {
        return NextResponse.json(
          { error: "Secret and code are required for enable action" },
          { status: 400 }
        )
      }

      // First verify the code is valid
      const verified = speakeasy.totp.verify({
        secret: String(secret).trim(),
        encoding: "base32",
        token: String(code).trim(),
        window: 2,
      })

      if (!verified) {
        return NextResponse.json(
          { error: "Invalid TOTP code" },
          { status: 400 }
        )
      }

      // Initialize Firebase Admin
      const app = initializeFirebaseAdmin()
      const db = getDatabase(app)

      // Save user-specific TOTP settings
      const encodedEmail = encodeEmailForPath(email)
      await db.ref(`user_totp_settings/${encodedEmail}`).set({
        enabled: true,
        secret: secret,
        enabledAt: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: "TOTP enabled successfully for your account",
      })
    } else if (action === "disable") {
      // Initialize Firebase Admin
      const app = initializeFirebaseAdmin()
      const db = getDatabase(app)

      // Disable user-specific TOTP settings
      const encodedEmail = encodeEmailForPath(email)
      await db.ref(`user_totp_settings/${encodedEmail}`).set({
        enabled: false,
      })

      return NextResponse.json({
        success: true,
        message: "TOTP disabled successfully for your account",
      })
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("TOTP settings error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: "Failed to update TOTP settings", details: message },
      { status: 500 }
    )
  }
}

