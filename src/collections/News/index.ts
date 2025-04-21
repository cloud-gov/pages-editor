import type { CollectionConfig } from 'payload'

import { previewWebhook } from '@/utilities/previews'
import { slugField } from '@/fields/slug'
import { adminField } from '@/access/admin'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'

export const News: CollectionConfig<'news'> = {
  slug: 'news',
  access: {
    create: getAdminOrSiteUser('news'),
    delete: getAdminOrSiteUser('news'),
    read: getAdminOrSiteUser('news', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('news'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, req }) => {
        // site isn't fetched at the necessary depth in `data`
        const site = await req.payload.findByID({
          collection: 'sites',
          id: data.site
        })
        return `${process.env.PREVIEW_ROOT}-${site.name}.app.cloud.gov/news/${data.slug}`
      },
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/news/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [previewWebhook],
    beforeChange: [addSite]
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  }
}
