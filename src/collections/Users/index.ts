import { admin, adminField } from '@/access/admin'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { getSiteId } from '@/access/preferenceHelper'
import { Site, User } from '@/payload-types'
import type { CollectionConfig } from 'payload'

import { ensureEmailUniqueness } from './hooks/emailUniqueness'
import { addSub } from './hooks/addSub'
import { sendEmail } from './hooks/sendEmail'

export const roles = ['manager', 'user', 'bot'] as const

const capitalize = (str: string) => {
  return `${str[0].toLocaleUpperCase()}${str.slice(1)}`
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: getAdminOrSiteUser('users'),
    // update: getAdminOrSiteUser('users'), // TODO: update to admin/sitemanager
    // delete: getAdminOrSiteUser('users'), // TODO: update to admin/sitemanager
    // create: getAdminOrSiteUser('users'), // TODO: update to admin/sitemanager
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
      secure: !process.env.ORIGIN?.includes('http://localhost')
    }
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      access: {
        // read: adminField,
        // create: adminField, // TODO: update to admin/sitemanager
        // update: adminField,
      },
      hooks: {
        beforeValidate: [ensureEmailUniqueness]
      }
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
      },
      admin: {
        condition: (_a, _b, { user }) => Boolean(user?.isAdmin),
        disableListColumn: true,
        disableListFilter: true
      }
    },
    {
      name: 'sites',
      type: 'array',
      saveToJWT: true,
      required: true,
      access: {
        // read: adminField,
        // create: adminField, // TODO: update to admin/sitemanager
        // update: adminField,
      },
      admin: {
        components: {
          // RowLabel: '@/components/UserSite/Row',
          Field: '@/components/UserSite/Field',
          Label: '@/components/UserSite/FieldLabel'
        }
      },
      fields: [
        {
          name: 'site',
          type: 'relationship',
          relationTo: 'sites',
          required: true,
          index: true,
          saveToJWT: true,
          access: {
            // read: adminField,
            // create: adminField,
            // update: adminField,
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
      admin: {
        hidden: true,
        readOnly: true,
      }
    }
  ],
  hooks: {
    afterChange: [sendEmail],
    beforeChange: [addSub]
  },
  timestamps: true,
}
