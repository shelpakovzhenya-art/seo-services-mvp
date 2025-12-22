'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface RichTextEditorProps {
  content?: string | null
  onChange: (content: string) => void
  placeholder?: string
}

// Dynamically import the editor component with no SSR
const RichTextEditorClient = dynamic(
  () => import('./RichTextEditorClient'),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Загрузка редактора...</p>
      </div>
    ),
  }
)

export default function RichTextEditor(props: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="border rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Загрузка редактора...</p>
      </div>
    )
  }

  return <RichTextEditorClient {...props} />
}
