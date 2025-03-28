import type { Access, CollectionSlug, Where } from 'payload'
import type { Post, Page, User, Site } from '@/payload-types'
import { siteIdHelper } from '@/utilities/idHelper'

// ideally this code could be handled via a single generic but
// certain access operations don't pass `data` which is the only
// way to infer the shape of the documents we're operating on

// type Role = User["sites"][number]["role"]
type Role = 'manager' | 'user' | 'bot'

export function getAdminOrSiteUser(slug: CollectionSlug, requiredRole: Role[] = ['manager', 'user']) {
  const adminOrSiteUser: Access<Post | Page | User | Site > = async ({ req, data }) => {
    const { payload } = req;
    let { user } = req;
    if (!user) return false
    if (user.isAdmin) return true

    const siteId = user.selectedSiteId
    if (!siteId) return false

    const matchedSite = user.sites?.find(site => siteIdHelper(site.site) === siteId)
    if (!(matchedSite && requiredRole.includes(matchedSite.role))) return false

    // if collection data exists, extract the site id and match against it
    // false for no match.
    // note that this block is potentially unnecessary/paranoid:
    // it prevents a user from changing data TO a site they don't have access to,
    // the queries below already prevent them from changing existing data they don't
    // have access to
    if (data) {
      if ('site' in data) {
        const dataSiteId = typeof data.site === 'number' ? data.site : data.site.id
        if (siteId !== dataSiteId) return false

      } else if ('sites' in data) {
        const dataSiteIds = data.sites?.map(site => siteIdHelper(site.site))
        if (!(dataSiteIds && dataSiteIds.includes(siteId))) return false

      } else if ('id' in data){
        if (data.id !== siteId) return false
      }
    }

    let queryPath: string
    if (slug === 'users') {
      queryPath = "sites.site.id"
    } else if (slug === 'sites') {
      queryPath = "id"
    } else {
      queryPath = "site.id"
    }

    // pass a query ensuring the user has access to the queried data
    const query: Where = {
      [queryPath]: {
        equals: siteId
      }
    }

    return query
  }
  return adminOrSiteUser
}
