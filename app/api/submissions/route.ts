import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDB, isAdminInitialized } from '@/lib/firebase-admin'
import { uploadSubmissionAttachmentToBlob } from '@/lib/server/submission-attachments'
import { buildSubmissionEmailHtml, buildSubmissionEmailText } from '@/lib/server/submission-email'
import { getAdminNotificationEmail, getSmtpSender, getSmtpTransporter } from '@/lib/server/smtp'
import type { SubmissionRecord, SubmissionStatus, SubmissionType } from '@/lib/types/submissions'

const allowedStatuses: SubmissionStatus[] = ['new', 'in_progress', 'answered', 'ignored', 'archived']
const allowedTypes: SubmissionType[] = ['contact', 'quote', 'brochure']

function requireAdminDb() {
  if (!isAdminInitialized || !adminDB) {
    throw new Error('Firebase Admin is not configured.')
  }

  return adminDB
}

async function requireAdminRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized request.')
  }

  if (!adminAuth) {
    throw new Error('Firebase Admin auth is not configured.')
  }

  const token = authHeader.replace('Bearer ', '').trim()
  await adminAuth.verifyIdToken(token)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^\d{7,15}$/.test(value.replace(/\D/g, ''))
}

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : ''
}

function buildSubmissionRecord(id: string, formData: FormData, attachment: SubmissionRecord['attachment']): SubmissionRecord {
  const type = normalizeText(formData.get('type')) as SubmissionType
  const contactName = normalizeText(formData.get('contactName'))
  const companyName = normalizeText(formData.get('companyName'))
  const email = normalizeText(formData.get('email'))
  const phone = normalizeText(formData.get('phone')).replace(/\D/g, '')
  const countryCode = normalizeText(formData.get('countryCode'))
  const message = normalizeText(formData.get('message'))
  const exhibition = normalizeText(formData.get('exhibition'))
  const standSize = normalizeText(formData.get('standSize'))
  const eventType = normalizeText(formData.get('eventType'))
  const budget = normalizeText(formData.get('budget'))
  const sourcePage = normalizeText(formData.get('sourcePage'))

  if (!allowedTypes.includes(type)) {
    throw new Error('Invalid submission type.')
  }

  if (!contactName) throw new Error('Contact name is required.')
  if (!companyName) throw new Error('Company name is required.')
  if (!email || !isValidEmail(email)) throw new Error('A valid email is required.')
  if (!phone || !isValidPhone(phone)) throw new Error('A valid phone number is required.')

  if (type === 'quote' && !message) {
    throw new Error('Project details are required for quote requests.')
  }

  if (type === 'contact' && !message) {
    throw new Error('Message is required for contact submissions.')
  }

  const now = Date.now()

  return {
    id,
    type,
    status: 'new',
    createdAt: now,
    updatedAt: now,
    sourcePage: sourcePage || undefined,
    contactName,
    companyName,
    email,
    phone,
    countryCode: countryCode || undefined,
    message: message || undefined,
    exhibition: exhibition || undefined,
    standSize: standSize || undefined,
    eventType: eventType || undefined,
    budget: budget || undefined,
    attachment: attachment || null,
    notes: '',
    answeredAt: null,
  }
}

function sanitizeSubmissionRecord(submission: SubmissionRecord) {
  return JSON.parse(JSON.stringify(submission)) as SubmissionRecord
}

async function sendAdminNotification(submission: SubmissionRecord) {
  const transporter = getSmtpTransporter()
  await transporter.sendMail({
    from: getSmtpSender(),
    to: getAdminNotificationEmail(),
    replyTo: submission.email,
    subject: `Verlux ${submission.type.toUpperCase()} | ${submission.contactName} | ${submission.companyName}`,
    html: buildSubmissionEmailHtml(submission),
    text: buildSubmissionEmailText(submission),
  })
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminRequest(request)
    const db = requireAdminDb()
    const snapshot = await db.ref('submissions').get()
    const submissions = snapshot.exists() ? snapshot.val() : {}
    return NextResponse.json({ submissions })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load submissions.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = requireAdminDb()
    const formData = await request.formData()
    const submissionRef = db.ref('submissions').push()

    if (!submissionRef.key) {
      throw new Error('Failed to create a submission id.')
    }

    const fileEntry = formData.get('file')
    const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null
    const attachment = file ? await uploadSubmissionAttachmentToBlob(submissionRef.key, file) : null
    const submission = sanitizeSubmissionRecord(buildSubmissionRecord(submissionRef.key, formData, attachment))

    await submissionRef.set(submission)

    try {
      await sendAdminNotification(submission)
    } catch (error) {
      console.error('Submission saved but notification email failed:', error)
    }

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit the form.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdminRequest(request)
    const db = requireAdminDb()
    const body = await request.json()
    const submissionId = String(body.submissionId || '')
    const status = String(body.status || '') as SubmissionStatus
    const notes = typeof body.notes === 'string' ? body.notes.trim() : undefined

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required.' }, { status: 400 })
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const updatePayload: Partial<SubmissionRecord> = {
      status,
      updatedAt: Date.now(),
    }

    if (notes !== undefined) {
      updatePayload.notes = notes
    }

    if (status === 'answered') {
      updatePayload.answeredAt = Date.now()
    }

    await db.ref(`submissions/${submissionId}`).update(updatePayload)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update submission.' },
      { status: 500 },
    )
  }
}
