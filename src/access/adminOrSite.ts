import type { Access } from 'payload'
import type { Where } from 'payload'
import type { Site, SiteRole } from '@/payload-types'

// Access control function signatures by method:
// create: req, data
// read: req, id
// update: req, id, data
// delete: req, id

export const adminOrSiteUser: Access = ({ req: { user }, data }) => {
  if (!user) return false
  if (user.isAdmin) return true
  // if the user doesn't have access to the site in the
  // new data (create/update), deny access
  console.log(user)
  const userSites = user.siteRoles?.map(role => ((role as SiteRole).site as Site).id) || []
  console.log(userSites)
  if (!userSites.includes(data?.site)) {
    return false
  }
  // pass a query ensuring the user has access to the prior
  // data, matching on site
  const query: Where = {
    site: {
      in: userSites.join()
    }
  }
  return query
}
