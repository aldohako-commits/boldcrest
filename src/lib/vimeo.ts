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
