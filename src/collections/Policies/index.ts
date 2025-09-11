import type { CollectionConfig } from 'payload'

import { previewWebhook } from '@/utilities/previews'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser, getAdmin } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { completeReview } from '@/hooks/completeReview'
import { siteField } from '@/fields/relationships'

export const Policies: CollectionConfig<'policies'> = {
  slug: 'policies',
  admin: {
    group: 'Standalone Pages',
    description: 'Policies and procedures',
    defaultColumns: ['title', 'slug', 'reviewReady', 'updatedAt'],
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
  },
  access: {
    create: getAdmin,
    delete: getAdmin,
    read: getAdminOrSiteUser('policies', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('policies'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: '-reviewReady',
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
      name: 'label',
      label: 'Used in navigation',
      type: 'text',
      required: true,
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
