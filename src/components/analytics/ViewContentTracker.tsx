'use client'

import { useEffect } from 'react'
import { trackViewContent } from '@/lib/analytics'

/* Fires a ViewContent (Meta) / view_item (GA4) once when a portfolio/case-study
   page mounts — the standard "viewed a piece of content" signal. Rendered by the
   server-side ProjectHero; both analytics calls are no-ops until consent. */
export default function ViewContentTracker({
  name,
  category,
}: {
  name: string
  category?: string
}) {
  useEffect(() => {
    trackViewContent({
      content_name: name,
      content_type: 'project',
      ...(category ? { content_category: category } : {}),
    })
  }, [name, category])

  return null
}
