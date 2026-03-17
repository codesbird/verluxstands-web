import { NextRequest, NextResponse } from 'next/server'
import type { MediaRecord, MediaScope } from '@/lib/types/media'
import { requireAdminDb, requireAdminRequest } from '@/lib/server/admin-request'
import { uploadMediaToBlob } from '@/lib/server/blob-media'

export const dynamic = 'force-dynamic'

const ALLOWED_SCOPES: MediaScope[] = ['portfolio', 'shared']

function getScope(value: string | null): MediaScope {
  const scope = (value || 'shared').trim() as MediaScope
  if (!ALLOWED_SCOPES.includes(scope)) {
    throw new Error('Invalid media scope.')
  }
  return scope
}

function sortFiles(files: MediaRecord[]) {
  return files.sort((left, right) => right.createdAt - left.createdAt)
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminRequest(request)
    const db = requireAdminDb()
    const scope = request.nextUrl.searchParams.get('scope')
    const snapshot = await db.ref('media_library').get()
    const files = snapshot.exists() ? (Object.values(snapshot.val()) as MediaRecord[]) : []
    const filteredFiles = scope ? files.filter((file) => file.scope === scope) : files

    return NextResponse.json({ success: true, files: sortFiles(filteredFiles) })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load files.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdminRequest(request)
    const db = requireAdminDb()
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'A file is required.' }, { status: 400 })
    }

    const scope = getScope(formData.get('scope')?.toString() || null)
    const mediaRef = db.ref('media_library').push()

    if (!mediaRef.key) {
      throw new Error('Failed to create a media record id.')
    }

    const mediaRecord = await uploadMediaToBlob({
      id: mediaRef.key,
      file,
      scope,
      category: formData.get('category')?.toString() || undefined,
      title: formData.get('title')?.toString() || undefined,
      description: formData.get('description')?.toString() || undefined,
      uploadedBy: adminUser.email || adminUser.uid,
    })

    await mediaRef.set(mediaRecord)

    return NextResponse.json({ success: true, file: mediaRecord })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload the file.' },
      { status: 500 },
    )
  }
}
