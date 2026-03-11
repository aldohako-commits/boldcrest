import dynamic from 'next/dynamic'
import { sanityFetch } from '@/sanity/lib/live'
import {
  featuredProjectsQuery,
  allPartnersQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries'

const Hero = dynamic(() => import('@/components/home/Hero'))
const SelectedWorks = dynamic(() => import('@/components/home/SelectedWorks'))
const WeDoSection = dynamic(() => import('@/components/home/WeDoSection'))
const SelectedClients = dynamic(
  () => import('@/components/home/SelectedClients')
)
const ServicesPreview = dynamic(
  () => import('@/components/home/ServicesPreview')
)
const GravityOverlay = dynamic(
  () => import('@/components/GravityOverlay')
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
      <GravityOverlay />
      <Hero />
      <SelectedWorks projects={projects} />
      <WeDoSection />
      <SelectedClients partners={partners} />
      <ServicesPreview />
    </main>
  )
}
