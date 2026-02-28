import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LenisProvider from '@/components/LenisProvider'
import LoadingScreen from '@/components/LoadingScreen'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boldcrest.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BoldCrest — Creative Agency',
    template: '%s — BoldCrest',
  },
  description:
    'We build identities and shape perceptions. Go bold or go unseen.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'BoldCrest',
    title: 'BoldCrest — Creative Agency',
    description:
      'We build identities and shape perceptions. Go bold or go unseen.',
    url: siteUrl,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BoldCrest — Creative Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoldCrest — Creative Agency',
    description:
      'We build identities and shape perceptions. Go bold or go unseen.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <LenisProvider>
          <LoadingScreen />
          <div className="relative z-[1] bg-bg">
            <Header />
            {children}
          </div>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
