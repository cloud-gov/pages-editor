import { admin, adminField } from '@/access/admin'
import { adminOrSiteUser, adminOrSiteUserUserCollection } from '@/access/adminOrSite'
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig, User } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const roles = ['manager', 'user', 'bot'] as const

const capitalize = (str: string) => {
  return `${str[0].toLocaleUpperCase()}${str.slice(1)}`
}

const userEmail: CollectionAfterChangeHook<User> = async ({
  doc, req: { payload }, operation
}) => {
  if (operation === 'create') {
    // email the user
    // payload.sendEmail
  }
  return doc
}

const addSub: CollectionBeforeChangeHook<User> = async ({
  data, req: { payload }, operation
}) => {
  if (operation === 'create') {
    data.sub = uuidv4()
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: adminOrSiteUserUserCollection,
    update: admin, // TODO: update to admin/sitemanager
    delete: admin, // TODO: update to admin/sitemanager
    create: admin, // TODO: update to admin/sitemanager
  },
  admin: {
    defaultColumns: ['email', 'updatedAt', 'siteRoles'],
    useAsTitle: 'email',
    hidden: false,
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
    tokenExpiration: 86400, // one day
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      secure: !process.env.ORIGIN?.includes('http://localhost')
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'sub', // we have to create this manually or it isn't added to the JWT payload-token
      type: 'text',
      required: true,
      saveToJWT: true,
      access: {
        read: adminField,
        create: adminField, // TODO: update to admin/sitemanager
        update: adminField,
      }
    },
    {
      name: 'sites',
      type: 'array',
      saveToJWT: true,
      access: {
        read: adminField,
        create: adminField, // TODO: update to admin/sitemanager
        update: adminField,
      },
      // TODO: custom display component
      // admin: {
      //   components: {
      //     RowLabel:
      //   }
      // },
      fields: [
        {
          name: 'site',
          type: 'relationship',
          relationTo: 'sites',
          required: true,
          index: true,
          saveToJWT: true,
        },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'user',
          required: true,
          options: roles.map(role => ({ label: capitalize(role), value: role })),
        },
      ],
    },
    {
      name: 'isAdmin',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
        readOnly: true,
      }
    }
  ],
  hooks: {
    afterChange: [userEmail],
    beforeChange: [addSub]
  },
  timestamps: true,
}
