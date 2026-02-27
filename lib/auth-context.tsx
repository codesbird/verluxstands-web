"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth"
import { auth, db } from "./firebase"
import { ref, get, set } from "firebase/database"
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from "firebase/auth"

import { AdminTOTPSettings, encodeEmailForPath } from "./totp"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  error: string | null
  totpRequired: boolean
  setTotpRequired: (value: boolean) => void
  tempAuthEmail: string | null
  setTempAuthEmail: (email: string | null) => void
  tempAuthPassword: string | null
  setTempAuthPassword: (pw: string | null) => void
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totpRequired, setTotpRequired] = useState(false)
  const [tempAuthEmail, setTempAuthEmail] = useState<string | null>(null)
  const [tempAuthPassword, setTempAuthPassword] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      // First, authenticate with email and password
      await signInWithEmailAndPassword(auth, email, password)

      // Check if TOTP is enabled for this user
      const encodedEmail = encodeEmailForPath(email)
      const totpSettingsRef = ref(db, `user_totp_settings/${encodedEmail}`)
      const totpSnapshot = await get(totpSettingsRef)

      if (totpSnapshot.exists()) {
        const totpSettings = totpSnapshot.val() as AdminTOTPSettings
        if (totpSettings.enabled) {
          // TOTP is enabled, require verification
          setTotpRequired(true)
          setTempAuthEmail(email)
          setTempAuthPassword(password)
          // Don't fully sign in yet - wait for TOTP verification
          await firebaseSignOut(auth)
          return
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setTotpRequired(false)
      setTempAuthEmail(null)
      setTempAuthPassword(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out")
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)

    } catch (err: any) {
      console.error("Reset error:", err)

      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.")
      } else {
        setError("Failed to send reset email.")
      }

      throw err
    } finally {
    }
  }



  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      error,
      totpRequired,
      setTotpRequired,
      tempAuthEmail,
      setTempAuthEmail,
      tempAuthPassword,
      setTempAuthPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
