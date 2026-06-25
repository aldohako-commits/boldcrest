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

/**
 * Parse a manual aspect-ratio override (e.g. "16:9") into a width/height number.
 * Returns null for "auto"/empty/invalid so callers fall back to the Vimeo aspect.
 */
export function parseAspectRatio(value?: string | null): number | null {
  if (!value || value === 'auto' || value === 'custom') return null
  const v = value.trim()
  const ratio = v.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/)
  if (ratio) {
    const w = Number(ratio[1])
    const h = Number(ratio[2])
    return w > 0 && h > 0 ? w / h : null
  }
  // Also accept a single number (e.g. "2.35" → 2.35:1).
  const num = Number(v)
  return Number.isFinite(num) && num > 0 ? num : null
}

export async function getVimeoAspect(url?: string | null): Promise<number | null> {
  if (!url) return null
  const id = extractVimeoId(url)
  if (!id) return null
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`,
      { next: { revalidate: 604800 } }, // 1 week
    )
    if (!res.ok) return null
    const data = (await res.json()) as { width?: number; height?: number }
    const w = Number(data.width)
    const h = Number(data.height)
    if (w > 0 && h > 0) return w / h
    return null
  } catch {
    return null
  }
}
