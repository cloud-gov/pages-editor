import type { CollectionAfterChangeHook, CollectionConfig, User } from 'payload'

export const roles = ['manager', 'user', 'bot'] as const

const capitalize = (str: string) => {
  return `${str[0].toLocaleUpperCase()}${str.slice(1)}`
}

const userEmail: CollectionAfterChangeHook<User> = async ({
  doc, operation
}) => {
  if (operation === 'create') {
    // email the user
    // TBD
  }
  return doc
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['email', 'updatedAt', 'siteRoles'],
    useAsTitle: 'email',
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
      type: 'email',
      required: true,
    },
    {
      name: 'sub', // we have to create this manually or it isn't added to the JWT payload-token
      type: 'text',
      saveToJWT: true,
    },
    {
      name: 'sites',
      type: 'array',
      saveToJWT: true,
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
    },
  ],
  hooks: {
    afterChange: [userEmail]
  },
  timestamps: true,
}
