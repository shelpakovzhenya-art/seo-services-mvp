import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * Emergency endpoint to seed all data (admin, services, menu, etc.)
 * Usage: POST /api/admin/seed-data with body: { secret: "emergency-seed-2024" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    // Simple security check
    if (secret !== 'emergency-seed-2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const results: any = {
      admin: null,
      services: [],
      menuItems: [],
      pages: [],
      settings: null,
    }

    // 1. Create admin
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
    results.admin = { username: admin.username, id: admin.id }

    // 2. Create services
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
      const existing = await prisma.service.findFirst({
        where: { name: service.name }
      })
      
      if (existing) {
        await prisma.service.update({
          where: { id: existing.id },
          data: service,
        })
        results.services.push({ name: service.name, action: 'updated' })
      } else {
        await prisma.service.create({ data: service })
        results.services.push({ name: service.name, action: 'created' })
      }
    }

    // 3. Create menu items
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
    }

    // 4. Create pages
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
      await prisma.page.upsert({
        where: { slug: page.slug },
        update: page,
        create: page,
      })
      results.pages.push({ slug: page.slug, action: 'upserted' })
    }

    // 5. Create site settings
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
    results.settings = { id: settings.id }

    return NextResponse.json({
      success: true,
      message: 'All data seeded successfully',
      results,
      loginCredentials: {
        username: adminUsername,
        password: adminPassword,
      },
    })
  } catch (error: any) {
    console.error('Error seeding data:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to seed data' },
      { status: 500 }
    )
  }
}

