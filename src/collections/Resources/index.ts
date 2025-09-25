import type { CollectionConfig } from 'payload'

import { previewWebhook } from '@/utilities/previews'
import { categoriesField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { editor } from '@/utilities/editor'
import { completeReview } from '@/hooks/completeReview'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: {
    singular: 'Resource',
    plural: 'Resources',
  },
  admin: {
    group: 'Content Collection',
    description: 'Downloadable or reference materials like guides and reports.',
    defaultColumns: ['title', '_status', 'reviewReady'],
    meta: {
      title: 'Resources',
      description: 'Resources allow you to categorize and publish resource content and files.',
    },
    livePreview: {
      url: async ({ data, req }) => {
        // site isn't fetched at the necessary depth in `data`
        const site = await req.payload.findByID({
          collection: 'sites',
          id: data.site,
        })
        return `${process.env.PREVIEW_ROOT}-${site.name}.app.cloud.gov/resources/${data.slug}`
      },
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/resources/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('resources'),
    delete: getAdminOrSiteUser('resources'),
    read: getAdminOrSiteUser('resources', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('resources'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      label: 'Resource excerpt',
      maxLength: 300,
      type: 'text',
    },
    {
      name: 'image',
      label: 'This image will be used as the thumbnail for the resource',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'reportFiles',
      label: 'Resource Files',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    ...slugField(),
    {
      name: 'resourceDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    categoriesField,
    siteField,
    {
      name: 'content',
      type: 'richText',
      editor,
    },
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
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
