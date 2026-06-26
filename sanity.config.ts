'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {createElement} from 'react'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// BoldCrest crest as the workspace icon (replaces the default "D" tile).
const BoldStudioIcon = () =>
  createElement('img', {
    src: '/icon.svg',
    alt: '',
    style: {width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px'},
  })

export default defineConfig({
  basePath: '/studio',
  title: 'BoldStudio',
  icon: BoldStudioIcon,
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
