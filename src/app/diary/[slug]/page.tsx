import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import {
  diaryPostBySlugQuery,
  allDiaryPostsQuery,
} from '@/sanity/lib/queries'
import DiaryArticle from './DiaryArticle'

export async function generateStaticParams() {
  const posts = await client.fetch(allDiaryPostsQuery)
  return (posts ?? []).map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: post } = await sanityFetch({
    query: diaryPostBySlugQuery,
    params: { slug },
  })

  if (!post) return { title: 'Diary — BoldCrest' }

  return {
    title: `${post.title} — BoldCrest`,
    description: post.excerpt || `${post.title} — from the BoldCrest diary.`,
  }
}

export default async function DiaryPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: post } = await sanityFetch({
    query: diaryPostBySlugQuery,
    params: { slug },
  })

  if (!post) notFound()

  return <DiaryArticle post={post} />
}
