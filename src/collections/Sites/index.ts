import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Sites: CollectionConfig = {
  slug: 'sites',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['id', 'updatedAt', 'createdAt'],
    useAsTitle: 'name',
    hidden: false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
