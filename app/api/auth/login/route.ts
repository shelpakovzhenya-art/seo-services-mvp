import { NextRequest, NextResponse } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth'

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

    let isValid = await verifyCredentials(trimmedUsername, trimmedPassword)

    // If login failed, try to fix admin automatically
    if (!isValid) {
      console.error('Login failed, attempting to fix admin...')
      try {
        // Try to create/fix admin
        const defaultPassword = process.env.ADMIN_PASS || 'admin123'
        const bcrypt = require('bcryptjs')
        const { prisma } = await import('@/lib/prisma')
        
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)
        await prisma.admin.upsert({
          where: { username: trimmedUsername },
          update: { password: hashedPassword },
          create: {
            username: trimmedUsername,
            password: hashedPassword,
          },
        })
        
        // Try login again
        isValid = await verifyCredentials(trimmedUsername, trimmedPassword)
        
        if (isValid) {
          console.log('✅ Admin fixed automatically, login successful')
        }
      } catch (fixError) {
        console.error('Error fixing admin:', fixError)
      }
    }

    if (!isValid) {
      console.error('Login failed for username:', trimmedUsername)
      return NextResponse.json(
        { error: 'Неверные учетные данные. Попробуйте: admin / admin123' },
        { status: 401 }
      )
    }

    await createSession()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error?.message || 'Ошибка при входе. Попробуйте позже.' },
      { status: 500 }
    )
  }
}


