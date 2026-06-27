import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { NumberedListItem } from '../components/NumberedListItem'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    orderRankField({ type: 'teamMember' }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
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
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
      order: 'order',
      id: '_id',
      docType: '_type',
    },
    prepare({ title, subtitle, media, order, id, docType }) {
      const value = { title, subtitle, media, order, id, docType }
      return value
    },
  },
  components: { preview: NumberedListItem },
})
