import { FileText, Link2, Share2, Tag, Type } from 'lucide-react'

export default function ToolCardIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case 'link':
      return <Link2 className={className} />
    case 'tag':
      return <Tag className={className} />
    case 'type':
      return <Type className={className} />
    case 'file':
      return <FileText className={className} />
    case 'share':
      return <Share2 className={className} />
    default:
      return <Link2 className={className} />
  }
}
