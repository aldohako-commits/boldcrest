import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.boldcrest.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internal / non-content routes that shouldn't be indexed.
        // /start is intentionally NOT disallowed here: it's excluded via a
        // noindex meta tag (src/app/start/layout.tsx) instead, so Google can
        // crawl it, see the noindex, and actually drop it from the index —
        // disallowing crawl only prevents indexing with content, not
        // indexing altogether (see the "Indexed, though blocked by
        // robots.txt" GSC warning this was causing).
        disallow: [
          '/studio',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
