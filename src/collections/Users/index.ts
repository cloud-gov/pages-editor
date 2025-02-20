import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { admin, adminField } from '@/access/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: admin,
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
      type: 'relationship',
      relationTo: 'sites',
      hasMany: true,
      minRows: 1,
      access: {
        create: adminField,
        read: adminField,
        update: adminField,
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
        { label: 'Bot', value: 'bot' },
      ]
    }
  ],
  timestamps: true,
}
