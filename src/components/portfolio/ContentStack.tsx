'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import VimeoEmbed from '@/components/VimeoEmbed'
import ScrollReveal from '@/components/ScrollReveal'

interface VideoMedia {
  _type: 'videoMedia'
  _key: string
  type: 'video'
  vimeoUrl?: string
}

interface ImageMedia {
  _type: 'imageMedia' | 'image'
  _key: string
  type: 'image'
  asset?: { _ref: string }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  image?: { asset: { _ref: string } }
}

type MediaBlock = VideoMedia | ImageMedia

interface ThumbnailImage {
  asset?: { _ref: string }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

interface ContentStackProps {
  media?: MediaBlock[]
  thumbnail?: ThumbnailImage
  thumbnailVideo?: string
  thumbnailType?: string
}

function getImageRef(img: ImageMedia): string | null {
  if (img.asset?._ref) return img.asset._ref
  if (img.image?.asset?._ref) return img.image.asset._ref
  return null
}

function getImageSource(img: ImageMedia) {
  if (img.asset?._ref) return img
  if (img.image?.asset?._ref) return img.image
  return null
}

function radiusClass(index: number, total: number): string {
  if (total === 1) return 'rounded-2xl'
  if (index === 0) return 'rounded-t-2xl'
  if (index === total - 1) return 'rounded-b-2xl'
  return ''
}

export default function ContentStack({ media, thumbnail, thumbnailVideo, thumbnailType }: ContentStackProps) {
  // Build full list: thumbnail first, then media items
  const items: { type: 'image' | 'video'; key: string; content: React.ReactNode }[] = []

  // Thumbnail as first item
  if (thumbnailType === 'video' && thumbnailVideo) {
    items.push({
      type: 'video',
      key: 'thumb-video',
      content: (
        <VimeoEmbed
          url={thumbnailVideo}
          className="aspect-[16/9] bg-bg-card"
        />
      ),
    })
  } else if (thumbnail?.asset?._ref) {
    items.push({
      type: 'image',
      key: 'thumb-image',
      content: (
        <Image
          loader={sanityImageLoader}
          src={urlFor(thumbnail).width(1800).quality(85).url()}
          alt=""
          width={1800}
          height={1200}
          priority
          className="h-auto w-full"
          sizes="(max-width: 959px) 100vw, 70vw"
        />
      ),
    })
  }

  // Media items
  if (media) {
    for (const block of media) {
      if (block._type === 'videoMedia') {
        const video = block as VideoMedia
        if (!video.vimeoUrl) continue
        items.push({
          type: 'video',
          key: video._key,
          content: (
            <VimeoEmbed
              url={video.vimeoUrl}
              className="aspect-[16/9] bg-bg-card"
            />
          ),
        })
      } else if (block._type === 'imageMedia' || block._type === 'image') {
        const img = block as ImageMedia
        const ref = getImageRef(img)
        if (!ref) continue
        const source = getImageSource(img)!
        items.push({
          type: 'image',
          key: img._key,
          content: (
            <Image
              loader={sanityImageLoader}
              src={urlFor(source).width(1800).quality(85).url()}
              alt=""
              width={1800}
              height={1200}
              loading="lazy"
              className="h-auto w-full"
              sizes="(max-width: 959px) 100vw, 70vw"
            />
          ),
        })
      }
    }
  }

  if (items.length === 0) return null

  const total = items.length

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <ScrollReveal key={item.key}>
          <div className={`relative w-full overflow-hidden bg-bg-card ${radiusClass(i, total)}`}>
            {item.content}
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
