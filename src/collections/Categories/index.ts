import type { CollectionConfig } from 'payload'
import { createParentField, createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: getAdminOrSiteUser('reports'),
    delete: getAdminOrSiteUser('reports'),
    read: getAdminOrSiteUser('reports', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('reports'),
  },
  admin: {
    group: 'Global Assets',
    description: 'Tags or groupings used to organize and filter content across the site.',
    useAsTitle: 'title',
    hidden: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    siteField,
    createParentField(
      'categories',
      {
        admin: {
          // Hide the field from the UI
          disabled: true,
        },
      },
    ),
    createBreadcrumbsField(
      'categories',
      {
        admin: {
          // Hide the field from the UI
          disabled: true,
        },
      },
    ),
  ],
}
