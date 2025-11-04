import type { CollectionConfig } from 'payload'
import { categoriesField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { editor } from '@/utilities/editor'
import { getCollectionPreviewUrl } from '@/utilities/previews'
import { completeReview } from '@/hooks/completeReview'

export const Reports: CollectionConfig = {
  slug: 'reports',
  labels: {
    singular: 'Report',
    plural: 'Reports',
  },
  admin: {
    group: 'Content Collection',
    description: 'Downloadable or reference materials like guides and reports.',
    defaultColumns: ['title', '_status', 'reviewReady'],
    meta: {
      title: 'Reports',
      description: 'Reports allow you to categorize and publish report content and files.',
    },
    livePreview: {
      url: getCollectionPreviewUrl('reports'),
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/reports/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('reports'),
    delete: getAdminOrSiteUser('reports'),
    read: getAdminOrSiteUser('reports', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('reports'),
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
      label: 'Report excerpt',
      maxLength: 300,
      type: 'text',
    },
    {
      name: 'image',
      label: 'This image will be used as the thumbnail for the report',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'reportFiles',
      label: 'Report Files',
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
      name: 'reportDate',
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
    {
      name: 'showInPageNav',
      label: 'Show In-Page Navigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Display the in-page navigation sidebar on this report',
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
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
