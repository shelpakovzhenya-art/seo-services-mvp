import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    if (!username || !password) {
      console.error('Username or password is empty')
      return false
    }

    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      console.error('Username or password is empty after trim')
      return false
    }

    const admin = await prisma.admin.findUnique({
      where: { username: trimmedUsername }
    })

    if (!admin) {
      console.error(`Admin user not found: ${trimmedUsername}`)
      // Try to create admin automatically with default password
      try {
        const defaultPassword = process.env.ADMIN_PASS || 'admin123'
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)
        const newAdmin = await prisma.admin.create({
          data: {
            username: trimmedUsername,
            password: hashedPassword,
          },
        })
        console.log(`✅ Admin user created automatically: ${trimmedUsername}`)
        // If user provided password matches default, allow login
        if (trimmedPassword === defaultPassword) {
          return true
        }
        // Otherwise, verify against the hash we just created
        return await bcrypt.compare(trimmedPassword, hashedPassword)
      } catch (createError) {
        console.error('Error creating admin:', createError)
        return false
      }
    }

    if (!admin.password) {
      console.error('Admin password is empty in database')
      return false
    }

    const isValid = await bcrypt.compare(trimmedPassword, admin.password)
    
    if (!isValid) {
      console.error('Password comparison failed for user:', trimmedUsername)
      // Log for debugging (remove in production if needed)
      console.error('Expected password hash starts with:', admin.password.substring(0, 10))
    } else {
      console.log('✅ Password verification successful for user:', trimmedUsername)
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

