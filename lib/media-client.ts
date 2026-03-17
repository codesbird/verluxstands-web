import type { MediaListResponse, MediaRecord, MediaScope, MediaUploadResponse } from '@/lib/types/media'

function buildAuthHeaders(token: string, extras?: Record<string, string>) {
  return {
    Authorization: `Bearer ${token}`,
    ...extras,
  }
}

export async function fetchMediaFiles(token: string, scope?: MediaScope) {
  const query = scope ? `?scope=${scope}` : ''
  const response = await fetch(`/api/media${query}`, {
    cache: 'no-store',
    headers: buildAuthHeaders(token),
  })
  const data = (await response.json()) as MediaListResponse | { error?: string }
  const errorMessage = 'error' in data ? data.error : undefined

  if (!response.ok || !('files' in data)) {
    throw new Error(errorMessage || 'Failed to load files.')
  }

  return data.files
}

export async function deleteMediaFile(id: string, token: string) {
  const response = await fetch(`/api/media/${id}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  })
  const data = (await response.json()) as { error?: string; success?: boolean }

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete the file.')
  }
}

export async function updateMediaFile(
  id: string,
  token: string,
  payload: Partial<Pick<MediaRecord, 'category' | 'title' | 'description' | 'status'>>,
) {
  const response = await fetch(`/api/media/${id}`, {
    method: 'PATCH',
    headers: buildAuthHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })
  const data = (await response.json()) as { error?: string; success?: boolean; file?: MediaRecord }

  if (!response.ok || !data.file) {
    throw new Error(data.error || 'Failed to update the file.')
  }

  return data.file
}

export function uploadMediaFile(options: {
  token: string
  file: File
  scope: MediaScope
  category?: string
  title?: string
  description?: string
  onProgress?: (progress: number) => void
}) {
  return new Promise<MediaRecord>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/media')
    xhr.responseType = 'json'
    xhr.setRequestHeader('Authorization', `Bearer ${options.token}`)

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      options.onProgress?.(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onerror = () => reject(new Error('Upload failed.'))
    xhr.onload = () => {
      const response = xhr.response as MediaUploadResponse | { error?: string }
      if (xhr.status < 200 || xhr.status >= 300 || !response || !('file' in response)) {
        reject(new Error((response && 'error' in response && response.error) || 'Upload failed.'))
        return
      }
      options.onProgress?.(100)
      resolve(response.file)
    }

    const formData = new FormData()
    formData.append('file', options.file)
    formData.append('scope', options.scope)
    if (options.category) formData.append('category', options.category)
    if (options.title) formData.append('title', options.title)
    if (options.description) formData.append('description', options.description)
    xhr.send(formData)
  })
}
