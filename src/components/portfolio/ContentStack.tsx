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
  // Legacy support for old imageMedia objects
  image?: { asset: { _ref: string } }
}

type MediaBlock = VideoMedia | ImageMedia

interface ContentStackProps {
  media?: MediaBlock[]
}

function getImageRef(img: ImageMedia): string | null {
  // New structure: asset directly on the image
  if (img.asset?._ref) return img.asset._ref
  // Legacy structure: nested image.asset
  if (img.image?.asset?._ref) return img.image.asset._ref
  return null
}

function getImageSource(img: ImageMedia) {
  if (img.asset?._ref) return img
  if (img.image?.asset?._ref) return img.image
  return null
}

export default function ContentStack({ media }: ContentStackProps) {
  if (!media || media.length === 0) return null

  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      {media.map((block) => {
        // Video block
        if (block._type === 'videoMedia') {
          const video = block as VideoMedia
          if (!video.vimeoUrl) return null
          return (
            <ScrollReveal key={video._key}>
              <VimeoEmbed
                url={video.vimeoUrl}
                className="aspect-[16/9] rounded-[var(--radius-lg)] bg-bg-card"
              />
            </ScrollReveal>
          )
        }

        // Image block — natural aspect ratio (new 'image' type + legacy 'imageMedia')
        if (block._type === 'imageMedia' || block._type === 'image') {
          const img = block as ImageMedia
          const ref = getImageRef(img)
          if (!ref) return null
          const source = getImageSource(img)!
          return (
            <ScrollReveal key={img._key}>
              <div className="relative w-full overflow-hidden rounded-[var(--radius-lg)] bg-bg-card">
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
              </div>
            </ScrollReveal>
          )
        }

        return null
      })}
    </div>
  )
}
