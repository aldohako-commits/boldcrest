import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LenisProvider from '@/components/LenisProvider'
import PageTransitionProvider from '@/components/PageTransition'
import StartProjectProvider from '@/components/start-project/StartProjectProvider'
import CookieBanner from '@/components/CookieBanner'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MetaPixel from '@/components/MetaPixel'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
  // Tab icon — black circle + white crest, with a Safari-specific split:
  //   • icon.svg = black CIRCLE (transparent outside). Chrome/Firefox/Edge use
  //     this and render the disc cleanly — corners show the tab color, no white.
  //   • favicon.ico = FULL-BLEED OPAQUE black SQUARE (16/32/48). iPad/iOS Safari
  //     ignores SVG favicons and uses the .ico; it also paints a white backplate
  //     behind any transparent corners, so the .ico must be opaque to avoid a
  //     white halo. On Safari's dark tab strip the square's edges blend into the
  //     dark, so you see the crest with no white box.
  // apple-touch (iPhone Safari favourites + iOS home screen) stays the rounded
  // square on purpose — that one is intentional and left as-is.
  // ?v busts Safari's sticky favicon cache — bump it whenever the bytes change.
  icons: {
    icon: [
      { url: '/favicon.ico?v=8', sizes: '16x16 32x32 48x48' },
      { url: '/icon.svg?v=8', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico?v=8',
    apple: [{ url: '/apple-touch-icon.png?v=8', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg?v=3', color: '#0a0a0a' }],
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
              // Square brand mark (white shield on solid black) — the image
              // Google uses for the Knowledge Graph entity logo shown in the
              // knowledge panel and address-bar autocomplete. Must be square
              // with a solid background. Dedicated 1000×1000 PNG (larger and
              // higher-quality than the 512 icon Google previously had).
              logo: 'https://www.boldcrest.com/logo-1000.png',
              image: 'https://www.boldcrest.com/logo-1000.png',
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
        <GoogleAnalytics />
        <MetaPixel />
        <SanityLive />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
