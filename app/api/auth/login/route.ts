import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Заполните все поля' },
        { status: 400 }
      )
    }

    // Trim whitespace
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      return NextResponse.json(
        { error: 'Заполните все поля' },
        { status: 400 }
      )
    }

    // ALWAYS ensure admin exists with correct password
    const defaultUsername = (process.env.ADMIN_USER || 'admin').trim()
    const defaultPassword = process.env.ADMIN_PASS || 'admin123'
    
    // If user is trying to login as admin, ensure admin exists
    if (trimmedUsername === defaultUsername || trimmedUsername === 'admin') {
      try {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)
        await prisma.admin.upsert({
          where: { username: defaultUsername },
          update: { password: hashedPassword },
          create: {
            username: defaultUsername,
            password: hashedPassword,
          },
        })
        console.log('✅ Admin ensured to exist')
      } catch (adminError) {
        console.error('Error ensuring admin exists:', adminError)
      }
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { username: trimmedUsername }
    })

    if (!admin) {
      console.error(`Admin not found: ${trimmedUsername}`)
      return NextResponse.json(
        { error: `Пользователь "${trimmedUsername}" не найден. Используйте: admin / admin123` },
        { status: 401 }
      )
    }

    // Verify password
    let isValid = false
    try {
      isValid = await bcrypt.compare(trimmedPassword, admin.password)
    } catch (compareError) {
      console.error('Password comparison error:', compareError)
      isValid = false
    }

    // If password doesn't match, but user entered default password, reset it
    if (!isValid && trimmedPassword === defaultPassword && trimmedUsername === defaultUsername) {
      console.log('Password mismatch, resetting admin password...')
      try {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)
        await prisma.admin.update({
          where: { username: defaultUsername },
          data: { password: hashedPassword },
        })
        isValid = await bcrypt.compare(trimmedPassword, hashedPassword)
        console.log('✅ Admin password reset, login should work now')
      } catch (resetError) {
        console.error('Error resetting password:', resetError)
      }
    }

    if (!isValid) {
      console.error('Login failed:', {
        username: trimmedUsername,
        passwordLength: trimmedPassword.length,
        adminExists: !!admin,
        passwordHash: admin?.password?.substring(0, 20) + '...'
      })
      return NextResponse.json(
        { error: 'Неверные учетные данные. Используйте: admin / admin123' },
        { status: 401 }
      )
    }

    await createSession()
    console.log('✅ Login successful for:', trimmedUsername)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error?.message || 'Ошибка при входе. Попробуйте позже.' },
      { status: 500 }
    )
  }
}


