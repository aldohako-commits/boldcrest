import dynamic from 'next/dynamic'
import { sanityFetch } from '@/sanity/lib/live'
import {
  featuredProjectsQuery,
  allPartnersQuery,
  allTeamMembersQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries'

const Hero = dynamic(() => import('@/components/home/Hero'))
const SelectedWorks = dynamic(() => import('@/components/home/SelectedWorks'))
const WeDoSection = dynamic(() => import('@/components/home/WeDoSection'))
const SelectedClients = dynamic(
  () => import('@/components/home/SelectedClients')
)
const ServiceCards = dynamic(
  () => import('@/components/home/ServiceCards')
)
const BottomSections = dynamic(
  () => import('@/components/home/BottomSections')
)

export default async function Home() {
  const [projectsResult, partnersResult, membersResult, settingsResult] =
    await Promise.all([
      sanityFetch({ query: featuredProjectsQuery }),
      sanityFetch({ query: allPartnersQuery }),
      sanityFetch({ query: allTeamMembersQuery }),
      sanityFetch({ query: siteSettingsQuery }),
    ])

  const projects = projectsResult.data ?? []
  const partners = partnersResult.data ?? []
  const members = membersResult.data ?? []
  const settings = settingsResult.data

  return (
    <main>
      <Hero />
      <SelectedWorks projects={projects} />
      <WeDoSection />
      <SelectedClients partners={partners} />
      <ServiceCards />
      <BottomSections members={members} />
    </main>
  )
}
