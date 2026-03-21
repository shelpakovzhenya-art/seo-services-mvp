import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const DEFAULT_LEAD_EMAIL = 'shelpakovzhenya@gmail.com'
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

type LeadPayload = {
  name?: string
  phone?: string
  site?: string
  honeypot?: string
  sourceUrl?: string
  sourceTitle?: string
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

  limit.count++
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

function getMailConfig() {
  const recipient = process.env.LEAD_TO_EMAIL?.trim() || DEFAULT_LEAD_EMAIL
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim()
  const smtpHost = process.env.SMTP_HOST?.trim()
  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const smtpUser = process.env.SMTP_USER?.trim()
  const smtpPass = process.env.SMTP_PASS?.trim()

  if (gmailPass) {
    const gmailUser = process.env.GMAIL_USER?.trim() || recipient

    return {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      user: gmailUser,
      pass: gmailPass,
      from: process.env.SMTP_FROM?.trim() || gmailUser,
      to: recipient,
    }
  }

  if (smtpHost && smtpUser && smtpPass) {
    return {
      host: smtpHost,
      port: Number.isFinite(smtpPort) ? smtpPort : 587,
      secure: Number.isFinite(smtpPort) ? smtpPort === 465 : false,
      user: smtpUser,
      pass: smtpPass,
      from: process.env.SMTP_FROM?.trim() || smtpUser,
      to: recipient,
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429 })
    }

    const body = (await request.json()) as LeadPayload
    const name = normalizeText(body.name)
    const contact = normalizeText(body.phone)
    const site = normalizeText(body.site)
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

    if (!mailConfig) {
      console.error('Lead email is not configured. Add GMAIL_APP_PASSWORD or SMTP_* variables.')
      return NextResponse.json(
        { error: 'Форма временно не настроена. Напишите в Telegram или на почту shelpakovzhenya@gmail.com.' },
        { status: 503 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })

    const currentDate = new Date().toLocaleString('ru-RU', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Europe/Moscow',
    })
    const referer = request.headers.get('referer') || 'Не определён'
    const userAgent = request.headers.get('user-agent') || 'Не определён'
    const replyTo = looksLikeEmail(contact) ? contact : undefined
    const safeName = escapeHtml(name)
    const safeContact = escapeHtml(contact)
    const safeSite = escapeHtml(site || 'Не указан')
    const safeSourceUrl = escapeHtml(sourceUrl || referer)
    const safeSourceTitle = escapeHtml(sourceTitle || 'Не указана')
    const safeIp = escapeHtml(ip)
    const safeUserAgent = escapeHtml(userAgent)

    await transporter.sendMail({
      from: `Shelpakov Digital <${mailConfig.from}>`,
      to: mailConfig.to,
      replyTo,
      subject: `Новая заявка с сайта: ${name}`,
      text: [
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
      ].join('\n'),
      html: `
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
      `,
    })

    return NextResponse.json({ success: true, message: 'Заявка отправлена. Скоро свяжусь с вами.' })
  } catch (error) {
    console.error('Error sending lead email:', error)

    return NextResponse.json(
      { error: 'Не удалось отправить заявку. Попробуйте ещё раз чуть позже.' },
      { status: 500 }
    )
  }
}
