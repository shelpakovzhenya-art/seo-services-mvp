import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    if (!username || !password) {
      console.error('Username or password is empty')
      return false
    }

    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() }
    })

    if (!admin) {
      console.error(`Admin user not found: ${username}`)
      return false
    }

    if (!admin.password) {
      console.error('Admin password is empty in database')
      return false
    }

    const isValid = await bcrypt.compare(password, admin.password)
    
    if (!isValid) {
      console.error('Password comparison failed for user:', username)
    }
    
    return isValid
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

