import { NextRequest } from 'next/server'
import { adminAuth, adminDB, isAdminInitialized } from '@/lib/firebase-admin'

export function requireAdminDb() {
  if (!isAdminInitialized || !adminDB) {
    throw new Error('Firebase Admin is not configured.')
  }

  return adminDB
}

export async function requireAdminRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized request.')
  }

  if (!adminAuth) {
    throw new Error('Firebase Admin auth is not configured.')
  }

  const token = authHeader.replace('Bearer ', '').trim()
  return adminAuth.verifyIdToken(token)
}
