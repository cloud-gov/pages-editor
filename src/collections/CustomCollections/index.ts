import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { addSite } from '@/hooks/addSite'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'

export const CustomCollections: CollectionConfig = {
  slug: 'custom-collections',
  labels: {
    singular: 'Custom Collection',
    plural: 'Custom Collections',
  },
  admin: {
    group: 'Content Collection',
    description: 'Create and manage custom content collections. Each collection can have its own name and URL slug.',
    defaultColumns: ['title', 'slug', 'site', 'updatedAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
    access: {
    create: getAdminOrSiteUser('custom-collections'),
    delete: getAdminOrSiteUser('custom-collections'),
    read: getAdminOrSiteUser('custom-collections', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('custom-collections'),
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
      admin: {
        description: 'The display name for this custom collection (e.g., "Articles", "Resources", "Blog Posts")',
      },
    },
    ...slugField('title', {
      slugOverrides: {
        admin: {
          description: 'The URL slug for this collection (e.g., "articles", "resources"). This will be used in the website URL.',
        },
      },
    }),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description: 'Optional description of what this collection is used for',
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
    siteField,
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
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

