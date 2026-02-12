import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { siteField, updatedByField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'

export const CollectionTypes: CollectionConfig = {
  slug: 'collection-types',
  labels: {
    singular: 'Collection Types',
    plural: 'Collection Types',
  },
  admin: {
    group: 'Your Site Content Collections',
    description: 'Create and manage content collection types. Each collection type can have its own name and URL slug.',
    defaultColumns: ['title', 'slug', 'site', 'updatedAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
    access: {
    create: getAdminOrSiteUser('collection-types'),
    delete: getAdminOrSiteUser('collection-types'),
    read: getAdminOrSiteUser('collection-types', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('collection-types'),
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
        description: 'The display name for this collection type (e.g., "Articles", "Resources", "Blog Posts")',
      },
    },
    ...slugField('title', {
      slugOverrides: {
        admin: {
          description: 'The URL slug for this collection type (e.g., "articles", "resources"). This will be used in the website URL.',
        },
      },
    }),
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      admin: {
        description: 'The collection type\'s description or summary',
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
    updatedByField,
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

