"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertCircle, Copy, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react"
import { generateTOTPSecret, verifyTOTPCode, generateTOTPCode } from "@/lib/totp"
import { toast } from "sonner"

interface TOTPSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (secret: string, code: string) => Promise<void>
  email: string
}

export function TOTPSetupModal({
  open,
  onOpenChange,
  onConfirm,
  email,
}: TOTPSetupModalProps) {
  const [step, setStep] = useState<"setup" | "verify">("setup")
  const [qrCode, setQrCode] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [verifyCode, setVerifyCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    if (open && !secret) {
      generateSecret()
    }
  }, [open])

  const generateSecret = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const setup = await generateTOTPSecret(email)
      setSecret(setup.secret)
      setQrCode(setup.qrCode)
      setStep("setup")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate secret")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceedToVerify = () => {
    if (!secret) {
      setError("Secret not generated")
      return
    }
    setStep("verify")
    setError(null)
  }

  const handleVerify = async () => {
    try {
      setError(null)

      if (!verifyCode || verifyCode.length !== 6) {
        setError("Please enter a valid 6-digit code")
        return
      }

      // Log for debugging
      console.log("Verifying TOTP code:", {
        secretLength: secret.length,
        codeLength: verifyCode.length,
        code: verifyCode,
      })

      setIsLoading(true)

      // Call async verification function
      const isValid = await verifyTOTPCode(secret, verifyCode, email)

      if (!isValid) {
        setError("Invalid code. The code may have expired. Please enter the current 6-digit code from your authenticator app.")
        setIsLoading(false)
        return
      }

      await onConfirm(secret, verifyCode)

      // Reset and close
      setSecret("")
      setQrCode("")
      setVerifyCode("")
      setStep("setup")
      onOpenChange(false)
      toast.success("Two-factor authentication enabled")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret)
    toast.success("Secret key copied to clipboard")
  }

  const handleClose = () => {
    setSecret("")
    setQrCode("")
    setVerifyCode("")
    setStep("setup")
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            {step === "setup"
              ? "Scan the QR code with your authenticator app"
              : "Verify the code from your authenticator app"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {step === "setup" ? (
            <>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg flex justify-center">
                  {qrCode ? (
                    <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-secondary animate-pulse rounded" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret-key" className="text-sm font-medium">
                    Manual Entry Key
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="secret-key"
                        type={showSecret ? "text" : "password"}
                        value={secret}
                        readOnly
                        className="bg-secondary border-border font-mono text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showSecret ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="px-3"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Save this key in a safe place. You'll need it to recover your account.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-700 dark:text-yellow-400">
                  <p className="font-medium mb-1">⚠️ Important</p>
                  <p>Make sure to test the code before saving.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="totp-verify" className="text-sm font-medium">
                  Authentication Code
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Enter the 6-digit code from your authenticator app
                </p>
                <Input
                  id="totp-verify"
                  type="text"
                  inputMode="numeric"
                  value={verifyCode}
                  onChange={(e) =>
                    setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="bg-secondary border-border text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  💡 Troubleshooting Tips:
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Make sure your device time is synchronized</li>
                  <li>Codes expire after 30 seconds - use a fresh code</li>
                  <li>Copy the code immediately from your authenticator app</li>
                  <li>Check that you scanned the correct QR code</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {step === "setup" ? (
            <Button
              onClick={handleProceedToVerify}
              disabled={!secret || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Next"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleVerify}
              disabled={verifyCode.length !== 6 || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Enable"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
