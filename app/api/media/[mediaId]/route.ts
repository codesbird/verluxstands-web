import { NextRequest, NextResponse } from 'next/server'
import type { MediaRecord, MediaStatus } from '@/lib/types/media'
import { deleteMediaFromBlob } from '@/lib/server/blob-media'
import { requireAdminDb, requireAdminRequest } from '@/lib/server/admin-request'

export const dynamic = 'force-dynamic'

const ALLOWED_STATUSES: MediaStatus[] = ['active', 'archived']

async function getMediaRecord(mediaId: string) {
  const db = requireAdminDb()
  const snapshot = await db.ref(`media_library/${mediaId}`).get()

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.val() as MediaRecord
}

export async function GET(request: NextRequest, context: { params: Promise<{ mediaId: string }> }) {
  try {
    const { mediaId } = await context.params
    const file = await getMediaRecord(mediaId)

    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    const action = request.nextUrl.searchParams.get('action')
    if (action === 'preview') {
      return NextResponse.redirect(file.url)
    }
    if (action === 'download') {
      return NextResponse.redirect(file.downloadUrl)
    }

    await requireAdminRequest(request)
    return NextResponse.json({ success: true, file })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load the file.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ mediaId: string }> }) {
  try {
    await requireAdminRequest(request)
    const db = requireAdminDb()
    const { mediaId } = await context.params
    const file = await getMediaRecord(mediaId)

    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    const body = await request.json()
    const nextStatus = typeof body.status === 'string' ? (body.status as MediaStatus) : file.status

    if (!ALLOWED_STATUSES.includes(nextStatus)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const updatedFile: MediaRecord = {
      ...file,
      category: typeof body.category === 'string' && body.category.trim() ? body.category.trim() : file.category,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : file.title,
      description: typeof body.description === 'string' ? body.description.trim() : file.description,
      status: nextStatus,
      updatedAt: Date.now(),
    }

    await db.ref(`media_library/${mediaId}`).set(updatedFile)

    return NextResponse.json({ success: true, file: updatedFile })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update the file.' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ mediaId: string }> }) {
  try {
    await requireAdminRequest(request)
    const db = requireAdminDb()
    const { mediaId } = await context.params
    const file = await getMediaRecord(mediaId)

    if (!file) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 })
    }

    await deleteMediaFromBlob(file.url)
    await db.ref(`media_library/${mediaId}`).remove()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete the file.' },
      { status: 500 },
    )
  }
}
