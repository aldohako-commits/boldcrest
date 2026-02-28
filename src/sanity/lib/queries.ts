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
      _type == "imageMedia" => {
        "type": "image",
        image,
        aspectRatio
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
