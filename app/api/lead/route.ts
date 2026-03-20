import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Слишком много запросов. Попробуйте позже.' }, { status: 429 })
    }

    const body = await request.json()
    const { name, phone, site, honeypot } = body

    if (honeypot) {
      return NextResponse.json({ success: true })
    }

    if (!name || !phone) {
      return NextResponse.json({ error: 'Заполните обязательные поля формы.' }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST?.trim()
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER?.trim()
    const smtpPass = process.env.SMTP_PASS?.trim()
    const smtpFrom = process.env.SMTP_FROM?.trim() || 'shelpakovzhenya@gmail.com'

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP not configured. Lead data logged:', {
        name,
        phone,
        site,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: 'Ваша заявка принята. Я свяжусь с вами в ближайшее время.',
      })
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })

    await transporter.verify()

    const currentDate = new Date().toLocaleString('ru-RU')

    await transporter.sendMail({
      from: smtpFrom,
      to: 'shelpakovzhenya@gmail.com',
      subject: `Новая заявка с сайта: ${name}`,
      text: `Новая заявка с сайта

Имя: ${name}
Контакт: ${phone}
Сайт: ${site || 'Не указан'}
Дата: ${currentDate}`,
      html: `
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Контакт:</strong> ${phone}</p>
        <p><strong>Сайт:</strong> ${site || 'Не указан'}</p>
        <p><strong>Дата:</strong> ${currentDate}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending lead email:', error)

    return NextResponse.json(
      { error: 'Произошла ошибка при отправке. Попробуйте позже.' },
      { status: 500 }
    )
  }
}
