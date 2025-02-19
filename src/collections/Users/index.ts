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
    useAPIKey: true,
    cookies: {
      domain: process.env.COOKIE_DOMAIN
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email'
    },
    {
      name: 'sub', // we have to create this manually or it isn't added to the JWT payload-token
      type: 'text',
      saveToJWT: true,
    },
    {
      name: 'sites',
      type: 'array',
      fields: [{ name: 'site', type: 'text' }],
      saveToJWT: true,
    }
  ],
  timestamps: true,
}
