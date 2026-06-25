'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Site-wide light image protection: blocks the right-click context menu on any
 * <img> (so no "Save image"/"Open image in new tab"). Drag-to-save and the iOS
 * long-press callout are handled by CSS in globals.css. The <img> + alt stay in
 * the DOM, so SEO is untouched. Skipped under /studio so Sanity Studio keeps its
 * native behaviour. Not unbeatable (devtools/network always work) — it just
 * stops casual saving.
 */
export default function ImageGuard() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith('/studio')) return
    const block = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (t && t.tagName === 'IMG') e.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [pathname])

  return null
}
