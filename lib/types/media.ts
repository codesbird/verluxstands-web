export type MediaScope = 'portfolio' | 'shared'

export type MediaStatus = 'active' | 'archived'

export interface MediaRecord {
  id: string
  scope: MediaScope
  category: string
  title: string
  description: string
  originalName: string
  storedName: string
  pathname: string
  url: string
  downloadUrl: string
  contentType: string
  size: number
  originalSize: number
  compressed: boolean
  width: number | null
  height: number | null
  ext: string
  status: MediaStatus
  createdAt: number
  updatedAt: number
  uploadedBy: string
}

export interface MediaUploadResponse {
  success: true
  file: MediaRecord
}

export interface MediaListResponse {
  success: true
  files: MediaRecord[]
}
