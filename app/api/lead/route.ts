import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const DEFAULT_LEAD_EMAIL = 'shelpakovzhenya@gmail.com'
const DEFAULT_RESEND_FROM = 'Shelpakov Digital <onboarding@resend.dev>'
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

type LeadPayload = {
  name?: string
  phone?: string
  site?: string
  honeypot?: string
  sourceUrl?: string
  sourceTitle?: string
}

type SmtpCandidate = {
  label: string
  from: string
  to: string
  transport: Record<string, unknown>
}

type ResendConfig = {
  apiKey: string
  from: string
  to: string
}

type MailConfig = {
  resend?: ResendConfig
  smtpCandidates: SmtpCandidate[]
  errors: string[]
}

type MailPayload = {
  replyTo?: string
  subject: string
  text: string
  html: string
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 1000 })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count += 1
  return true
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function parseBoolean(value: string | undefined) {
  if (!value) {
    return null
  }

  const normalized = value.trim().toLowerCase()

  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true
  }

  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false
  }

  return null
}

function normalizeFromAddress(value: string | undefined, fallbackEmail: string) {
  const normalized = value?.trim()

  if (!normalized) {
    return `Shelpakov Digital <${fallbackEmail}>`
  }

  if (normalized.includes('<') && normalized.includes('>')) {
    return normalized
  }

  if (looksLikeEmail(normalized)) {
    return `Shelpakov Digital <${normalized}>`
  }

  return `Shelpakov Digital <${fallbackEmail}>`
}

function maskSecret(value: string) {
  if (!value) {
    return 'not-set'
  }

  if (value.length <= 4) {
    return '****'
  }

  return `${value.slice(0, 2)}****${value.slice(-2)}`
}

function getMailConfig(): MailConfig {
  const recipient =
    process.env.LEAD_TO_EMAIL?.trim() ||
    process.env.MAIL_TO?.trim() ||
    process.env.EMAIL_TO?.trim() ||
    DEFAULT_LEAD_EMAIL

  const rawFrom =
    process.env.RESEND_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    process.env.MAIL_FROM?.trim()

  const resendApiKey =
    process.env.RESEND_API_KEY?.trim() ||
    process.env.RESEND_TOKEN?.trim() ||
    process.env.RESEND_KEY?.trim()

  const resendFrom = rawFrom || DEFAULT_RESEND_FROM

  const gmailPass =
    process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') ||
    process.env.GOOGLE_APP_PASSWORD?.replace(/\s+/g, '') ||
    ''
  const gmailUser =
    process.env.GMAIL_USER?.trim() ||
    process.env.GOOGLE_USER?.trim() ||
    process.env.SMTP_USER?.trim() ||
    process.env.MAIL_USER?.trim() ||
    recipient

  const smtpHost = process.env.SMTP_HOST?.trim()
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpUser =
    process.env.SMTP_USER?.trim() ||
    process.env.SMTP_USERNAME?.trim() ||
    process.env.MAIL_USER?.trim()
  const smtpPass =
    process.env.SMTP_PASS?.trim() ||
    process.env.SMTP_PASSWORD?.trim() ||
    process.env.MAIL_PASS?.trim()
  const smtpSecure = parseBoolean(process.env.SMTP_SECURE)

  const smtpCandidates: SmtpCandidate[] = []
  const errors: string[] = []

  if (resendApiKey) {
    return {
      resend: {
        apiKey: resendApiKey,
        from: resendFrom,
        to: recipient,
      },
      smtpCandidates: buildSmtpCandidates({
        gmailPass,
        gmailUser,
        rawFrom,
        recipient,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        smtpSecure,
      }),
      errors,
    }
  }

  smtpCandidates.push(
    ...buildSmtpCandidates({
      gmailPass,
      gmailUser,
      rawFrom,
      recipient,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpSecure,
    })
  )

  if (smtpCandidates.length === 0) {
    errors.push('Не настроен ни один транспорт доставки. Для Railway лучше всего добавить RESEND_API_KEY и LEAD_TO_EMAIL.')
  }

  return { smtpCandidates, errors }
}

function buildSmtpCandidates(input: {
  gmailPass: string
  gmailUser: string
  rawFrom?: string
  recipient: string
  smtpHost?: string
  smtpPort: number
  smtpUser?: string
  smtpPass?: string
  smtpSecure: boolean | null
}) {
  const candidates: SmtpCandidate[] = []

  if (input.gmailPass) {
    const from = normalizeFromAddress(input.rawFrom, input.gmailUser)

    candidates.push(
      {
        label: 'gmail-service',
        from,
        to: input.recipient,
        transport: {
          service: 'gmail',
          auth: {
            user: input.gmailUser,
            pass: input.gmailPass,
          },
        },
      },
      {
        label: 'gmail-465',
        from,
        to: input.recipient,
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: input.gmailUser,
            pass: input.gmailPass,
          },
          authMethod: 'LOGIN',
          name: 'smtp.gmail.com',
          tls: {
            servername: 'smtp.gmail.com',
            minVersion: 'TLSv1.2',
          },
        },
      },
      {
        label: 'gmail-587',
        from,
        to: input.recipient,
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: input.gmailUser,
            pass: input.gmailPass,
          },
          authMethod: 'LOGIN',
          name: 'smtp.gmail.com',
          tls: {
            servername: 'smtp.gmail.com',
            minVersion: 'TLSv1.2',
          },
        },
      }
    )
  }

  if (input.smtpHost && input.smtpUser && input.smtpPass) {
    candidates.push({
      label: 'smtp-custom',
      from: normalizeFromAddress(input.rawFrom, input.smtpUser),
      to: input.recipient,
      transport: {
        host: input.smtpHost,
        port: Number.isFinite(input.smtpPort) ? input.smtpPort : 587,
        secure: input.smtpSecure ?? (Number.isFinite(input.smtpPort) ? input.smtpPort === 465 : false),
        requireTLS: input.smtpSecure === false ? undefined : Number.isFinite(input.smtpPort) ? input.smtpPort !== 465 : true,
        auth: {
          user: input.smtpUser,
          pass: input.smtpPass,
        },
        authMethod: 'LOGIN',
        name: input.smtpHost,
        tls: {
          servername: input.smtpHost,
          minVersion: 'TLSv1.2',
        },
      },
    })
  }

  return candidates
}

async function ensureLeadLogDirectory(filePath: string) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
  } catch (error) {
    console.error('Unable to create lead log directory', error)
  }
}

async function persistLeadLog(
  payload: { name: string; contact: string; site: string },
  meta: { ip: string; sourceUrl: string; sourceTitle: string; date: string; userAgent: string },
  status: 'sent' | 'failed'
) {
  const leadLogPath = process.env.LEAD_LOG_PATH || path.join(process.cwd(), 'data', 'leads.log')
  const record = {
    status,
    timestamp: new Date().toISOString(),
    payload,
    meta,
  }

  try {
    await ensureLeadLogDirectory(leadLogPath)
    await fs.appendFile(leadLogPath, JSON.stringify(record) + '\n', { encoding: 'utf-8' })
  } catch (error) {
    console.error('Unable to persist lead record', error)
  }
}

async function notifyTelegram(record: {
  payload: { name: string; contact: string; site: string }
  meta: { ip: string; sourceUrl: string; sourceTitle: string; date: string; userAgent: string }
  status: 'sent' | 'failed'
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token || !chatId) {
    return
  }

  const statusLabel = record.status === 'sent' ? '[sent]' : '[failed]'
  const text = [
    `${statusLabel} <b>Заявка с сайта</b>`,
    `Имя: ${escapeHtml(record.payload.name)}`,
    `Контакт: ${escapeHtml(record.payload.contact)}`,
    `Сайт: ${escapeHtml(record.payload.site || 'не указан')}`,
    `Источник: ${escapeHtml(record.meta.sourceTitle)} (${escapeHtml(record.meta.sourceUrl)})`,
    `IP: ${escapeHtml(record.meta.ip)}`,
    `UA: ${escapeHtml(record.meta.userAgent)}`,
  ].join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        parse_mode: 'HTML',
        text,
      }),
      cache: 'no-store',
    })
  } catch (error) {
    console.error('Telegram notification failed', error)
  }
}

async function sendLeadViaResend(config: ResendConfig, mail: MailPayload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const apiMessage =
      typeof payload?.message === 'string'
        ? payload.message
        : typeof payload?.error === 'string'
          ? payload.error
          : response.statusText

    throw new Error(`resend: ${response.status} ${apiMessage}`)
  }

  return {
    transportLabel: 'resend-api',
    info: payload,
  }
}

async function sendLeadViaSmtp(candidates: SmtpCandidate[], mail: MailPayload) {
  const errors: string[] = []

  for (const candidate of candidates) {
    try {
      const transporter = nodemailer.createTransport({
        ...candidate.transport,
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      })

      const info = await transporter.sendMail({
        from: candidate.from,
        to: candidate.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      })

      return {
        transportLabel: candidate.label,
        info,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown mail error'
      errors.push(`${candidate.label}: ${message}`)
      console.error(`[lead-email] ${candidate.label} failed`, error)
    }
  }

  throw new Error(errors.join(' | '))
}

async function sendLeadMail(config: MailConfig, mail: MailPayload) {
  const errors: string[] = []

  if (config.resend) {
    try {
      return await sendLeadViaResend(config.resend, mail)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Resend error'
      errors.push(message)
      console.error('[lead-email] resend-api failed', error)
    }
  }

  if (config.smtpCandidates.length > 0) {
    try {
      return await sendLeadViaSmtp(config.smtpCandidates, mail)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown SMTP error'
      errors.push(message)
    }
  }

  if (errors.length === 0 && config.errors.length > 0) {
    errors.push(...config.errors)
  }

  throw new Error(errors.join(' | ') || 'No mail transport configured')
}

function getMailFailureMessage(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : 'Unknown mail error'
  const message = rawMessage.toLowerCase()

  if (
    message.includes('invalid login') ||
    message.includes('bad credentials') ||
    message.includes('username and password not accepted') ||
    message.includes('invalid credentials') ||
    message.includes('unauthorized') ||
    message.includes('403')
  ) {
    return 'Почтовый сервис отклонил авторизацию. Проверьте ключ Resend или логин и пароль SMTP.'
  }

  if (
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('ehostunreach') ||
    message.includes('enotfound') ||
    message.includes('fetch failed')
  ) {
    return 'Почтовый сервис недоступен по сети. Для Railway надежнее использовать RESEND_API_KEY: он работает через HTTPS и обычно не блокируется.'
  }

  if (message.includes('resend: 422')) {
    return 'Resend отклонил письмо из-за настроек отправителя. Проверьте RESEND_FROM или используйте адрес вида onboarding@resend.dev для теста.'
  }

  return 'Не удалось отправить заявку. Почтовый сервис отклонил письмо. Проверьте RESEND_API_KEY или SMTP-настройки.'
}

export async function POST(request: NextRequest) {
  let name = ''
  let contact = ''
  let site = ''
  let safeSourceUrl = 'Не определен'
  let safeSourceTitle = 'Не определена'
  const ip = getClientIp(request)
  const currentDate = new Date().toLocaleString('ru-RU', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Europe/Moscow',
  })
  const userAgent = request.headers.get('user-agent') || 'Не определен'

  try {
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429 })
    }

    const body = (await request.json()) as LeadPayload
    name = normalizeText(body.name)
    contact = normalizeText(body.phone)
    site = normalizeText(body.site)
    const honeypot = normalizeText(body.honeypot)
    const sourceUrl = normalizeText(body.sourceUrl)
    const sourceTitle = normalizeText(body.sourceTitle)

    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    if (!name || !contact) {
      return NextResponse.json({ error: 'Заполните обязательные поля формы.' }, { status: 400 })
    }

    const mailConfig = getMailConfig()

    if (!mailConfig.resend && mailConfig.smtpCandidates.length === 0) {
      console.error('[lead-email] no transport configured', mailConfig.errors)
      return NextResponse.json(
        {
          error:
            mailConfig.errors[0] ||
            'Форма временно не настроена. Добавьте RESEND_API_KEY или рабочие SMTP-переменные.',
        },
        { status: 503 }
      )
    }

    const referer = request.headers.get('referer') || 'Не определен'
    const replyTo = looksLikeEmail(contact) ? contact : undefined
    const safeName = escapeHtml(name)
    const safeContact = escapeHtml(contact)
    const safeSite = escapeHtml(site || 'Не указан')
    safeSourceUrl = escapeHtml(sourceUrl || referer)
    safeSourceTitle = escapeHtml(sourceTitle || 'Не указана')
    const safeIp = escapeHtml(ip)
    const safeUserAgent = escapeHtml(userAgent)

    const subject = `Новая заявка с сайта: ${name}`
    const text = [
      'Новая заявка с сайта',
      '',
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      `Сайт: ${site || 'Не указан'}`,
      `Страница: ${sourceTitle || 'Не указана'}`,
      `URL страницы: ${sourceUrl || referer}`,
      `Дата: ${currentDate}`,
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
    ].join('\n')

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
        <h2 style="margin:0 0 16px;">Новая заявка с сайта</h2>
        <table style="border-collapse:collapse;width:100%;max-width:720px;">
          <tr><td style="padding:8px 0;font-weight:700;width:180px;">Имя</td><td style="padding:8px 0;">${safeName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">Контакт</td><td style="padding:8px 0;">${safeContact}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">Сайт</td><td style="padding:8px 0;">${safeSite}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">Страница</td><td style="padding:8px 0;">${safeSourceTitle}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">URL страницы</td><td style="padding:8px 0;">${safeSourceUrl}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">Дата</td><td style="padding:8px 0;">${escapeHtml(currentDate)}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">IP</td><td style="padding:8px 0;">${safeIp}</td></tr>
          <tr><td style="padding:8px 0;font-weight:700;">User-Agent</td><td style="padding:8px 0;">${safeUserAgent}</td></tr>
        </table>
      </div>
    `

    const sendResult = await sendLeadMail(mailConfig, {
      replyTo,
      subject,
      text,
      html,
    })

    const leadPayload = { name, contact, site }
    const leadMeta = { ip, sourceUrl: safeSourceUrl, sourceTitle: safeSourceTitle, date: currentDate, userAgent }

    console.info(
      `[lead-email] sent via ${sendResult.transportLabel}; recipient=${
        mailConfig.resend?.to || mailConfig.smtpCandidates[0]?.to || DEFAULT_LEAD_EMAIL
      }; resendKey=${maskSecret(process.env.RESEND_API_KEY || '')}; gmailPass=${maskSecret(
        process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') || ''
      )}`
    )

    await persistLeadLog(leadPayload, leadMeta, 'sent')
    await notifyTelegram({ payload: leadPayload, meta: leadMeta, status: 'sent' })

    return NextResponse.json({ success: true, message: 'Заявка отправлена. Скоро свяжусь с вами.' })
  } catch (error) {
    console.error('Error sending lead email:', error)

    const leadPayload = { name, contact, site }
    const leadMeta = { ip, sourceUrl: safeSourceUrl, sourceTitle: safeSourceTitle, date: currentDate, userAgent }

    await persistLeadLog(leadPayload, leadMeta, 'failed')
    await notifyTelegram({ payload: leadPayload, meta: leadMeta, status: 'failed' })

    return NextResponse.json(
      {
        error: getMailFailureMessage(error),
      },
      { status: 500 }
    )
  }
}
