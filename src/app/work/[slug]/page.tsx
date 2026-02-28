import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  projectBySlugQuery,
  nextProjectQuery,
  allProjectsQuery,
} from '@/sanity/lib/queries'
import ProjectHero from '@/components/portfolio/ProjectHero'
import ProjectSidebar from '@/components/portfolio/ProjectSidebar'
import ContentStack from '@/components/portfolio/ContentStack'
import NextProject from '@/components/portfolio/NextProject'

export async function generateStaticParams() {
  const projects = await client.fetch(allProjectsQuery)
  return (projects ?? []).map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
  })

  if (!project) return { title: 'Project — BoldCrest' }

  return {
    title: `${project.name} — BoldCrest`,
    description: project.tagline || `${project.name} project by BoldCrest.`,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
  })

  if (!project) notFound()

  // Fetch next project
  const { data: nextProject } = await sanityFetch({
    query: nextProjectQuery,
    params: { currentOrder: project.order ?? 0 },
  })

  return (
    <main>
      <ProjectHero name={project.name} tagline={project.tagline} />

      {/* Sidebar + Content Grid */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto grid max-w-[var(--max-width)] gap-[var(--space-xl)] max-[959px]:grid-cols-1 min-[960px]:grid-cols-[340px_1fr]">
          <ProjectSidebar
            overview={project.overview}
            client={project.client}
            industry={project.industry}
            year={project.year}
            services={project.services}
          />

          <ContentStack media={project.media} />
        </div>
      </section>

      {/* Next Project CTA */}
      {nextProject && (
        <NextProject name={nextProject.name} slug={nextProject.slug} />
      )}
    </main>
  )
}
