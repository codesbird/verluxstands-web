"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AdminSidebar } from "@/components/admin/sidebar"
import { TOTPSetupModal } from "@/components/admin/totp-setup-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Loader2 } from "lucide-react"
import { ref, get } from "firebase/database"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { AdminTOTPSettings, encodeEmailForPath } from "@/lib/totp"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [totpEnabled, setTotpEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [disableLoading, setDisableLoading] = useState(false)

  useEffect(() => {
    fetchTOTPSettings()
  }, [user?.email])

  const fetchTOTPSettings = async () => {
    try {
      if (!user?.email) {
        setLoading(false)
        return
      }

      const encodedEmail = encodeEmailForPath(user.email)
      const totpSettingsRef = ref(db, `user_totp_settings/${encodedEmail}`)
      const snapshot = await get(totpSettingsRef)
      
      if (snapshot.exists()) {
        const settings = snapshot.val() as AdminTOTPSettings
        setTotpEnabled(settings.enabled || false)
      }
    } catch (error) {
      console.error("Error fetching TOTP settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTOTPToggle = async (enabled: boolean) => {
    if (enabled && !totpEnabled) {
      // User wants to enable TOTP
      setSetupModalOpen(true)
    } else if (!enabled && totpEnabled) {
      // User wants to disable TOTP
      await disableTOTP()
    }
  }

  const handleSetupConfirm = async (secret: string, code: string) => {
    try {
      setLoading(true)

      if (!user?.email) {
        throw new Error("User email not found")
      }

      // Call server API to save TOTP settings (include verification code)
      const response = await fetch("/api/totp/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secret,
          code: code,
          action: "enable",
          email: user.email,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to enable TOTP")
      }

      const result = await response.json()
      setTotpEnabled(true)
      toast.success("Two-factor authentication has been enabled")
    } catch (error) {
      console.error("Error enabling TOTP:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to enable two-factor authentication"
      )
    } finally {
      setLoading(false)
    }
  }

  const disableTOTP = async () => {
    try {
      setDisableLoading(true)

      if (!user?.email) {
        throw new Error("User email not found")
      }
      
      // Call server API to disable TOTP settings
      const response = await fetch("/api/totp/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: "", // Not needed for disable
          action: "disable",
          email: user.email,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to disable TOTP")
      }

      setTotpEnabled(false)
      toast.success("Two-factor authentication has been disabled")
    } catch (error) {
      console.error("Error disabling TOTP:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to disable two-factor authentication"
      )
      setTotpEnabled(true)
    } finally {
      setDisableLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex justify-start">
      <AdminSidebar />
      <div className="w-full p-8">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your admin account security and preferences
            </p>
          </div>

          {/* TOTP Settings Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your admin account
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Section */}
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                <div className="space-y-1">
                  <Label className="text-foreground font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {totpEnabled ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Enabled
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  💡 How it works
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>When enabled, you'll need to enter a code from your authenticator app during login</li>
                  <li>Use apps like Google Authenticator, Microsoft Authenticator, or Authy</li>
                  <li>You can enable or disable this anytime from this page</li>
                </ul>
              </div>

              {/* Toggle Section */}
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                <Label className="text-foreground font-medium cursor-pointer">
                  {totpEnabled ? "Disable" : "Enable"} Two-Factor Authentication
                </Label>
                <Switch
                  checked={totpEnabled}
                  onCheckedChange={handleTOTPToggle}
                  disabled={loading || disableLoading}
                />
              </div>

              {/* Action Button */}
              {totpEnabled && (
                <Button
                  variant="outline"
                  onClick={() => setSetupModalOpen(true)}
                  className="w-full"
                >
                  Regenerate Secret Key
                </Button>
              )}

              {/* Warning Section */}
              {totpEnabled && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    <p className="font-medium">Keep your secret key safe</p>
                    <p>If you lose access to your authenticator app, you won't be able to log in. Save your recovery key in a secure location.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="bg-card border-border mt-6">
            <CardHeader>
              <CardTitle className="text-foreground">Account Information</CardTitle>
              <CardDescription>Your current admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Email Address</Label>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TOTP Setup Modal */}
      <TOTPSetupModal
        open={setupModalOpen}
        onOpenChange={setSetupModalOpen}
        onConfirm={handleSetupConfirm}
        email={user?.email || ""}
      />
    </div>
  )
}
