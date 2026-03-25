import { defineQuery } from 'next-sanity'

export const featuredProjectsQuery = defineQuery(
  `*[_type == "project"] | order(order asc) [0...6] {
    _id,
    name,
    slug,
    tagline,
    client,
    industry,
    year,
    services,
    thumbnailType,
    thumbnail,
    thumbnailVideo,
    "firstMediaType": media[0]._type
  }`
)

export const allProjectsQuery = defineQuery(
  `*[_type == "project"] | order(order asc) {
    _id,
    name,
    slug,
    tagline,
    client,
    industry,
    year,
    services,
    thumbnailType,
    thumbnail,
    thumbnailVideo,
    "firstMediaType": media[0]._type
  }`
)

export const projectBySlugQuery = defineQuery(
  `*[_type == "project" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    tagline,
    client,
    industry,
    year,
    services,
    overview,
    thumbnailType,
    thumbnail,
    thumbnailVideo,
    order,
    media[] {
      _type,
      _key,
      _type == "videoMedia" => {
        "type": "video",
        vimeoUrl
      },
      _type == "image" => {
        "type": "image",
        asset,
        hotspot,
        crop
      },
      _type == "imageMedia" => {
        "type": "image",
        "asset": coalesce(asset, image.asset),
        "hotspot": coalesce(hotspot, image.hotspot),
        "crop": coalesce(crop, image.crop)
      }
    }
  }`
)

export const nextProjectQuery = defineQuery(
  `*[_type == "project" && order > $currentOrder] | order(order asc) [0] {
    _id,
    name,
    slug
  }`
)

export const allServicesByCategoryQuery = defineQuery(
  `*[_type == "service"] | order(order asc) {
    _id,
    name,
    slug,
    category,
    order
  }`
)

export const allPartnersQuery = defineQuery(
  `*[_type == "partner"] | order(order asc) {
    _id,
    name,
    logo
  }`
)

export const allTeamMembersQuery = defineQuery(
  `*[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    image
  }`
)

export const latestDiaryPostsQuery = defineQuery(
  `*[_type == "diaryPost"] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    excerpt,
    category,
    coverImage,
    publishedAt
  }`
)

export const allDiaryPostsQuery = defineQuery(
  `*[_type == "diaryPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category,
    coverImage,
    publishedAt
  }`
)

export const siteSettingsQuery = defineQuery(
  `*[_type == "siteSettings"][0] {
    heroSubtitle,
    footerBigText,
    contactEmail,
    socialLinks[] {
      platform,
      url
    }
  }`
)
