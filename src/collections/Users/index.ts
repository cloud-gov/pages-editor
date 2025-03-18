import { admin, adminField } from '@/access/admin'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { getSiteId } from '@/access/preferenceHelper'
import { Site } from '@/payload-types'
import { APIError, ValidationError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type CollectionConfig, type FieldHook, type User } from 'payload'
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
  if (operation === 'create' || operation == 'update')
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
    const siteId = await getSiteId(req, user.id)
    if (siteId && existingUser.sites.map(s => (s.site as Site).id).includes(siteId)) {
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
          sites: [...data.sites, ...existingUser.sites]
        }
      })
      return false
    }
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
        update: adminField,
      },
      hooks: {
        beforeValidate: [testEmailUniqueness]
      }
    },
    {
      name: 'sub', // we have to create this manually or it isn't added to the JWT payload-token
      type: 'text',
      required: true,
      saveToJWT: true,
      access: {
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
          admin: {
            condition: (_a, _b, { user }) => Boolean(user?.isAdmin)
          },
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
      access: {
        read: adminField,
        create: () => false,
        update: () => false,
      },
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
