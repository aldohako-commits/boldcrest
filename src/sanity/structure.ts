import type { StructureResolver } from 'sanity/structure'
import { OrderableListWithStatusFilter } from './components/OrderableListWithStatusFilter'

// These types are drag-and-drop orderable in the Studio list (their site order
// follows the list order via `orderRank`). They're presented through a
// Published / Drafts / Both filter bar (OrderableListWithStatusFilter).
const ORDERABLE = ['project', 'teamMember', 'partner', 'diaryPost', 'yearPhoto']

// Types handled explicitly below, so they don't also appear in the catch-all.
const HANDLED = [
  'siteSettings',
  ...ORDERABLE,
  'service',
  'servicesPage',
  'serviceDetailPage',
]

export const structure: StructureResolver = (S) => {
  // A drag-orderable list with a Published / Drafts / Both filter bar on top.
  // "Both" is the default and keeps full drag-to-reorder. Document clicks resolve
  // through the .child() editor; "Create new" lives in the pane ⋯ menu.
  const filterableList = (type: string, title: string) =>
    S.listItem()
      .title(title)
      .id(type)
      .child(
        S.component(OrderableListWithStatusFilter)
          .id(type)
          .title(title)
          .options({ type })
          .menuItems([
            S.menuItem().title('Create new').intent({ type: 'create', params: { type } }),
          ])
          .child((id: string) =>
            S.document()
              .schemaType(type)
              .documentId(String(id).replace(/^drafts\./, '')),
          ),
      )

  return S.list()
    .title('Content')
    .items([
      filterableList('project', 'Project'),
      filterableList('diaryPost', 'Diary Post'),
      // People → Team Members + Year Photo (yearly group photos for the /people strip)
      S.listItem()
        .title('People')
        .id('peopleGroup')
        .child(
          S.list()
            .title('People')
            .items([
              filterableList('teamMember', 'Team Members'),
              filterableList('yearPhoto', 'Year Photo'),
            ]),
        ),
      filterableList('partner', 'Partner'),
      S.divider(),
      // Services: page content (editable copy) + the offerings list.
      S.listItem()
        .title('Services')
        .id('servicesGroup')
        .child(
          S.list()
            .title('Services')
            .items([
              S.listItem()
                .title('Services Page (main)')
                .id('servicesPage')
                .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
              S.divider(),
              S.listItem()
                .title('Brand Development')
                .id('sdpBrand')
                .child(
                  S.document()
                    .schemaType('serviceDetailPage')
                    .documentId('serviceDetailPage-brand-development'),
                ),
              S.listItem()
                .title('Still & Motion')
                .id('sdpStill')
                .child(
                  S.document()
                    .schemaType('serviceDetailPage')
                    .documentId('serviceDetailPage-still-motion'),
                ),
              S.listItem()
                .title('Communication')
                .id('sdpComms')
                .child(
                  S.document()
                    .schemaType('serviceDetailPage')
                    .documentId('serviceDetailPage-communication'),
                ),
            ]),
        ),
      S.divider(),
      // Anything not handled above keeps the default list.
      ...S.documentTypeListItems().filter(
        (listItem) => !HANDLED.includes(listItem.getId() as string),
      ),
    ])
}
