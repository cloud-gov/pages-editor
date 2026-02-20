import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { categoriesField, siteField } from '@/fields/relationships'
import { descriptionField, imageField } from '@/fields'
import { completeReview } from '@/hooks/completeReview'
import { getAdminCollectionPreview, getCollectionPreviewUrl } from '@/utilities/previews'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'
import { relatedItems } from '@/fields/relatedItems'

export const News: CollectionConfig<'news'> = {
  slug: 'news',
  admin: {
    group: 'Content Collection',
    description: 'Announcements, updates, or press releases related to the organization.',
    defaultColumns: ['title', 'slug', 'updatedAt', 'updatedBy', '_status'],
    livePreview: {
      url: getCollectionPreviewUrl('news'),
    },
    preview: getAdminCollectionPreview('news'),
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
    ...slugField(),
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
    {
      name: 'showInPageNav',
      label: 'Show In-Page Navigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Display the in-page navigation sidebar on this news item',
      },
    },
    relatedItems('news'),
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [publish],
    beforeChange: [addSite, completeReview, populateUpdatedBy],
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
