"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Shield, Lock, Eye, EyeOff } from "lucide-react"
import { verifyTOTPCode, encodeEmailForPath } from "@/lib/totp"
import { ref, get } from "firebase/database"
import { db, auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"login" | "totp">("login")
  const { signIn, user, loading, totpRequired, setTotpRequired, tempAuthEmail, setTempAuthEmail, tempAuthPassword, setTempAuthPassword } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/admin/dashboard")
      return;
    }
  }, [user, loading, router])


  // Check if TOTP required from previous authentication
  useEffect(() => {
    if (totpRequired && tempAuthEmail) {
      setStep("totp")
      setEmail(tempAuthEmail)
    }
  }, [totpRequired, tempAuthEmail])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn(email, password)

      // Check if TOTP was required
      if (totpRequired) {
        setStep("totp")
      } else {
        // No TOTP required, redirect to dashboard
        router.push("/admin/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials")
      setTotpRequired(false)
      setTempAuthEmail(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!tempAuthEmail || !totpCode.trim()) {
        throw new Error("TOTP code is required")
      }

      // Get the user-specific TOTP secret
      const encodedEmail = encodeEmailForPath(tempAuthEmail)
      const totpSettingsRef = ref(db, `user_totp_settings/${encodedEmail}`)
      const totpSnapshot = await get(totpSettingsRef)

      if (!totpSnapshot.exists()) {
        throw new Error("TOTP not configured for this account")
      }

      const totpSettings = totpSnapshot.val()
      if (!totpSettings.enabled || !totpSettings.secret) {
        throw new Error("TOTP is not enabled for this account")
      }

      // Log for debugging
      console.log("Login TOTP verification:", {
        emailLength: tempAuthEmail.length,
        codeLength: totpCode.length,
        secretLength: totpSettings.secret.length,
      })

      // Verify the TOTP code (now async) - pass email for per-user verification
      const isValid = await verifyTOTPCode(totpSettings.secret, totpCode, tempAuthEmail)
      if (!isValid) {
        throw new Error("Invalid TOTP code. Please try again.")
      }

      // TOTP verified, now sign in again using stored temp password (fallback to local)
      const pw = tempAuthPassword ?? password
      if (!pw) throw new Error("Missing password for final sign-in")
      await signInWithEmailAndPassword(auth, tempAuthEmail, pw)

      setTotpRequired(false)
      setTempAuthEmail(null)
      setTempAuthPassword(null)
      setStep("login")
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid TOTP code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setStep("login")
    setTotpCode("")
    setError(null)
    setTotpRequired(false)
    setTempAuthEmail(null)
    setTempAuthPassword(null)
    setPassword("")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {step === "login" ? (
              <Shield className="w-6 h-6 text-primary" />
            ) : (
              <Lock className="w-6 h-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">
            {step === "login" ? "Admin Login" : "Verify Code"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === "login"
              ? "Access the Verlux Stands CMS Dashboard"
              : "Enter your authenticator code"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@verluxstands-web.vercel.app"
                  required
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={`${!showPassword ? "password" : "text"}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-secondary border-border text-foreground"
                  />
                  <button type="button" className="absolute top-2 end-2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? <Eye /> : <EyeOff/>}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTotpSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>Open your authenticator app and enter the 6-digit code below.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totp" className="text-foreground">Authentication Code</Label>
                <Input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="0 0 0 0 0 0"
                  maxLength={6}
                  required
                  className="bg-secondary border-border text-foreground text-center mt-4 font-bold tracking-widest font-mono tkracking-wide" style={{ letterSpacing: "0.8rem" }}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading || totpCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </form>
          )}

          {step === "login" && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Contact your administrator if you need access.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
