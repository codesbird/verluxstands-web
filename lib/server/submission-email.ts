import type { SubmissionRecord } from '@/lib/types/submissions'
import { submissionStatusLabels, submissionTypeLabels } from '@/lib/types/submissions'

function escapeHtml(value?: string | null) {
  if (!value) return '-'
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function detailRow(label: string, value?: string | null) {
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid rgba(196,160,102,0.16);color:#E5D5B8;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:12px;width:180px;">${label}</td>
      <td style="padding:12px 16px;border-bottom:1px solid rgba(196,160,102,0.16);color:#FFFFFF;font-size:14px;line-height:1.7;">${escapeHtml(value)}</td>
    </tr>
  `
}

export function buildSubmissionEmailHtml(submission: SubmissionRecord) {
  const typeLabel = submissionTypeLabels[submission.type]
  const statusLabel = submissionStatusLabels[submission.status]
  const createdAt = new Date(submission.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `
  <div style="margin:0;padding:32px;background:#111111;font-family:'Open Sans',Arial,sans-serif;color:#FFFFFF;">
    <div style="max-width:760px;margin:0 auto;border:1px solid rgba(196,160,102,0.24);border-radius:24px;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(17,17,17,0.96));box-shadow:0 24px 80px rgba(0,0,0,0.35);">
      <div style="padding:28px 32px;border-bottom:1px solid rgba(196,160,102,0.18);background:linear-gradient(135deg,rgba(196,160,102,0.16),rgba(17,17,17,0.98));">
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:18px;letter-spacing:.35em;color:#E5D5B8;text-transform:uppercase;">Verlux Stands</div>
        <h1 style="margin:18px 0 10px;font-family:'Playfair Display',Georgia,serif;font-size:38px;line-height:1.1;color:#FFFFFF;">New ${typeLabel}</h1>
        <p style="margin:0;color:rgba(255,255,255,0.74);font-size:15px;line-height:1.8;">A new lead was submitted through the website and saved to the admin dashboard.</p>
      </div>

      <div style="padding:28px 32px;">
        <div style="display:inline-block;padding:8px 14px;border:1px solid rgba(196,160,102,0.28);border-radius:999px;background:rgba(196,160,102,0.10);color:#E5D5B8;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Status: ${statusLabel}</div>
        <div style="margin-top:12px;color:rgba(255,255,255,0.62);font-size:13px;">Submitted on ${createdAt}</div>

        <table style="width:100%;margin-top:24px;border-collapse:collapse;border:1px solid rgba(196,160,102,0.16);border-radius:16px;overflow:hidden;">
          ${detailRow('Type', typeLabel)}
          ${detailRow('Source Page', submission.sourcePage)}
          ${detailRow('Contact Name', submission.contactName)}
          ${detailRow('Company', submission.companyName)}
          ${detailRow('Email', submission.email)}
          ${detailRow('Phone', `${submission.countryCode || ''} ${submission.phone}`.trim())}
          ${detailRow('Exhibition', submission.exhibition)}
          ${detailRow('Stand Size', submission.standSize)}
          ${detailRow('Event Type', submission.eventType)}
          ${detailRow('Budget', submission.budget)}
          ${detailRow('Message', submission.message)}
          ${detailRow('Attachment', submission.attachment?.url ? submission.attachment.url : undefined)}
        </table>

        <div style="margin-top:24px;padding:20px;border:1px solid rgba(196,160,102,0.16);border-radius:18px;background:rgba(255,255,255,0.02);">
          <div style="margin:0 0 8px;font-family:'Playfair Display',Georgia,serif;font-size:24px;color:#E5D5B8;">Admin Action</div>
          <p style="margin:0;color:rgba(255,255,255,0.74);font-size:14px;line-height:1.8;">Open the admin submissions tab to review this lead, follow up with the contact, and update its status to <strong style="color:#E5D5B8;">Answered</strong>, <strong style="color:#E5D5B8;">Ignored</strong>, or another workflow state.</p>
        </div>
      </div>
    </div>
  </div>
  `
}

export function buildSubmissionEmailText(submission: SubmissionRecord) {
  return [
    `New ${submissionTypeLabels[submission.type]}`,
    `Status: ${submissionStatusLabels[submission.status]}`,
    `Submitted: ${new Date(submission.createdAt).toLocaleString('en-IN')}`,
    `Name: ${submission.contactName}`,
    `Company: ${submission.companyName}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.countryCode || ''} ${submission.phone}`.trim(),
    submission.exhibition ? `Exhibition: ${submission.exhibition}` : null,
    submission.standSize ? `Stand Size: ${submission.standSize}` : null,
    submission.eventType ? `Event Type: ${submission.eventType}` : null,
    submission.budget ? `Budget: ${submission.budget}` : null,
    submission.message ? `Message: ${submission.message}` : null,
    submission.attachment?.url ? `Attachment: ${submission.attachment.url}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}
