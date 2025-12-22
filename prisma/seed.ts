import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = process.env.ADMIN_PASS || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
  await prisma.admin.upsert({
    where: { username: process.env.ADMIN_USER || 'admin' },
    update: { password: hashedPassword },
    create: {
      username: process.env.ADMIN_USER || 'admin',
      password: hashedPassword,
    },
  })

  // Create services
  const services = [
    { name: 'Сбор СЯ', description: 'Сбор и анализ семантического ядра', price: 15000, unit: '₽/проект', order: 1 },
    { name: 'Закупка ссылок', description: 'Покупка качественных ссылок для продвижения', price: 5000, unit: '₽/мес', order: 2 },
    { name: 'Накрутка ПФ факторов', description: 'Улучшение поведенческих факторов', price: 10000, unit: '₽/мес', order: 3 },
    { name: 'Оптимизация метатегов', description: 'Оптимизация title, description, h1', price: 8000, unit: '₽/проект', order: 4 },
    { name: 'Покрытие сайта семантикой', description: 'Создание контента под семантическое ядро', price: 20000, unit: '₽/проект', order: 5 },
    { name: 'Анализ конкурентов', description: 'Глубокий анализ конкурентов и их стратегий', price: 12000, unit: '₽/проект', order: 6 },
    { name: 'Аудит сайта', description: 'Полный технический и SEO аудит', price: 15000, unit: '₽/проект', order: 7 },
    { name: 'Аудит конверсий', description: 'Анализ и оптимизация конверсий', price: 18000, unit: '₽/проект', order: 8 },
    { name: 'Комплексное ведение проекта', description: 'Полное ведение SEO проекта', price: 50000, unit: '₽/мес', order: 9 },
    { name: 'Разовые задачи', description: 'Выполнение разовых SEO задач', price: 5000, unit: '₽/задача', order: 10 },
    { name: 'Написание SEO статей с помощью ИИ', description: 'Создание SEO-оптимизированных статей', price: 3000, unit: '₽/статья', order: 11 },
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
    } else {
      await prisma.service.create({
        data: service,
      })
    }
  }

  // Create pages
  const pages = [
    {
      slug: 'home',
      title: 'SEO Услуги - Помогаю молодым компаниям, сайтам, b2b сегмент',
      description: 'Рост трафика, рост позиций в выдаче поисковых систем. Увеличение конверсий, ответственность, вовлечённость.',
      h1: 'Помогаю молодым компаниям, сайтам, b2b сегмент',
      content: `## Наши услуги

Мы предлагаем полный спектр SEO услуг для вашего бизнеса. Наша команда поможет вам увеличить трафик, улучшить позиции в поисковых системах и повысить конверсии.

### Почему выбирают нас?

- **Опыт и профессионализм** - мы работаем с различными нишами и знаем, как добиться результатов
- **Индивидуальный подход** - каждый проект уникален, мы разрабатываем стратегию под ваши задачи
- **Прозрачность** - регулярные отчеты и понятная аналитика
- **Результаты** - мы фокусируемся на достижении измеримых результатов

Свяжитесь с нами, чтобы обсудить ваш проект!`,
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
  }

  // Create menu items
  const menuItems = [
    { label: 'Главная', url: '/', order: 1 },
    { label: 'Услуги', url: '/services', order: 2 },
    { label: 'Контакты', url: '/contacts', order: 3 },
    { label: 'Кейсы', url: '/cases', order: 4 },
    { label: 'Отзывы', url: '/reviews', order: 5 },
    { label: 'Блог', url: '/blog', order: 6 },
    { label: 'Калькулятор', url: '/calculator', order: 7 },
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
    } else {
      await prisma.menuItem.create({
        data: item,
      })
    }
  }

  // Create site settings
  await prisma.siteSettings.upsert({
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

  // Create sample blog post
  await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-seo-services' },
    update: {},
    create: {
      slug: 'welcome-to-seo-services',
      title: 'Добро пожаловать в SEO Services',
      excerpt: 'Первая статья в нашем блоге о SEO и продвижении сайтов',
      content: `# Добро пожаловать!

Это первая статья в нашем блоге. Здесь мы будем делиться полезными советами по SEO и продвижению сайтов.

## Что такое SEO?

SEO (Search Engine Optimization) - это комплекс мер по оптимизации сайта для поисковых систем.

## Основные направления:

1. Техническая оптимизация
2. Контент-маркетинг
3. Ссылочное продвижение
4. Локальное SEO

Следите за обновлениями!`,
      published: true,
      publishedAt: new Date(),
    },
  })

  // Create sample case
  const existingCase = await prisma.case.findFirst({
    where: { title: 'Пример кейса' }
  })
  
  if (!existingCase) {
    await prisma.case.create({
      data: {
        title: 'Пример кейса',
        description: 'Успешное продвижение интернет-магазина',
        content: 'Детали проекта будут добавлены позже.',
        order: 1,
      },
    })
  }

  // Create sample review
  const existingReview = await prisma.review.findFirst({
    where: { author: 'Иван Иванов' }
  })
  
  if (!existingReview) {
    await prisma.review.create({
      data: {
        author: 'Иван Иванов',
        text: 'Отличная работа! Трафик вырос на 200% за 3 месяца.',
        rating: 5,
        order: 1,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    // Don't exit with error - allow project to continue
    process.exit(0)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

