'use client'

interface VimeoEmbedProps {
  url: string
  className?: string
}

function extractVimeoId(url: string): string | null {
  // Handles: vimeo.com/123456, vimeo.com/video/123456, player.vimeo.com/video/123456
  const match = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/)
  return match ? match[1] : null
}

export default function VimeoEmbed({ url, className = '' }: VimeoEmbedProps) {
  const videoId = extractVimeoId(url)

  if (!videoId) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-card text-text-tertiary ${className}`}
      >
        Invalid Vimeo URL
      </div>
    )
  }

  const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        className="absolute inset-0 h-full w-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Vimeo video"
      />
    </div>
  )
}
