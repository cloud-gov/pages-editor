import type { CollectionConfig } from 'payload'
import { adminOrAnySite } from '@/access/adminOrSite'
import { admin } from '@/access/admin'
import {
  beforeDeleteHook,
  createManager,
  createSiteBot,
  createSiteSinglePolicies,
  createSiteSinglePages,
  formatSiteSlug,
  saveInfoToS3,
} from './hooks'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    group: 'Site Configuration',
    description: 'Multi-site management',
    defaultColumns: ['name', 'updatedAt', 'createdAt'],
    useAsTitle: 'name',
    hidden: ({ user }) => !user?.isAdmin,
  },
  access: {
    create: admin,
    delete: admin,
    read: adminOrAnySite,
    update: admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'initialManagerEmail',
      type: 'email',
      required: true,
      defaultValue: 'placeholder@agency.gov', // provided for migrations
    },
    {
      name: 'pagesOrg',
      label: 'Pages Organization',
      type: 'text',
    },
    {
      name: 'pagesSiteId',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'orgId',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'bucket',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'users',
      type: 'join',
      collection: 'users',
      on: 'sites.site',
    },
  ],
  hooks: {
    beforeValidate: [formatSiteSlug],
    afterChange: [
      createManager,
      createSiteBot,
      createSiteSinglePolicies,
      createSiteSinglePages,
      saveInfoToS3,
    ],
    beforeDelete: [beforeDeleteHook],
  },
  timestamps: true,
}
