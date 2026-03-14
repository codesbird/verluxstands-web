import type { SubmissionType } from '@/lib/types/submissions'

export interface ClientSubmissionPayload {
  type: SubmissionType
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
  file?: File | null
}

export async function submitLeadForm(payload: ClientSubmissionPayload) {
  const formData = new FormData()

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (key === 'file' && value instanceof File) {
      formData.append('file', value)
      return
    }

    if (typeof value === 'string') {
      formData.append(key, value)
    }
  })

  const response = await fetch('/api/submissions', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to submit the form.')
  }

  return data
}
