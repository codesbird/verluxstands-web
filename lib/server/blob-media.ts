import path from 'node:path'
import sharp from 'sharp'
import { del, getDownloadUrl, put } from '@vercel/blob'
import type { PutBlobResult } from '@vercel/blob'
import type { MediaRecord, MediaScope } from '@/lib/types/media'

const IMAGE_COMPRESSION_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/tiff',
])

function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'file'
}

function getFallbackCategory(scope: MediaScope) {
  return scope === 'portfolio' ? 'Uncategorized' : 'Shared Files'
}

function getExtension(name: string) {
  return path.extname(name).replace('.', '').toLowerCase()
}

function getBaseName(name: string) {
  return path.basename(name, path.extname(name))
}

function isCompressibleImage(contentType: string) {
  return IMAGE_COMPRESSION_TYPES.has(contentType.toLowerCase())
}

export async function compressMediaFile(file: File) {
  const originalBuffer = Buffer.from(await file.arrayBuffer())
  const originalSize = originalBuffer.byteLength

  if (isCompressibleImage(file.type)) {
    const transformed = sharp(originalBuffer, { failOn: 'none' })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })

    const { data, info } = await transformed.toBuffer({ resolveWithObject: true })
    const compressed = data.byteLength < originalSize || file.type !== 'image/webp'

    return {
      buffer: data,
      contentType: 'image/webp',
      ext: 'webp',
      storedName: `${slugifySegment(getBaseName(file.name))}.webp`,
      compressed,
      originalSize,
      size: data.byteLength,
      width: info.width ?? null,
      height: info.height ?? null,
    }
  }

  const ext = getExtension(file.name) || 'bin'

  return {
    buffer: originalBuffer,
    contentType: file.type || 'application/octet-stream',
    ext,
    storedName: `${slugifySegment(getBaseName(file.name))}.${ext}`,
    compressed: false,
    originalSize,
    size: originalSize,
    width: null,
    height: null,
  }
}

export async function uploadMediaToBlob(options: {
  id: string
  file: File
  scope: MediaScope
  category?: string
  title?: string
  description?: string
  uploadedBy: string
}): Promise<MediaRecord> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured.')
  }

  const compressedFile = await compressMediaFile(options.file)
  const category = options.category?.trim() || getFallbackCategory(options.scope)
  const safeCategory = slugifySegment(category)
  const pathname = `${options.scope}/${safeCategory}/${options.id}-${compressedFile.storedName}`
  const blob: PutBlobResult = await put(pathname, compressedFile.buffer, {
    access: 'public',
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
    contentType: compressedFile.contentType,
  })

  const title = options.title?.trim() || getBaseName(options.file.name)
  const now = Date.now()

  return {
    id: options.id,
    scope: options.scope,
    category,
    title,
    description: options.description?.trim() || '',
    originalName: options.file.name,
    storedName: compressedFile.storedName,
    pathname: blob.pathname,
    url: blob.url,
    downloadUrl: blob.downloadUrl || getDownloadUrl(blob.url),
    contentType: compressedFile.contentType,
    size: compressedFile.size,
    originalSize: compressedFile.originalSize,
    compressed: compressedFile.compressed,
    width: compressedFile.width,
    height: compressedFile.height,
    ext: compressedFile.ext,
    status: 'active',
    createdAt: now,
    updatedAt: now,
    uploadedBy: options.uploadedBy,
  }
}

export async function deleteMediaFromBlob(url: string) {
  await del(url)
}
