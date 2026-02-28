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
  _type: 'imageMedia'
  _key: string
  type: 'image'
  image?: {
    asset: { _ref: string }
  }
  aspectRatio?: '4:3' | '16:9' | '21:9'
}

type MediaBlock = VideoMedia | ImageMedia

interface ContentStackProps {
  media?: MediaBlock[]
}

function getAspectClass(ratio?: string): string {
  switch (ratio) {
    case '4:3':
      return 'aspect-[4/3]'
    case '21:9':
      return 'aspect-[21/9]'
    case '16:9':
    default:
      return 'aspect-[16/9]'
  }
}

function getDimensions(ratio?: string): { width: number; height: number } {
  switch (ratio) {
    case '4:3':
      return { width: 1200, height: 900 }
    case '21:9':
      return { width: 1400, height: 600 }
    case '16:9':
    default:
      return { width: 1400, height: 788 }
  }
}

export default function ContentStack({ media }: ContentStackProps) {
  if (!media || media.length === 0) return null

  // Group consecutive images for potential two-up rows
  const blocks: (MediaBlock | MediaBlock[])[] = []
  let i = 0

  while (i < media.length) {
    const current = media[i]

    // Check if we can create a two-up row (two consecutive images with 4:3 ratio)
    if (
      current._type === 'imageMedia' &&
      i + 1 < media.length &&
      media[i + 1]._type === 'imageMedia'
    ) {
      const next = media[i + 1] as ImageMedia
      const curr = current as ImageMedia
      // Two-up if both are 4:3
      if (curr.aspectRatio === '4:3' && next.aspectRatio === '4:3') {
        blocks.push([curr, next])
        i += 2
        continue
      }
    }

    blocks.push(current)
    i++
  }

  return (
    <div className="flex flex-col gap-[var(--space-md)]">
      {blocks.map((block, idx) => {
        // Two-up image row
        if (Array.isArray(block)) {
          return (
            <ScrollReveal key={`row-${idx}`}>
              <div className="grid grid-cols-2 gap-[var(--space-md)]">
                {block.map((img) => {
                  const imgMedia = img as ImageMedia
                  if (!imgMedia.image?.asset) return null
                  const dims = getDimensions(imgMedia.aspectRatio)
                  return (
                    <div
                      key={imgMedia._key}
                      className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-bg-card ${getAspectClass(imgMedia.aspectRatio)}`}
                    >
                      <Image
                        loader={sanityImageLoader}
                        src={urlFor(imgMedia.image)
                          .width(dims.width)
                          .height(dims.height)
                          .url()}
                        alt=""
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="(max-width: 959px) 50vw, 35vw"
                      />
                    </div>
                  )
                })}
              </div>
            </ScrollReveal>
          )
        }

        // Single video block
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

        // Single image block
        if (block._type === 'imageMedia') {
          const img = block as ImageMedia
          if (!img.image?.asset) return null
          const dims = getDimensions(img.aspectRatio)
          return (
            <ScrollReveal key={img._key}>
              <div
                className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-bg-card ${getAspectClass(img.aspectRatio)}`}
              >
                <Image
                  loader={sanityImageLoader}
                  src={urlFor(img.image)
                    .width(dims.width)
                    .height(dims.height)
                    .url()}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover"
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
