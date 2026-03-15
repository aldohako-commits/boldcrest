import type { Metadata } from 'next'
import StartProjectClient from './StartProjectClient'

export const metadata: Metadata = {
  title: 'Start a New Project',
  description:
    "Let's work together. Tell us about your project and we'll get back to you shortly.",
  openGraph: {
    title: 'Start a New Project — BoldCrest',
    description:
      "Let's work together. Tell us about your project and we'll get back to you shortly.",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function StartProjectPage() {
  return <StartProjectClient />
}
