import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser, getAdmin } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { siteField } from '@/fields/relationships'
import { completeReview } from '@/hooks/completeReview'
import { getPagePreviewUrl } from '@/utilities/previews'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  admin: {
    group: 'Single Pages',
    description: "Individual pages like About or Contact that aren't part of a content collection.",
    defaultColumns: ['title', 'slug', 'reviewReady', 'updatedAt'],
    livePreview: {
      url: getPagePreviewUrl,
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/${data.path}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('pages', ['manager', 'user']),
    delete: getAdmin,
    read: getAdminOrSiteUser('pages', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('pages'),
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
    ...slugField(),
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
      name: 'sideNavigation',
      type: 'relationship',
      relationTo: 'side-navigation',
      label: 'Side Navigation',
      admin: {
        description: 'Select a side navigation menu to display in the sidebar for this page',
        position: 'sidebar',
      },
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
