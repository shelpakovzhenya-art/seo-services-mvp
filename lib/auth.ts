import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return false
    }

    return bcrypt.compare(password, admin.password)
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return false
  }
}

export async function createSession() {
  const cookieStore = await cookies()
  cookieStore.set('admin-auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth')
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const auth = cookieStore.get('admin-auth')
    return auth?.value === 'authenticated'
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

