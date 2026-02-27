"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AdminSidebar } from "@/components/admin/sidebar"
import { TOTPSetupModal } from "@/components/admin/totp-setup-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Loader2, Key } from "lucide-react"
import { ref, get } from "firebase/database"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { AdminTOTPSettings, encodeEmailForPath } from "@/lib/totp"
import Confirm from "@/components/Confirm"
import { AdminSidebarToggleButton } from "@/components/admin/sidebar"


export default function AdminSettingsPage() {
  const { user, resetPassword, error } = useAuth()
  const [totpEnabled, setTotpEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [disableLoading, setDisableLoading] = useState(false)
  const [confirmState, setConfirmState] = useState<{
    title?: string;
    message: string;
    confirmText?: string;
    confirmButtonClass?: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    fetchTOTPSettings()
  }, [user?.email])

  const fetchTOTPSettings = async () => {
    try {
      if (!user?.email) {
        setLoading(false)
        return
      }

      console.log("The user a; a': ", user)
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
      setConfirmState({
        title: "Turn off 2FA",
        message: "Are you sure you want to turn off the 2FA for admin account",
        confirmText: "Disable 2FA",
        confirmButtonClass: "bg-red-600 hover:bg-red-700",
        onConfirm: () => disableTOTP(),
      })
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
      setDisableLoading(false);
      setConfirmState(null);
    }
  }


  const handlePasswordChange = async () => {
    if (!user?.email.trim()) return;
    setLoading(true)

    try {
      await resetPassword(user?.email);
      alert("If the email exists, a reset link has been sent.");
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen max-h-[80vh] 0verflow-hiddden bg-background flex justify-start">
      <AdminSidebar />
      <Confirm
        isOpen={!!confirmState}
        title={confirmState?.title}
        message={confirmState?.message || ""}
        confirmText={confirmState?.confirmText}
        confirmButtonClass={confirmState?.confirmButtonClass}
        onConfirm={confirmState?.onConfirm}
        onClose={() => setConfirmState(null)}
      />

      <div className="w-full p-2 md:p-8 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              <AdminSidebarToggleButton /> Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your admin account security and preferences
            </p>
          </div>

          <Card className="bg-card border-border p-2 my-3">
            <div className=" flex justify-start gap-5 flex-wrap mb-2">
              <div className="flex items-center justify-start p-2 gap-2 me-auto`">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Key className=" text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your admin account
                  </CardDescription>
                </div>
              </div>

              <div className="space-y-1 flex gap-3 items-center ml-3">
                {/* <Label className="text-foreground font-medium">Status</Label> */}
                <span className="text-sm text-muted-foreground">
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
                </span>

              </div>
              <div className="relative flex justify-end items-center">
                <Switch
                  checked={totpEnabled}
                  onCheckedChange={handleTOTPToggle}
                  disabled={loading || disableLoading}
                />
              </div>
            </div>

            {/* Action Button */}
            {totpEnabled && (
              <div className="flex gap-3 flex-col mb-2">

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    <p className="font-medium">Keep your secret key safe</p>
                    <p>If you lose access to your authenticator app, you won't be able to log in. Save your recovery key in a secure location.</p>
                  </div>
                </div>
              </div>

            )}

            <details>
              <summary className="text-sm font-medium text-gray-400 dark:text-blue-400">💡 How it works</summary>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>When enabled, you'll need to enter a code from your authenticator app during login</li>
                  <li>Use apps like Google Authenticator, Microsoft Authenticator, or Authy</li>
                  <li>You can enable or disable this anytime from this page</li>
                </ul>
              </div>
            </details>

          </Card>

          <Card className="bg-card border-border p-2 my-3">
            <div className=" flex justify-start gap-5">

              <div className="flex items-center justify-start p-2 gap-2 ">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className=" text-primary" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Change Password</CardTitle>
                  <CardDescription>
                    Update your administrator account password if you suspect unauthorized access or a security threat.
                  </CardDescription>

                </div>
              </div>
            </div>

            <div className="p-2 rounded flex gap-3 flex-col">
              <div
                className="flex gap-3 flex-wrap items-center"
              // onSubmit={handlePasswordChange}
              >
                <p className="text-yellow-700">
                  Before proceeding, your admin identity will be verified. A secure password reset link will then be sent to your registered email address.
                </p>

                <button
                  onClick={() =>
                    setConfirmState({
                      title: "Send Password Reset Link",
                      message:
                        "Are you sure you want to send a password reset link to the admin email?",
                      confirmText: "Send Link",
                      confirmButtonClass: "bg-red-600 hover:bg-red-700",
                      onConfirm: () => handlePasswordChange(),
                    })
                  }
                  disabled={loading}
                  type="button"
                  className={`text-sm py-2 px-3 rounded ${loading
                    ? "bg-[#111] cursor-not-allowed"
                    : "bg-[#222] hover:bg-[#333]"
                    }`}
                >
                  {loading ? "Sending reset link..." : "Send Password Reset Link"}
                </button>

              </div>
            </div>

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
