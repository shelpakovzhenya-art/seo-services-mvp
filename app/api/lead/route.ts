import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Simple in-memory rate limiting for dev
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 1000 }) // 1 minute window
    return true
  }

  if (limit.count >= 5) { // Max 5 requests per minute
    return false
  }

  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, phone, honeypot } = body

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true }) // Silent fail for bots
    }

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    // Email configuration
    const smtpHost = process.env.SMTP_HOST?.trim()
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER?.trim()
    const smtpPass = process.env.SMTP_PASS?.trim()
    const smtpFrom = process.env.SMTP_FROM?.trim() || 'shelpakovzhenya@gmail.com'

    // If SMTP is not configured, log and return success (don't fail)
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('⚠️  SMTP not configured. Lead data logged:', { name, phone, timestamp: new Date().toISOString() })
      console.warn('📧 To enable email sending, configure SMTP settings in .env file:')
      console.warn('   SMTP_HOST=smtp.gmail.com (or your SMTP server)')
      console.warn('   SMTP_PORT=587')
      console.warn('   SMTP_USER=your-email@gmail.com')
      console.warn('   SMTP_PASS=your-app-password')
      console.warn('   SMTP_FROM=your-email@gmail.com')
      // Still return success to user - data is logged
      return NextResponse.json({ 
        success: true,
        message: 'Ваша заявка принята. Мы свяжемся с вами в ближайшее время.' 
      })
    }

    // Create transporter
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        // Add timeout and connection options
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      })
      
      // Verify connection
      await transporter.verify()

      // Send email
      await transporter.sendMail({
        from: smtpFrom,
        to: 'shelpakovzhenya@gmail.com',
        subject: `Новая заявка с сайта: ${name}`,
        text: `
Новая заявка с сайта

Имя: ${name}
Телефон: ${phone}
Дата: ${new Date().toLocaleString('ru-RU')}
        `,
        html: `
          <h2>Новая заявка с сайта</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        `,
      })

      console.log('✅ Email sent successfully to:', 'shelpakovzhenya@gmail.com')
      return NextResponse.json({ success: true })
    } catch (emailError: any) {
      console.error('❌ Error sending email:', emailError.message)
      console.error('❌ Full error:', emailError)
      // Log the lead data even if email fails
      console.warn('⚠️  Lead data (email failed):', { name, phone, timestamp: new Date().toISOString() })
      console.warn('💡 Check your SMTP settings in .env file')
      // Still return success to user
      return NextResponse.json({ 
        success: true,
        message: 'Ваша заявка принята. Мы свяжемся с вами в ближайшее время.' 
      })
    }
  } catch (error) {
    console.error('Error sending lead email:', error)
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке. Попробуйте позже.' },
      { status: 500 }
    )
  }
}

