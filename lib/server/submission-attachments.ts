import { put } from '@vercel/blob'
import { compressMediaFile } from '@/lib/server/blob-media'
import type { SubmissionAttachment } from '@/lib/types/submissions'

export async function uploadSubmissionAttachmentToBlob(id: string, file: File): Promise<SubmissionAttachment> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured.')
  }

  const compressed = await compressMediaFile(file)
  const pathname = `submissions/${id}-${compressed.storedName}`
  const blob = await put(pathname, compressed.buffer, {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
    contentType: compressed.contentType,
  })

  return {
    fileName: file.name,
    fileSize: compressed.size,
    mimeType: compressed.contentType,
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
  }
}
