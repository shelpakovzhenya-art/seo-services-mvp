import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * EMERGENCY FIX ENDPOINT
 * This endpoint fixes admin and seeds all data
 * NO SECRET REQUIRED - but only works in production
 * Usage: GET /api/admin/emergency-fix
 */
export async function GET() {
  try {
    // Only allow in production
    if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
      return NextResponse.json(
        { error: 'This endpoint only works in production' },
        { status: 403 }
      )
    }

    const results: any = {
      admin: null,
      services: [],
      menuItems: [],
      pages: [],
      settings: null,
    }

    // 1. FIX ADMIN - ALWAYS
    const adminUsername = (process.env.ADMIN_USER || 'admin').trim()
    const adminPassword = process.env.ADMIN_PASS || 'admin123'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    const admin = await prisma.admin.upsert({
      where: { username: adminUsername },
      update: { password: hashedPassword },
      create: {
        username: adminUsername,
        password: hashedPassword,
      },
    })
    results.admin = { username: admin.username, id: admin.id, fixed: true }

    // Verify password
    const passwordValid = await bcrypt.compare(adminPassword, admin.password)
    results.admin.passwordValid = passwordValid

    // 2. CREATE ALL SERVICES - ALWAYS
    const services = [
      { name: 'Сбор СЯ', description: 'Сбор и анализ семантического ядра', price: 15000, unit: '₽/проект', order: 1, isActive: true },
      { name: 'Закупка ссылок', description: 'Покупка качественных ссылок для продвижения', price: 5000, unit: '₽/мес', order: 2, isActive: true },
      { name: 'Накрутка ПФ факторов', description: 'Улучшение поведенческих факторов', price: 10000, unit: '₽/мес', order: 3, isActive: true },
      { name: 'Оптимизация метатегов', description: 'Оптимизация title, description, h1', price: 8000, unit: '₽/проект', order: 4, isActive: true },
      { name: 'Покрытие сайта семантикой', description: 'Создание контента под семантическое ядро', price: 20000, unit: '₽/проект', order: 5, isActive: true },
      { name: 'Анализ конкурентов', description: 'Глубокий анализ конкурентов и их стратегий', price: 12000, unit: '₽/проект', order: 6, isActive: true },
      { name: 'Аудит сайта', description: 'Полный технический и SEO аудит', price: 15000, unit: '₽/проект', order: 7, isActive: true },
      { name: 'Аудит конверсий', description: 'Анализ и оптимизация конверсий', price: 18000, unit: '₽/проект', order: 8, isActive: true },
      { name: 'Комплексное ведение проекта', description: 'Полное ведение SEO проекта', price: 50000, unit: '₽/мес', order: 9, isActive: true },
      { name: 'Разовые задачи', description: 'Выполнение разовых SEO задач', price: 5000, unit: '₽/задача', order: 10, isActive: true },
      { name: 'Написание SEO статей с помощью ИИ', description: 'Создание SEO-оптимизированных статей', price: 3000, unit: '₽/статья', order: 11, isActive: true },
    ]

    for (const service of services) {
      try {
        const existing = await prisma.service.findFirst({
          where: { name: service.name }
        })
        
        if (existing) {
          await prisma.service.update({
            where: { id: existing.id },
            data: service,
          })
          results.services.push({ name: service.name, action: 'updated', id: existing.id })
        } else {
          const created = await prisma.service.create({ data: service })
          results.services.push({ name: service.name, action: 'created', id: created.id })
        }
      } catch (error: any) {
        results.services.push({ name: service.name, action: 'error', error: error.message })
      }
    }

    // 3. CREATE MENU ITEMS
    const menuItems = [
      { label: 'Главная', url: '/', order: 1, isActive: true },
      { label: 'Услуги', url: '/services', order: 2, isActive: true },
      { label: 'Контакты', url: '/contacts', order: 3, isActive: true },
      { label: 'Кейсы', url: '/cases', order: 4, isActive: true },
      { label: 'Отзывы', url: '/reviews', order: 5, isActive: true },
      { label: 'Блог', url: '/blog', order: 6, isActive: true },
      { label: 'Калькулятор', url: '/calculator', order: 7, isActive: true },
    ]

    for (const item of menuItems) {
      try {
        const existing = await prisma.menuItem.findFirst({
          where: { url: item.url }
        })
        
        if (existing) {
          await prisma.menuItem.update({
            where: { id: existing.id },
            data: item,
          })
          results.menuItems.push({ label: item.label, action: 'updated' })
        } else {
          await prisma.menuItem.create({ data: item })
          results.menuItems.push({ label: item.label, action: 'created' })
        }
      } catch (error: any) {
        results.menuItems.push({ label: item.label, action: 'error', error: error.message })
      }
    }

    // 4. CREATE PAGES
    const pages = [
      {
        slug: 'home',
        title: 'SEO Услуги - Помогаю молодым компаниям, сайтам, b2b сегмент',
        description: 'Рост трафика, рост позиций в выдаче поисковых систем. Увеличение конверсий, ответственность, вовлечённость.',
        h1: 'Помогаю молодым компаниям, сайтам, b2b сегмент',
        content: '',
      },
      {
        slug: 'services',
        title: 'Услуги - SEO Services',
        description: 'Полный спектр SEO услуг для вашего бизнеса',
        h1: 'Наши услуги',
        content: 'Выберите услуги, которые подходят вашему проекту.',
      },
      {
        slug: 'contacts',
        title: 'Контакты - SEO Services',
        description: 'Свяжитесь с нами для консультации',
        h1: 'Контакты',
        content: 'Мы всегда готовы ответить на ваши вопросы.',
      },
      {
        slug: 'cases',
        title: 'Кейсы - SEO Services',
        description: 'Примеры наших успешных проектов',
        h1: 'Кейсы',
        content: 'Здесь представлены примеры наших работ.',
      },
      {
        slug: 'reviews',
        title: 'Отзывы - SEO Services',
        description: 'Отзывы наших клиентов',
        h1: 'Отзывы',
        content: 'Что говорят о нас наши клиенты.',
      },
      {
        slug: 'calculator',
        title: 'Калькулятор стоимости - SEO Services',
        description: 'Рассчитайте стоимость SEO услуг',
        h1: 'Калькулятор стоимости',
        content: 'Выберите нужные услуги и узнайте стоимость.',
      },
    ]

    for (const page of pages) {
      try {
        await prisma.page.upsert({
          where: { slug: page.slug },
          update: page,
          create: page,
        })
        results.pages.push({ slug: page.slug, action: 'upserted' })
      } catch (error: any) {
        results.pages.push({ slug: page.slug, action: 'error', error: error.message })
      }
    }

    // 5. CREATE SETTINGS
    try {
      const settings = await prisma.siteSettings.upsert({
        where: { id: '1' },
        update: {},
        create: {
          id: '1',
          workSchedule: 'ПН–ПТ 9:00–17:00',
          email: 'shelpakovzhenya@gmail.com',
          footerText: 'Профессиональные SEO услуги для вашего бизнеса',
          globalDiscountEnabled: false,
          globalDiscountPercent: 0,
        },
      })
      results.settings = { id: settings.id, created: true }
    } catch (error: any) {
      results.settings = { error: error.message }
    }

    return NextResponse.json({
      success: true,
      message: '✅ ВСЕ ИСПРАВЛЕНО! Админ создан, все услуги загружены!',
      results,
      loginCredentials: {
        username: adminUsername,
        password: adminPassword,
        loginUrl: '/admin/login',
      },
      nextSteps: [
        '1. Откройте /admin/login',
        `2. Введите логин: ${adminUsername}`,
        `3. Введите пароль: ${adminPassword}`,
        '4. Все услуги уже загружены!',
      ],
    })
  } catch (error: any) {
    console.error('Emergency fix error:', error)
    return NextResponse.json(
      { 
        error: error?.message || 'Failed to fix',
        details: error?.stack,
      },
      { status: 500 }
    )
  }
}

