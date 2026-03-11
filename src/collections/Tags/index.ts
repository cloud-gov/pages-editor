import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: getAdminOrSiteUser('tags'),
    delete: getAdminOrSiteUser('tags'),
    read: getAdminOrSiteUser('tags', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('tags'),
  },
  admin: {
    group: 'Global Assets',
    description: 'Tags used to organize and filter content across the site.',
    useAsTitle: 'title',
    hidden: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: false,
    },
    ...slugField(),
    siteField,
  ],
}
