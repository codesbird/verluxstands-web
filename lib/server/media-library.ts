import type { MediaRecord } from '@/lib/types/media'
import { adminDB, isAdminInitialized } from '@/lib/firebase-admin'
import { unstable_noStore as noStore } from 'next/cache'

export interface PortfolioItem {
  id: string
  title: string
  category: string
  image: string
  originalName: string
  description: string
  createdAt: number
}

export async function getPortfolioMedia() {
  noStore()

  if (!isAdminInitialized || !adminDB) {
    return [] as PortfolioItem[]
  }

  const snapshot = await adminDB.ref('media_library').get()
  if (!snapshot.exists()) {
    return [] as PortfolioItem[]
  }

  const files = Object.values(snapshot.val() || {}) as MediaRecord[]

  return files
    .filter((file) => file.scope === 'portfolio' && file.status === 'active')
    .sort((left, right) => right.createdAt - left.createdAt)
    .map((file) => ({
      id: file.id,
      title: file.title,
      category: file.category || 'Uncategorized',
      image: file.url,
      originalName: file.originalName,
      description: file.description || file.originalName,
      createdAt: file.createdAt,
    }))
}
