'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Vanity subdomains that EMBED a ClickUp form (see src/proxy.ts). Every request
 * on these hosts is rewritten to the form route, so the URL bar keeps showing
 * e.g. branding.boldcrest.com while the served page is /forms/branding.
 */
const FORM_SUBDOMAINS = ['careers', 'branding', 'timeoff', 'employee', 'client']

const CANONICAL = 'https://www.boldcrest.com'

/** True for the on-site form routes (the canonical-host view of an embed). */
export function isFormPath(pathname: string | null | undefined): boolean {
  return pathname === '/careers' || !!pathname?.startsWith('/forms/')
}

/**
 * Detect the embedded-form chrome and provide the correct link base.
 *
 * - `isEmbed` — the page is a ClickUp-form embed (a /careers or /forms/* route,
 *   OR we're on a vanity form subdomain). Used to HIDE the footer.
 * - `linkBase` — prefix for the header/menu links. On a vanity subdomain it must
 *   be the ABSOLUTE canonical site, because the proxy rewrites every relative
 *   path on that host straight back to the form (so a relative `/work` would
 *   never leave the form). On the canonical host (and in local dev) it's empty
 *   so links stay relative and same-origin.
 *
 * Host detection runs post-mount (window only), so the first render — server and
 * client — depends solely on `usePathname`, keeping hydration consistent.
 */
export function useFormEmbed() {
  const pathname = usePathname()
  const [onSubdomain, setOnSubdomain] = useState(false)

  useEffect(() => {
    const host = window.location.hostname.toLowerCase()
    setOnSubdomain(
      host.endsWith('boldcrest.com') &&
        FORM_SUBDOMAINS.includes(host.split('.')[0]),
    )
  }, [])

  return {
    isEmbed: isFormPath(pathname) || onSubdomain,
    linkBase: onSubdomain ? CANONICAL : '',
  }
}
