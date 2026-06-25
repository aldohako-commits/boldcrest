/**
 * Server-side helper to read a Vimeo video's native aspect ratio from its public
 * oEmbed endpoint, so portfolio videos render at their true shape (square,
 * portrait, 16:9, …) instead of being forced into — and cropped by — a fixed
 * 16:9 box. Fetched on the server (no CORS) and cached for a week. Returns null
 * on any failure so callers fall back to 16:9.
 */
export function extractVimeoId(url: string): string | null {
  const m = url?.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/)
  return m ? m[1] : null
}

export async function getVimeoAspect(url?: string | null): Promise<number | null> {
  return (await getVimeoMeta(url)).aspect
}

/**
 * Like getVimeoAspect but also returns a poster image (Vimeo thumbnail), used by
 * the "feature player" click-to-play state. One oEmbed call, cached for a week.
 */
export async function getVimeoMeta(
  url?: string | null,
): Promise<{ aspect: number | null; poster: string | null }> {
  if (!url) return { aspect: null, poster: null }
  const id = extractVimeoId(url)
  if (!id) return { aspect: null, poster: null }
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}&width=1280`,
      { next: { revalidate: 604800 } }, // 1 week
    )
    if (!res.ok) return { aspect: null, poster: null }
    const data = (await res.json()) as {
      width?: number
      height?: number
      thumbnail_url?: string
    }
    const w = Number(data.width)
    const h = Number(data.height)
    const aspect = w > 0 && h > 0 ? w / h : null
    return { aspect, poster: data.thumbnail_url || null }
  } catch {
    return { aspect: null, poster: null }
  }
}
