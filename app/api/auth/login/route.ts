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

    const isValid = await verifyCredentials(trimmedUsername, trimmedPassword)

    if (!isValid) {
      // Log for debugging (remove in production if needed)
      console.error('Login failed for username:', trimmedUsername)
      return NextResponse.json(
        { error: 'Неверные учетные данные. Проверьте логин и пароль.' },
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


