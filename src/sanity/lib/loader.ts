import { dataset, projectId } from '../env'

export const sanityImageLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  // If already a full Sanity CDN URL, append params
  if (src.includes('cdn.sanity.io')) {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('auto', 'format')
    if (quality) url.searchParams.set('q', String(quality))
    return url.toString()
  }

  // If it's a Sanity image reference (image-xxx-yyy-format)
  const ref = src.replace('image-', '').replace(/-([^-]+)$/, '.$1')
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref}?w=${width}&auto=format${quality ? `&q=${quality}` : ''}`
}
