export function stripLeadingMarkdownH1(markdown: string | null | undefined, title: string) {
  if (!markdown) {
    return ''
  }

  const normalizedTitle = title.trim().toLowerCase()
  const lines = markdown.split('\n')

  if (lines.length === 0) {
    return markdown
  }

  const firstNonEmptyIndex = lines.findIndex((line) => line.trim().length > 0)
  if (firstNonEmptyIndex === -1) {
    return markdown
  }

  const firstLine = lines[firstNonEmptyIndex].trim()
  if (firstLine.startsWith('# ')) {
    const heading = firstLine.replace(/^#\s+/, '').trim().toLowerCase()
    if (heading === normalizedTitle) {
      lines.splice(firstNonEmptyIndex, 1)
      while (lines[firstNonEmptyIndex] !== undefined && lines[firstNonEmptyIndex].trim() === '') {
        lines.splice(firstNonEmptyIndex, 1)
      }
      return lines.join('\n')
    }
  }

  return markdown
}

export function isHtmlContent(content: string | null | undefined) {
  if (!content) {
    return false
  }

  return /<\/?[a-z][\s\S]*>/i.test(content)
}

export function demoteHtmlHeadings(html: string | null | undefined) {
  if (!html) {
    return ''
  }

  return html
    .replace(/<h1(\b[^>]*)>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')
    .replace(/<h2(\b[^>]*)>/gi, '<h3$1>')
    .replace(/<\/h2>/gi, '</h3>')
    .replace(/<h3(\b[^>]*)>/gi, '<h4$1>')
    .replace(/<\/h3>/gi, '</h4>')
}
