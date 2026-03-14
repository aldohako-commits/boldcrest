import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { allServicesByCategoryQuery } from '@/sanity/lib/queries'
import ServicesPageClient from './ServicesPageClient'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'What gets us out of bed. Brand development, still & motion, and communications — three disciplines, one obsession.',
  openGraph: {
    title: 'Services — BoldCrest',
    description:
      'What gets us out of bed. Brand development, still & motion, and communications — three disciplines, one obsession.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

interface Service {
  _id: string
  name: string
  slug: { current: string }
  category: string
  order: number
}

export default async function ServicesPage() {
  const { data: services } = await sanityFetch({
    query: allServicesByCategoryQuery,
  })

  const categories = ['Brand Dev', 'Still & Motion', 'Communications']
  const grouped = categories.map((cat) => ({
    category: cat,
    services: ((services as Service[]) ?? []).filter(
      (s) => s.category === cat
    ),
  }))

  return <ServicesPageClient categories={grouped} />
}
