'use client'

import { usePathname } from 'next/navigation'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Public-site tracking only. The Sanity Studio at /studio is an internal admin
 * tool used by the team — running analytics there pollutes Google Analytics /
 * Vercel Analytics with staff sessions, fires the Meta Pixel for nothing, and
 * made the heavy CMS editing routes show up as "slow" in Speed Insights. So we
 * skip ALL tracking on /studio. The public site is unaffected (and the editor
 * loads a touch lighter without four tracking scripts running in it).
 */
export default function SiteAnalytics() {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) return null
  return (
    <>
      <GoogleAnalytics />
      <MetaPixel />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
