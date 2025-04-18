import type { CollectionConfig } from 'payload'
import { adminOrAnySite } from '@/access/adminOrSite'
import { admin } from '@/access/admin'
import { createSiteBot, createManager, saveInfoToS3 } from './hooks'

export const Sites: CollectionConfig = {
  slug: 'sites',
  access: {
    create: admin,
    delete: admin,
    read: adminOrAnySite,
    update: admin,
  },
  admin: {
    defaultColumns: ['name', 'updatedAt', 'createdAt'],
    useAsTitle: 'name',
    hidden: ({ user }) => !user?.isAdmin
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'initialManagerEmail',
      type: 'email',
      required: true,
      defaultValue: 'placeholder@agency.gov'  // provided for migrations
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
        readOnly: true
      }
    },
    {
      name: 'users',
      type: 'join',
      collection: 'users',
      on: 'sites.site',
    },
  ],
  hooks: {
    afterChange: [createSiteBot, createManager, saveInfoToS3]
  },
  timestamps: true,
}
