import type { CollectionConfig } from 'payload'
import { getAdminCollectionPreview, getCollectionPreviewUrl } from '@/utilities/previews'
import { categoriesField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { editor } from '@/utilities/editor'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'
import { relatedItems } from '@/fields/relatedItems'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: {
    singular: 'Resource',
    plural: 'Resources',
  },
  admin: {
    group: 'Content Collection',
    description: 'Downloadable or reference materials like guides or reports.',
    defaultColumns: ['title', 'slug', 'updatedAt', 'updatedBy', '_status'],
    meta: {
      title: 'Resources',
      description: 'Resources allow you to categorize and publish resource content and files.',
    },
    livePreview: {
      url: getCollectionPreviewUrl('resources'),
    },
    preview: getAdminCollectionPreview('resources'),
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
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        components: {
          Cell: 'src/components/UpdatedByCellData/',
        },
      }
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
        description: 'Display the in-page navigation sidebar on this resource',
      },
    },
    relatedItems('resources'),
  ],
  hooks: {
    afterChange: [publish],
    beforeChange: [addSite, completeReview, populateUpdatedBy],
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
