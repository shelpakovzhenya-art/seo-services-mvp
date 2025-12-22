import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Helper function to convert empty strings to null
    const toNullIfEmpty = (value: any): string | null => {
      if (value === null || value === undefined) return null
      if (typeof value === 'string' && value.trim() === '') return null
      return value
    }
    
    const updateData = {
      workSchedule: toNullIfEmpty(body.workSchedule),
      email: toNullIfEmpty(body.email),
      telegramUrl: toNullIfEmpty(body.telegramUrl),
      vkUrl: toNullIfEmpty(body.vkUrl),
      whatsappUrl: toNullIfEmpty(body.whatsappUrl),
      maxUrl: toNullIfEmpty(body.maxUrl),
      footerText: toNullIfEmpty(body.footerText),
      globalDiscountEnabled: body.globalDiscountEnabled ?? false,
      globalDiscountPercent: typeof body.globalDiscountPercent === 'number' 
        ? body.globalDiscountPercent 
        : (parseFloat(body.globalDiscountPercent) || 0),
      yandexReviewsEmbed: toNullIfEmpty(body.yandexReviewsEmbed),
    }
    
    const settings = await prisma.siteSettings.upsert({
      where: { id: '1' },
      update: updateData,
      create: {
        id: '1',
        ...updateData,
      },
    })

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Error updating settings:', error)
    
    // Provide more detailed error message
    let errorMessage = 'Ошибка при обновлении настроек'
    if (error?.message) {
      errorMessage = `Ошибка: ${error.message}`
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}


