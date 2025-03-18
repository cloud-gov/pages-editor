import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { Site } from '@/payload-types'
import { v4 as uuidv4 } from 'uuid'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { admin } from '@/access/admin'
import { setUserSite } from '@/access/preferenceHelper'
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

    // set the bots "site preference"
    // TODO: it seems like a bug that this can't be included in the same req/transaction
    // wait on https://github.com/payloadcms/payload/pull/9511
    // then try to recreate
    setTimeout(async () => {
      setUserSite(req, bot, doc)
    }, 1000)
  }
  return doc
}


export const Sites: CollectionConfig = {
  slug: 'sites',
  access: {
    create: admin,
    delete: admin,
    read: getAdminOrSiteUser('sites', ['manager', 'user', 'bot']),
    update: admin,
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
      unique: true
    },
  ],
  hooks: {
    afterChange: [createSiteBot]
  },
  timestamps: true,
}
