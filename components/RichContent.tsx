import ReactMarkdown from 'react-markdown'
import { demoteHtmlHeadings, isHtmlContent, stripLeadingMarkdownH1 } from '@/lib/content-headings'

type RichContentProps = {
  content?: string | null
  title?: string
  className?: string
}

export default function RichContent({ content, title, className }: RichContentProps) {
  const normalized = content?.trim() || ''

  if (!normalized) {
    return null
  }

  if (isHtmlContent(normalized)) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: demoteHtmlHeadings(normalized) }} />
  }

  const markdown = title ? stripLeadingMarkdownH1(normalized, title) : normalized

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
