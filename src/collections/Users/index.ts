import { admin, adminField } from '@/access/admin'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import type { CollectionConfig} from 'payload'
import {
  testEmailUniqueness,
  userEmail,
  addSub,
  addSelectedSiteId,
  ensureSites,
  removeDummyUsers,
} from './hooks'
import { siteIdHelper } from '@/utilities/idHelper'

export const roles = ['manager', 'user', 'bot'] as const

const capitalize = (str: string) => {
  return `${str[0].toLocaleUpperCase()}${str.slice(1)}`
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: getAdminOrSiteUser('users'),
    update: getAdminOrSiteUser('users', ['manager']),
    delete: admin,
    create: getAdminOrSiteUser('users', ['manager']),
  },
  admin: {
    defaultColumns: ['email', 'updatedAt', 'sites'],
    useAsTitle: 'email',
    hidden: false,
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
    tokenExpiration: 86400, // one day
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      secure: !process.env.PUBLIC_URL?.includes('http://localhost')
    }
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      access: {
        update: adminField,
      },
    },
    {
      name: 'sub', // we have to create this manually or it isn't added to the JWT payload-token
      type: 'text',
      saveToJWT: true,
      access: {
        read: adminField,
        update: adminField,
      },
      admin: {
        disableListColumn: true,
        disableListFilter: true
      }
    },
    {
      name: 'sites',
      type: 'array',
      required: true,
      label: 'Role',
      labels: {
        plural: 'Roles',
        singular: 'Role'
      },
      saveToJWT: true,
      hooks: {
        afterRead: [async ({ value, req, data }) => {
          const { user } = req
          if (!user) return value
          if (user.isAdmin) return value
          return value.filter(v => siteIdHelper(v.site) === user.selectedSiteId)
        }]
      },
      admin: {
        isSortable: false,
        components: {
          Cell: '@/components/SiteCell',
          RowLabel: '@/components/SiteRowLabel',
        },
        disableListFilter: true,
      },
      fields: [
        {
          name: 'site',
          type: 'relationship',
          relationTo: 'sites',
          required: true,
          index: true,
          saveToJWT: true,
          admin: {
            condition: (_, __, ctx) => {
              return Boolean(ctx.user?.isAdmin)
            }
          }
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
      access: {
        read: adminField,
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
        readOnly: true,
        disableListColumn: true,
        disableListFilter: true
      }
    },
    {
      name: 'selectedSiteId',
      type: 'number',
      admin: {
        hidden: true,
        readOnly: true,
        disableListColumn: true,
        disableListFilter: true
      }
    },
    // hide api key info
    // https://github.com/payloadcms/payload/issues/12089
    {
      name: 'enableAPIKey',
      type: 'checkbox',
      access: {
        read: adminField,
        update: adminField,
      },
      admin: {
        disableListColumn: true,
        disableListFilter: true
      }
    },
    {
      name: 'apiKey',
      type: 'text',
      access: {
        read: adminField,
        update: adminField,
      },
      admin: {
        disableListColumn: true,
        disableListFilter: true
      }
    },
    {
      name: 'actions',
      label: 'User Actions',
      type: 'ui',
      admin: {
        position: 'sidebar',
        disableListColumn: true,
        components: {
          Field: '@/components/RemoveUser',
        }
      }
    }
  ],
  hooks: {
    afterChange: [removeDummyUsers, userEmail],
    beforeOperation: [ensureSites],
    beforeValidate: [addSub, addSelectedSiteId],
    beforeChange: [testEmailUniqueness],
    // afterLogout: [fullLogout]
  },
  timestamps: true,
}
