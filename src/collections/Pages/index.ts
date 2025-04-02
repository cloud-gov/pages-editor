import type { CollectionConfig } from 'payload'

import { getAdminOrSiteUser } from '../../access/adminOrSite'

import { lexicalEditor, lexicalHTML, HTMLConverterFeature } from '@payloadcms/richtext-lexical'

import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { previewWebhook } from '@/utilities/previews'
import { adminField } from '@/access/admin'

import { addSite } from '@/hooks/addSite'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: getAdminOrSiteUser('pages'),
    delete: getAdminOrSiteUser('pages'),
    read: getAdminOrSiteUser('pages', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('pages'),
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        return `${process.env.PREVIEW_URL}/${data.slug}`
      },
    },
    preview: (data) => {
      return `${process.env.PREVIEW_URL}/${data.slug}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      access: {
        create: adminField,
        update: adminField,
        read: () => true,
      }
    },
    {
      type: 'richText',
      name: 'content',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // The HTMLConverter Feature is the feature which manages the HTML serializers. If you do not pass any arguments to it, it will use the default serializers.
          HTMLConverterFeature({}),
        ],
      })
    },
    lexicalHTML('content', { name: 'content_html' }),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage, /* previewWebhook */],
    beforeChange: [populatePublishedAt, addSite],
    beforeDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
