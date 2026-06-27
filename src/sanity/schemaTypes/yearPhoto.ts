import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { NumberedListItem } from '../components/NumberedListItem'
import { PublishToggle } from '../components/PublishToggle'

// Yearly team / group photos shown in the auto-scrolling strip on /people.
// Drag-and-drop orderable (the strip follows this order). Upload next year's
// photos here to add them to the carousel.
export const yearPhoto = defineType({
  name: 'yearPhoto',
  title: 'Year Photo',
  type: 'document',
  fields: [
    orderRankField({ type: 'yearPhoto' }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text (SEO)',
          type: 'string',
          description: 'Describe the photo for search engines & screen readers.',
        }),
      ],
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'e.g. 2024 — for your reference; shown as the label in the list.',
    }),
    defineField({
      name: 'order',
      title: 'Order (manual)',
      type: 'number',
      description: 'Drag-and-drop is the live order; this number is a manual reference/backup only.',
    }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { media: 'image', year: 'year', order: 'order', id: '_id', docType: '_type' },
    prepare({ media, year, order, id, docType }) {
      const value = { title: year ? String(year) : 'Year Photo', media, order, id, docType }
      return value
    },
  },
  components: { preview: NumberedListItem, input: PublishToggle },
})
