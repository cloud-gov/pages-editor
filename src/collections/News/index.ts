import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { categoriesField, siteField } from '@/fields/relationships'
import { descriptionField, imageField } from '@/fields'
import { completeReview } from '@/hooks/completeReview'
import { getCollectionPreviewUrl } from '@/utilities/previews'

export const News: CollectionConfig<'news'> = {
  slug: 'news',
  admin: {
    group: 'Content Collection',
    description: 'Announcements, updates, or press releases related to the organization.',
    defaultColumns: ['title', 'reviewReady', 'updatedAt'],
    livePreview: {
      url: getCollectionPreviewUrl('news'),
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/news/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
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
  defaultSort: '-reviewReady',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    descriptionField,
    imageField,
    categoriesField,
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
    ...slugField(),
  ],
  hooks: {
    afterChange: [publish],
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
