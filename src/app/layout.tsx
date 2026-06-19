import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LenisProvider from '@/components/LenisProvider'
import PageTransitionProvider from '@/components/PageTransition'
import StartProjectProvider from '@/components/start-project/StartProjectProvider'
import CookieBanner from '@/components/CookieBanner'
import { SanityLive } from '@/sanity/lib/live'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const metropolis = localFont({
  src: [
    { path: '../fonts/Metropolis-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/Metropolis-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/Metropolis-RegularItalic.otf', weight: '400', style: 'italic' },
    { path: '../fonts/Metropolis-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/Metropolis-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../fonts/Metropolis-Bold.otf', weight: '700', style: 'normal' },
    { path: '../fonts/Metropolis-ExtraBold.otf', weight: '800', style: 'normal' },
    { path: '../fonts/Metropolis-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-metropolis',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.boldcrest.com'

// interactive-widget=resizes-content: when the on-screen keyboard opens, iOS
// (16.4+) / Android shrink the LAYOUT viewport to the visible area instead of
// only the visual viewport. Without this, a position:fixed overlay stays
// full-screen-tall while iOS scroll-anchors the focused input, detaching the
// panel and leaving a gap above the keyboard where the page behind bleeds
// through. With resizes-content the panel's 100dvh + the backdrop's inset-0
// resolve to exactly the area above the keyboard, so it sits flush with no gap.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BoldCrest',
    template: '%s — BoldCrest',
  },
  description:
    'We build identities and shape perceptions. Go bold or go unseen.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'BoldCrest',
    title: 'BoldCrest',
    description:
      'We build identities and shape perceptions. Go bold or go unseen.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BoldCrest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoldCrest',
    description:
      'We build identities and shape perceptions. Go bold or go unseen.',
    images: ['/og-image.png'],
  },
  // Full multi-platform icon set (same logic as vercel.com): the .ico carries
  // 16/32 for legacy browsers with sizes="any" so modern browsers prefer the
  // crisp SVG; explicit 16/32 PNGs as extra fallbacks; a 180×180 apple-touch
  // icon for iOS home screens; android/PWA icons via the web manifest; and the
  // Safari pinned-tab mask icon. All files live in /public.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0a0a0a' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#0a0a0a',
  },
  applicationName: 'BoldCrest',
  authors: [{ name: 'BoldCrest', url: siteUrl }],
  creator: 'BoldCrest',
  publisher: 'BoldCrest',
  category: 'Creative Agency',
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://www.boldcrest.com/#organization',
              name: 'BoldCrest',
              url: 'https://www.boldcrest.com',
              email: 'info@boldcrest.com',
              description: 'Creative agency offering brand development, photography, video, animation, and communication. 300+ projects, 30+ brands, 7+ years.',
              address: { '@type': 'PostalAddress', addressLocality: 'Tirana', addressCountry: 'AL' },
              sameAs: ['https://www.instagram.com/boldcrest/', 'https://www.behance.net/boldcrest', 'https://www.linkedin.com/company/boldcrest/', 'https://www.facebook.com/boldcrest', 'https://vimeo.com/boldcrest'],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://www.boldcrest.com/#website',
              name: 'BoldCrest',
              url: 'https://www.boldcrest.com',
              publisher: { '@id': 'https://www.boldcrest.com/#organization' },
              inLanguage: 'en',
            }),
          }}
        />
      </head>
      <body className={metropolis.variable}>
        <LenisProvider>
          <PageTransitionProvider>
            <StartProjectProvider>
              <div className="relative z-[1] bg-bg">
                <Header />
                {children}
              </div>
              <Footer />
            </StartProjectProvider>
          </PageTransitionProvider>
        </LenisProvider>
        <CookieBanner />
        <SanityLive />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
