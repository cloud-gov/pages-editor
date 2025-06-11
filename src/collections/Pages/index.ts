import type { CollectionConfig } from 'payload'

import { previewWebhook } from '@/utilities/previews'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser, getAdmin } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { siteField } from '@/fields/relationships'
import { completeReview } from '@/hooks/completeReview'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: getAdmin,
    delete: getAdmin,
    read: getAdminOrSiteUser('pages', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('pages'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: '-reviewReady',
  admin: {
    defaultColumns: ['title', 'slug', 'reviewReady', 'updatedAt'],
    description: 'Manage single pages that are shown in the site.',
    livePreview: {
      url: async ({ data, req }) => {
        // site isn't fetched at the necessary depth in `data`
        const site = await req.payload.findByID({
          collection: 'sites',
          id: data.site,
        })
        return `${process.env.PREVIEW_ROOT}-${site.name}.app.cloud.gov/${data.path}`
      },
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/${data.path}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
    group: 'Individual Pages',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      access: {
        read: () => true,
        update: getAdmin,
      },
    },
    ...slugField(),
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'label',
      label: 'Used in navigation',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      editor,
    },
    siteField,
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
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
  ],
  hooks: {
    afterChange: [previewWebhook, publish],
    beforeChange: [addSite, completeReview],
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
