'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

/* ════════════════════════════════════════════════════
   Google Analytics 4 — consent-gated

   GA4 sets cookies, so it must NOT load until the visitor has actively accepted
   in the cookie banner. This component watches the same consent value the banner
   writes (`boldcrest-cookie-consent` = 'accepted' | 'denied', in a cookie +
   localStorage) and only injects gtag.js once consent === 'accepted'. Before any
   choice, or on 'denied', nothing is loaded and no GA cookie is ever set — fully
   consistent with the banner.

   The banner dispatches a `cookie-consent` event on click (see CookieBanner), so
   accepting loads GA immediately without a page reload. Vercel Analytics
   (cookieless) runs separately and is unaffected.

   The Measurement ID is public (it ships in every page's HTML), so it's safe to
   keep here; NEXT_PUBLIC_GA_ID can override it without a code change.
══════════════════════════════════════════════════════ */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-GBHD74V7QC'
const STORAGE_KEY = 'boldcrest-cookie-consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function readConsent(): 'accepted' | 'denied' | null {
  try {
    const row = document.cookie
      .split('; ')
      .find((r) => r.startsWith(`${STORAGE_KEY}=`))
    const value = row
      ? decodeURIComponent(row.split('=')[1])
      : window.localStorage.getItem(STORAGE_KEY)
    return value === 'accepted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<'accepted' | 'denied' | null>(null)

  useEffect(() => {
    setConsent(readConsent())
    // The banner fires this when the visitor clicks Accept/Deny, so GA can load
    // (or stay out) live, without waiting for a reload.
    const onConsent = (e: Event) => {
      const value = (e as CustomEvent).detail
      if (value === 'accepted' || value === 'denied') setConsent(value)
    }
    window.addEventListener('cookie-consent', onConsent)
    return () => window.removeEventListener('cookie-consent', onConsent)
  }, [])

  // No tag, no cookie, no network call until the visitor has accepted.
  if (consent !== 'accepted') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
