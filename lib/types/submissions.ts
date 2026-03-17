export type SubmissionType = 'contact' | 'quote' | 'brochure'

export type SubmissionStatus =
  | 'new'
  | 'in_progress'
  | 'answered'
  | 'ignored'
  | 'archived'

export interface SubmissionAttachment {
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  downloadUrl?: string
  pathname?: string
  fileId?: string
}

export interface SubmissionRecord {
  id: string
  type: SubmissionType
  status: SubmissionStatus
  createdAt: number
  updatedAt: number
  sourcePage?: string
  contactName: string
  companyName: string
  email: string
  phone: string
  countryCode?: string
  message?: string
  exhibition?: string
  standSize?: string
  eventType?: string
  budget?: string
  attachment?: SubmissionAttachment | null
  notes?: string
  answeredAt?: number | null
}

export const submissionStatusOptions: SubmissionStatus[] = [
  'new',
  'in_progress',
  'answered',
  'ignored',
  'archived',
]

export const submissionTypeLabels: Record<SubmissionType, string> = {
  contact: 'Contact Form',
  quote: 'Quote Request',
  brochure: 'Brochure Request',
}

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  answered: 'Answered',
  ignored: 'Ignored',
  archived: 'Archived',
}
