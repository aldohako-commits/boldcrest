import dynamic from 'next/dynamic'
import { sanityFetch } from '@/sanity/lib/live'
import {
  featuredProjectsQuery,
  allPartnersQuery,
  allTeamMembersQuery,
  latestDiaryPostsQuery,
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
const MorphBlobs = dynamic(() => import('@/components/MorphBlobs'))

export default async function Home() {
  const [projectsResult, partnersResult, membersResult, diaryResult, settingsResult] =
    await Promise.all([
      sanityFetch({ query: featuredProjectsQuery }),
      sanityFetch({ query: allPartnersQuery }),
      sanityFetch({ query: allTeamMembersQuery }),
      sanityFetch({ query: latestDiaryPostsQuery }),
      sanityFetch({ query: siteSettingsQuery }),
    ])

  const projects = projectsResult.data ?? []
  const partners = partnersResult.data ?? []
  const members = membersResult.data ?? []
  const diaryPosts = diaryResult.data ?? []
  const settings = settingsResult.data

  return (
    <main className="relative">
      <MorphBlobs />
      <Hero />
      <SelectedWorks projects={projects} />
      <WeDoSection />
      <SelectedClients partners={partners} />
      <ServiceCards />
      <BottomSections members={members} diaryPosts={diaryPosts} />
    </main>
  )
}
