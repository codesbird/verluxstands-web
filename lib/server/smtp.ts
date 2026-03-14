import nodemailer from 'nodemailer'

let cachedTransporter: nodemailer.Transporter | null = null

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required SMTP environment variable: ${name}`)
  }
  return value
}

export function getSmtpTransporter() {
  if (cachedTransporter) {
    return cachedTransporter
  }

  const host = getRequiredEnv('SMTP_HOST')
  const port = Number(process.env.SMTP_PORT || '587')
  const user = getRequiredEnv('SMTP_USER')
  const pass = getRequiredEnv('SMTP_PASS')
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true' || port === 465

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })

  return cachedTransporter
}

export function getSmtpSender() {
  return {
    name: process.env.SMTP_FROM_NAME || 'Verlux Stands Website',
    address: getRequiredEnv('SMTP_FROM_EMAIL'),
  }
}

export function getAdminNotificationEmail() {
  return getRequiredEnv('ADMIN_NOTIFICATION_EMAIL')
}
