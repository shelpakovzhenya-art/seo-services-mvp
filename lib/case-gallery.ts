export type CaseGalleryImage = {
  src: string
  caption?: string
}

export function parseCaseGallery(value?: string | null): CaseGalleryImage[] {
  return (value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [src, ...captionParts] = item.split('|')
      const caption = captionParts.join('|').trim()

      return {
        src: src.trim(),
        caption: caption || undefined,
      }
    })
    .filter((item) => item.src)
}

export function serializeCaseGallery(images: CaseGalleryImage[]): string {
  return images
    .map((image) => (image.caption ? `${image.src} | ${image.caption}` : image.src))
    .join('\n')
}
