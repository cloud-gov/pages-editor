import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { slugField } from '@/fields/slug'
import { siteField, updatedByField } from '@/fields/relationships'
import { readyForReviewField } from '@/fields'
import { addSite } from '@/hooks/addSite'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'

export const TagTypes: CollectionConfig = {
  slug: 'tag-types',
  labels: {
    singular: 'Tag Type',
    plural: 'Tag Types',
  },
  admin: {
    group: 'Site Tag Types',
    description:
      'Organize Tags under defined Tag Types.',
    defaultColumns: ['title', 'slug', 'site', 'updatedAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('tag-types'),
    delete: getAdminOrSiteUser('tag-types'),
    read: getAdminOrSiteUser('tag-types', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('tag-types'),
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
        description:
          'The display name for this tag type',
      }
    },
    ...slugField('title', {
      slugOverrides: {
        admin: {
          description:
            'The URL slug for this tag type'
        }
      }
    }),
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      admin: {
        description: "The tag type's description or summary",
      },
    },
    updatedByField,
    readyForReviewField,
    siteField,
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
