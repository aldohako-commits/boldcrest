import { type SchemaTypeDefinition } from 'sanity'

import { project } from './project'
import { service } from './service'
import { teamMember } from './teamMember'
import { partner } from './partner'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, service, teamMember, partner, siteSettings],
}
