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
  // Tab icon: a single multi-size .ico (16/32/48), exactly like apple.com and
  // vercel.com. Deliberately NO svg favicon link — Safari's SVG-favicon support
  // is unreliable and, when it picks the svg <link> and fails to render it, it
  // shows a blank white square instead of falling back to the .ico. The .ico is
  // a transparent-cornered black circle so it reads as a clean badge in the tab.
  // apple-touch (iOS), web manifest (Android/PWA) and the Safari pinned-tab mask
  // round out the other platforms.
  // The ?v=2 query busts Safari's notoriously sticky favicon cache: changing the
  // icon URL makes browsers fetch the new circular icon instead of reusing the
  // stale square one they cached from earlier. Bump this if the icon changes.
  icons: {
    icon: { url: '/favicon.ico?v=2', sizes: '16x16 32x32 48x48' },
    shortcut: '/favicon.ico?v=2',
    apple: [{ url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg?v=2', color: '#0a0a0a' }],
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
