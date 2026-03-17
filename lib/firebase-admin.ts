import { initializeApp, getApps, cert } from 'firebase-admin/app'
import type { App } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import type { Database } from 'firebase-admin/database'
import { getAuth } from 'firebase-admin/auth'
import type { Auth } from 'firebase-admin/auth'

let app: App | null = null
let adminDB: Database | null = null
let adminAuth: Auth | null = null

const hasAdminCredentials =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_DATABASE_URL

if (hasAdminCredentials) {
  try {
    if (!getApps().length) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })
    } else {
      app = getApps()[0]
    }
    adminDB = getDatabase(app)
    adminAuth = getAuth(app)
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
  }
}

export { adminDB, adminAuth }
export const isAdminInitialized = !!adminDB
