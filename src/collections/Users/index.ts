import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email', 'id', 'updatedAt', 'createdAt'],
    useAsTitle: 'name',
    hidden: false,
  },
  auth: {
    disableLocalStrategy: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
