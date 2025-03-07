import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { Site } from '@/payload-types'
import { v4 as uuidv4 } from 'uuid'
import { getAdminOrSiteUser } from '@/access/adminOrSite'

const createSiteBot: CollectionAfterChangeHook<Site> = async ({
  doc, req, operation,
}) => {
  const { payload } = req
  if (operation === 'create') {
    const bot = await payload.create({
      collection: 'users',
      data: {
        email: `cloud-gov-pages-operations+${doc.name}@gsa.gov`,
        sites: [
          {
            site: doc.id,
            role: 'bot',
          }
        ],
        sub: uuidv4(),
        enableAPIKey: true,
        apiKey: uuidv4()
      },
      req // passing the request keeps this as a single transaction
    })
  }
  return doc
}


export const Sites: CollectionConfig = {
  slug: 'sites',
  access: {
    create: getAdminOrSiteUser('sites'),
    delete: getAdminOrSiteUser('sites'),
    read: getAdminOrSiteUser('sites'),
    update: getAdminOrSiteUser('sites'),
  },
  admin: {
    defaultColumns: ['name', 'updatedAt', 'createdAt'],
    useAsTitle: 'name',
    hidden: ({ user }) => !(user && user.isAdmin)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [createSiteBot]
  },
  timestamps: true,
}
