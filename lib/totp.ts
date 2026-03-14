import speakeasy from "speakeasy"
import QRCode from "qrcode"

export interface TOTPSetup {
  secret: string
  qrCode: string
  manualEntryKey: string
}

export interface AdminTOTPSettings {
  enabled: boolean
  secret?: string
}

/**
 * Encode email for use as Firebase Realtime Database path
 * Firebase paths cannot contain ".", "#", "$", "[", or "]"
 * @param email Email address to encode
 * @returns Encoded email safe for Firebase paths
 */
export function encodeEmailForPath(email: string): string {
  return email.toLowerCase().replace(/\./g, "_")
}

/**
 * Decode email from Firebase Realtime Database path
 * @param encoded Encoded email from Firebase path
 * @returns Original email address
 */
export function decodeEmailFromPath(encoded: string): string {
  return encoded.replace(/_/g, ".")
}

/**
 * Generate a new TOTP secret and QR code
 * @returns Object containing secret, QR code data URL, and manual entry key
 */
export async function generateTOTPSecret(email: string): Promise<TOTPSetup> {
  const secret = speakeasy.generateSecret({ length: 32 });

  if (!secret.base32) {
    throw new Error("Failed to generate TOTP secret");
  }

  // 1. Define your issuer with spaces
  const issuer = "Verlux Stands Admin";
  const account = email.slice(0, email.indexOf("@"));

  // 2. Generate the URL. Speakeasy will turn spaces into %20
  // Apps will then turn %20 back into " " on the user's screen.
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${issuer}:${account}`,
    issuer: issuer,
    encoding: 'base32',
  });

  try {
    const qrCode = await QRCode.toDataURL(otpauthUrl);
    return {
      secret: secret.base32,
      qrCode,
      manualEntryKey: secret.base32,
    };
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Verify a TOTP code against a secret using server API
 * @param secret Base32-encoded secret
 * @param token 6-digit TOTP code
 * @param email User email for per-user verification
 * @returns true if valid, false otherwise
 */
export async function verifyTOTPCode(secret: string, token: string, email: string): Promise<boolean> {
  try {
    const cleanToken = String(token).trim()
    const cleanSecret = String(secret).trim()
    const cleanEmail = String(email).trim().toLowerCase()

    console.log("TOTP Verification Debug:", {
      secretLength: cleanSecret.length,
      tokenLength: cleanToken.length,
      email: cleanEmail,
    })

    // Validate input
    if (cleanToken.length !== 6 || !/^\d+$/.test(cleanToken)) {
      console.log("Invalid token format - must be 6 digits")
      return false
    }

    // Call server API for verification
    const response = await fetch("/api/totp/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: cleanSecret,
        code: cleanToken,
        email: cleanEmail,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("TOTP verification API error:", error)
      return false
    }

    const result = await response.json()

    if (result.valid) {
      console.log("TOTP verification successful")
    } else {
      console.log("TOTP verification failed - invalid code")
    }

    return result.valid === true
  } catch (error) {
    console.error("TOTP verification error:", error)
    return false
  }
}

/**
 * Generate a TOTP code for testing/display purposes
 * @param secret Base32-encoded secret
 * @returns Current 6-digit TOTP code
 */
export function generateTOTPCode(secret: string): string {
  try {
    const code = speakeasy.totp({
      secret: secret,
      encoding: "base32",
    })
    return code.toString()
  } catch (error) {
    console.error("Error generating TOTP code:", error)
    throw new Error("Failed to generate TOTP code")
  }
}
