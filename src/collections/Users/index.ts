import { admin, adminField } from '@/access/admin'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { Site } from '@/payload-types'
// import { redirect } from 'next/navigation'
import { CollectionAfterLogoutHook, ValidationError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type CollectionConfig, type FieldHook, type User } from 'payload'
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
  data, operation
}) => {
  if (operation === 'create') {
    data.sub = uuidv4()
  }
}

const testEmailUniqueness: FieldHook<User> = async({
  data, originalDoc, req, value, operation
}) => {
  const { payload, user } = req
  if (operation === 'create' || operation == 'update') {
    // if value is unchanged, skip validation
    if (originalDoc?.email === value) {
      return value
    }

    const match = await payload.find({
      collection: 'users',
      depth: 2,
      where: {
        email: {
          equals: value
        }
      }
    })
    if (match.docs.length && user ) {
      const existingUser = match.docs[0]
      if (existingUser && user.isAdmin) {
        throw new ValidationError({
          errors: [{
            message: `User with email ${value} exists.`,
            path: 'email',
          }]
        })
      }
      // if the user matches the current site, this is a true validation error
      // if the user exists but on another site, treat this essentially like a new user
      const siteId = user.selectedSiteId;
      if (siteId && existingUser.sites?.map(s => (s.site as Site).id).includes(siteId)) {
        throw new ValidationError({
          errors: [{
            message: `User with email ${value} exists for this site`,
            path: 'email',
          }]
        })
      } else if (data) {
        await payload.update({
          collection: 'users',
          id: existingUser.id,
          data: {
            sites: [...data.sites, ...(existingUser.sites ?? [])]
          }
        })
        return false
      }
      return value
    }
    return value
  }

  return value
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
    defaultColumns: ['email', 'updatedAt', 'role'],
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
        update: adminField,
      },
      hooks: {
        beforeValidate: [testEmailUniqueness]
      }
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
      saveToJWT: true,
      required: true,
      admin: {
        isSortable: false,
        components: {
          RowLabel: '@/components/SiteRowLabel',
          Label: '@/components/SiteLabel'
        },
        disableListColumn: true,
        disableListFilter: true,
        condition: (data, _, ctx) => {
          return Boolean(ctx.user?.isAdmin) || data.sites.length > 1
        }
      },
      hooks: {
        // this hook filters out sites for non-admins or when not on the account page
        // it also provides a useful hack: this data is then provided to `data` in the
        // admin.condition functions and we can variably display things based on that
        // although it feels unreliable :(
        afterRead: [async ({ value, req }) => {
          if (!req.user || req.user.isAdmin || ['/admin/account', '/api/users/me'].includes(req.pathname)) return value
          const siteId = req.user.selectedSiteId
          if (!siteId) return value
          return value.filter(v => v.site === siteId)
        }]
      },
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
      required: true,
      admin: {
        hidden: true,
        readOnly: true,
        disableListColumn: true,
        disableListFilter: true
      }
    },
    {
      name: 'role',
      type: 'ui',
      admin: {
        // condition: (_a, _b, ctx) => Boolean(ctx.user && !ctx.user.isAdmin),
        components: {
          Field: '@/components/VirtualRole/Field',
          Cell: '@/components/VirtualRole/Cell',
        }
      }
    }
  ],
  hooks: {
    afterChange: [userEmail],
    beforeChange: [addSub],
    // afterLogout: [fullLogout]
  },
  timestamps: true,
}
