import type { Access } from 'payload'
import type { Where } from 'payload'
import type { Site } from '@/payload-types'
import { getSiteId } from './preferenceHelper'

// Access control function signatures by method:
// create: req, data
// read: req, id
// update: req, id, data
// delete: req, id

export const adminOrSiteUser: Access = async ({ req: { user, payload }, data }) => {
  if (!user) return false
  if (user.isAdmin) return true

  const siteId = await getSiteId(payload, user)
  if (!siteId) return false

  // if the user doesn't have access to the site in the
  // new data (create/update), deny access
  if (data && siteId !== (data?.site?.id)) return false

  // pass a query ensuring the user has access to the prior
  // data, matching on site.id
  const query: Where = {
    "site.id": {
      equals: siteId
    }
  }
  return query
}
