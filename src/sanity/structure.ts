import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

// These types are drag-and-drop orderable in the Studio list (their site order
// follows the list order via `orderRank`).
const ORDERABLE = ['project', 'teamMember', 'partner', 'diaryPost']

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'project', title: 'Project', S, context }),
      orderableDocumentListDeskItem({ type: 'diaryPost', title: 'Diary Post', S, context }),
      orderableDocumentListDeskItem({ type: 'teamMember', title: 'Team Member', S, context }),
      orderableDocumentListDeskItem({ type: 'partner', title: 'Partner', S, context }),
      S.divider(),
      // Everything else (e.g. Service) keeps the default list.
      ...S.documentTypeListItems().filter(
        (listItem) => !['siteSettings', ...ORDERABLE].includes(listItem.getId() as string),
      ),
    ])
