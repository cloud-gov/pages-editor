import type { CollectionConfig } from 'payload'
import { categoriesField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { editor } from '@/utilities/editor'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'

export const CustomCollectionPages: CollectionConfig = {
  slug: 'custom-collection-pages',
  labels: {
    singular: 'Custom Collection Page',
    plural: 'Custom Collection Pages',
  },
  admin: {
    group: 'Content Collection',
    description: 'Add content pages to your custom collections. All fields are available for maximum flexibility.',
    defaultColumns: ['title', 'collectionConfig', 'slug', 'updatedAt', 'updatedBy', '_status'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('custom-collection-pages'),
    delete: getAdminOrSiteUser('custom-collection-pages'),
    read: getAdminOrSiteUser('custom-collection-pages', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('custom-collection-pages'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    collectionConfig: true,
  },
  fields: [
    {
      name: 'collectionConfig',
      type: 'relationship',
      relationTo: 'custom-collections',
      required: true,
      admin: {
        description: 'Select which custom collection this page belongs to',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Short description or summary of the content',
      },
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'This image will be used as the thumbnail',
      },
    },
    {
      name: 'files',
      label: 'Files',
      type: 'array',
      admin: {
        description: 'Add downloadable files or attachments',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Optional label for the file (e.g., "Download PDF")',
          },
        },
      ],
    },
    ...slugField(),
    {
      name: 'contentDate',
      label: 'Content Date',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Optional date associated with this content',
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
      admin: {
        description: 'Main content body',
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
        description: 'Display the in-page navigation sidebar on this content',
      },
    },
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

