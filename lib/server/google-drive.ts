import { google } from 'googleapis'
import { Readable } from 'stream'

interface UploadedFileResult {
  fileId: string
  url: string
  fileName: string
  fileSize: number
  mimeType: string
}

function assertDriveConfig() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google Drive upload is not configured. Add GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.')
  }
}

export async function uploadFileToDrive(file: File): Promise<UploadedFileResult> {
  assertDriveConfig()

  const buffer = Buffer.from(await file.arrayBuffer())

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  const drive = google.drive({ version: 'v3', auth })
  const parentFolderId = process.env.GOOGLE_FOLDER_ID

  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      parents: parentFolderId ? [parentFolderId] : undefined,
    },
    media: {
      mimeType: file.type,
      body: Readable.from(buffer),
    },
    fields: 'id',
  })

  const fileId = response.data.id

  if (!fileId) {
    throw new Error('Google Drive did not return a file id.')
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  return {
    fileId,
    url: `https://drive.google.com/uc?id=${fileId}`,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
  }
}
