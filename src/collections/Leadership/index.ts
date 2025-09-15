import type { CollectionConfig } from 'payload'
import { previewWebhook } from '@/utilities/previews'
import { siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { descriptionField, imageField } from '@/fields'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'

export const Leadership: CollectionConfig<'leadership'> = {
  slug: 'leadership',
  labels: {
    singular: 'Leadership',
    plural: 'Leadership',
  },
  admin: {
    group: 'Collections',
    description: 'Leadership team members',
    defaultColumns: ['title', 'jobTitle', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, req }) => {
        const site = await req.payload.findByID({
          collection: 'sites',
          id: data.site,
        })
        return `${process.env.PREVIEW_ROOT}-${site.name}.app.cloud.gov/leadership/${data.slug}`
      },
    },
    preview: (data) => {
      return `${process.env.PREVIEW_URL}/leadership/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('leadership'),
    delete: getAdminOrSiteUser('leadership'),
    read: getAdminOrSiteUser('leadership', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('leadership'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    jobTitle: true,
    image: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'jobTitle',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    descriptionField,
    imageField,
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Image Alt Text',
      required: true,
      admin: {
        description: 'Alternative text for the image for accessibility',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor,
      label: 'Biography',
      admin: {
        description: 'Detailed biography or description of the leadership member',
      },
    },
    siteField,
    ...slugField(),
  ],
  hooks: {
    afterChange: [previewWebhook, publish],
    beforeChange: [addSite],
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
