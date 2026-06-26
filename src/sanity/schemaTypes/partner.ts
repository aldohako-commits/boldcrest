import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { NumberedListItem } from '../components/NumberedListItem'

export const partner = defineType({
  name: 'partner',
  title: 'Partner',
  type: 'document',
  fields: [
    orderRankField({ type: 'partner' }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Link to the client\'s website',
    }),
    defineField({
      name: 'showOn',
      title: 'Show On',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Services Page', value: 'services' },
        ],
        layout: 'grid',
      },
      initialValue: ['homepage', 'services'],
      description: 'Select which pages this client appears on',
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
    select: { title: 'name', media: 'logo', order: 'order', id: '_id', docType: '_type' },
    prepare({ title, media, order, id, docType }) {
      const value = { title, media, order, id, docType }
      return value
    },
  },
  components: { preview: NumberedListItem },
})
