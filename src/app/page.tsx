import dynamic from 'next/dynamic'
import { sanityFetch } from '@/sanity/lib/live'
import {
  featuredProjectsQuery,
  allPartnersQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries'

const Hero = dynamic(() => import('@/components/home/Hero'))
const SelectedWorks = dynamic(() => import('@/components/home/SelectedWorks'))
const PartnersMarquee = dynamic(
  () => import('@/components/home/PartnersMarquee')
)
const ServicesPreview = dynamic(
  () => import('@/components/home/ServicesPreview')
)

export default async function Home() {
  const [projectsResult, partnersResult, settingsResult] = await Promise.all([
    sanityFetch({ query: featuredProjectsQuery }),
    sanityFetch({ query: allPartnersQuery }),
    sanityFetch({ query: siteSettingsQuery }),
  ])

  const projects = projectsResult.data ?? []
  const partners = partnersResult.data ?? []
  const settings = settingsResult.data

  return (
    <main>
      <Hero subtitle={settings?.heroSubtitle ?? undefined} />
      <SelectedWorks projects={projects} />
      <PartnersMarquee partners={partners} />
      <ServicesPreview />
    </main>
  )
}
