import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Страница не найдена</p>
      <Link href="/">
        <Button>Вернуться на главную</Button>
      </Link>
    </div>
  )
}


