import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Vanity subdomains that EMBED a ClickUp form inside the BoldCrest site.
 *
 * Each host points at this Vercel project; instead of redirecting to the bare
 * ClickUp page we REWRITE (URL stays on the subdomain) to an on-site route that
 * renders the form in an iframe with the site header/footer. These are
 * single-purpose hosts, so EVERY request on them is rewritten to the form.
 *
 * Form URLs live with the page: careers in `app/careers`, the rest in
 * `app/forms/forms.config.ts` (served at /forms/<slug>). Rewrites run before the
 * coming-soon gate (these aren't canonical hosts), so the forms work pre-launch.
 */
const SUBDOMAIN_EMBEDS: Record<string, string> = {
  'careers.boldcrest.com': '/careers',
  'branding.boldcrest.com': '/forms/branding',
  'timeoff.boldcrest.com': '/forms/timeoff',
  'employee.boldcrest.com': '/forms/employee',
  'client.boldcrest.com': '/forms/client',
}

/**
 * Vanity subdomains that 307-redirect to an EXTERNAL destination (Synology).
 *
 * 307 (temporary) is used on purpose so the targets can change later without
 * browsers caching the old destination. Switch to 308 if a target is permanent.
 */
const SUBDOMAIN_REDIRECTS: Record<string, string> = {
  'drive.boldcrest.com': 'https://boldarchive.cz1.quickconnect.to/?launchApp=SYNO.SDS.Drive.Application',
  'archive.boldcrest.com': 'http://quickconnect.to/BoldArchive',
}

/**
 * Alternate brand domains → the canonical site (308 PERMANENT, so search engines
 * consolidate them onto boldcrest.com). Both the apex and the www host of each
 * domain are covered. We send them straight to the canonical www host to avoid a
 * double hop through the apex→www redirect.
 */
const CANONICAL_SITE = 'https://www.boldcrest.com'
const DOMAIN_REDIRECTS = new Set([
  'boldreactor.com',
  'www.boldreactor.com',
  'boldworkshops.com',
  'www.boldworkshops.com',
])

/**
 * Coming-soon holding page.
 *
 * While the site is still being finished we don't want the live domain to show
 * the real website. When COMING_SOON is true, any request to the canonical host
 * is rewritten to /coming-soon (URL stays the same, holding page is served).
 *
 * This ONLY affects the real domain — the boldcrest-puce.vercel.app preview URL
 * is not in CANONICAL_HOSTS, so the full site stays visible there for ongoing
 * work. Studio and API routes are let through so the CMS keeps working.
 *
 * TO GO LIVE: flip COMING_SOON to false and redeploy. That's the only change.
 */
const COMING_SOON = false
const CANONICAL_HOSTS = new Set(['boldcrest.com', 'www.boldcrest.com'])

export function proxy(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').toLowerCase().split(':')[0]

  const embedPath = SUBDOMAIN_EMBEDS[host]
  if (embedPath) {
    const url = req.nextUrl.clone()
    url.pathname = embedPath
    return NextResponse.rewrite(url)
  }

  const destination = SUBDOMAIN_REDIRECTS[host]
  if (destination) {
    return NextResponse.redirect(destination, 307)
  }

  if (DOMAIN_REDIRECTS.has(host)) {
    return NextResponse.redirect(CANONICAL_SITE, 308)
  }

  if (COMING_SOON && CANONICAL_HOSTS.has(host)) {
    const { pathname } = req.nextUrl
    const isAllowed =
      pathname === '/coming-soon' ||
      pathname.startsWith('/studio') ||
      pathname.startsWith('/api')
    if (!isAllowed) {
      const url = req.nextUrl.clone()
      url.pathname = '/coming-soon'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Run on page requests but skip Next internals and static assets.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|ico|txt|xml|webmanifest|woff2?|ttf|otf)$).*)',
  ],
}
