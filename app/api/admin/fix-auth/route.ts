import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * Emergency endpoint to fix admin credentials
 * This can be called directly to reset admin password
 * Usage: POST /api/admin/fix-auth with body: { secret: "emergency-fix-2024" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    // Simple security check - you can change this secret
    if (secret !== 'emergency-fix-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const username = process.env.ADMIN_USER || 'admin'
    const password = process.env.ADMIN_PASS || 'admin123'

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create or update admin
    const admin = await prisma.admin.upsert({
      where: { username },
      update: {
        password: hashedPassword,
      },
      create: {
        username,
        password: hashedPassword,
      },
    })

    // Verify password works
    const isValid = await bcrypt.compare(password, admin.password)

    return NextResponse.json({
      success: true,
      message: 'Admin credentials fixed',
      username: admin.username,
      passwordVerified: isValid,
      loginCredentials: {
        username,
        password,
      },
    })
  } catch (error: any) {
    console.error('Error fixing admin:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fix admin' },
      { status: 500 }
    )
  }
}

