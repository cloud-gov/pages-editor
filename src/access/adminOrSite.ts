import type { Access, FieldAccess, CollectionSlug, Where } from 'payload'
import type { Post, User, Site, Event, Media, News, Page, SiteConfig } from '@/payload-types'
import { getUserSiteIds, siteIdHelper } from '@/utilities/idHelper'
// import { isRoleForSelectedSite } from '@/utilities/access'

// ideally this code could be handled via a single generic but
// certain access operations don't pass `data` which is the only
// way to infer the shape of the documents we're operating on

export type Role = NonNullable<Required<User>['sites']>[number]['role']

// Checks if the user is an admin or has a specific role in the site to be used at
// the field level
export const getAdminOrUserField = (requiredRole: Role[] = ['manager', 'user']) => {
  const adminOrFieldUser: FieldAccess = ({ req: { user } }) => {
    if (!user) return false
    if (user.isAdmin) return true

    const siteId = user.selectedSiteId
    if (!siteId) return false

    const matchedSite = user.sites.find((site) => siteIdHelper(site.site) === siteId)
    if (matchedSite && requiredRole.includes(matchedSite.role)) return true

    return false
  }

  return adminOrFieldUser
}

// Checks if the user is an admin or has a specific role in the site to be used at
// the collection level
export function getAdminOrSiteUser(
  slug: CollectionSlug,
  requiredRole: Role[] = ['manager', 'user'],
) {
  const adminOrSiteUser: Access<Post | User | Site | Event | News | Page> = async ({
    req,
    data,
  }) => {
    let { user } = req
    if (!user) return false
    if (user.isAdmin) return true

    const siteId = user.selectedSiteId
    if (!siteId) return false

    // if (!isRoleForSelectedSite(user, requiredRole)) return false
    // NOTE: skip the utility function to keep our site role for other checks
    const matchedSite = user.sites.find((site) => siteIdHelper(site.site) === siteId)
    if (!(matchedSite && requiredRole.includes(matchedSite.role))) return false

    // if collection data exists, extract the site id and match against it
    // false for no match.
    // note that part of this block is potentially unnecessary/paranoid:
    // it prevents a user from changing data TO a site they don't have access to,
    // the queries below already prevent them from changing existing data they don't
    // have access to
    if (data) {
      if ('site' in data) {
        // TODO, unhardcode this role or store elsewhere
        if (data._status === 'published' && matchedSite.role !== 'manager') return false

        const dataSiteId = typeof data.site === 'number' ? data.site : data.site.id
        if (siteId !== dataSiteId) return false
      } else if ('sites' in data) {
        const dataSiteIds = data.sites.map((site) => siteIdHelper(site.site))
        if (!(dataSiteIds && dataSiteIds.includes(siteId))) return false
      } else if ('id' in data) {
        if (data.id !== siteId) return false
      }
    }

    let queryPath: string
    if (slug === 'users') {
      queryPath = 'sites.site.id'
    } else if (slug === 'sites') {
      queryPath = 'id'
    } else {
      queryPath = 'site.id'
    }

    // pass a query ensuring the user has access to the queried data
    const query: Where = {
      [queryPath]: {
        equals: siteId,
      },
    }

    return query
  }
  return adminOrSiteUser
}

// Checks if the user is an admin or has a specific role in the site to be used at
// the site globals level
export function getAdminOrSiteUserGlobals(
  requiredRole: Role[] = ['manager', 'user'],
  isUpdate = false,
) {
  const adminOrSiteUser: Access<SiteConfig> = async ({ req, data }) => {
    let { user } = req
    if (!user) return false
    if (user.isAdmin) return true

    const siteId = user.selectedSiteId
    if (!siteId) return false

    const matchedSite = user.sites.find((site) => siteIdHelper(site.site) === siteId)

    if (!(matchedSite && requiredRole.includes(matchedSite.role))) return false

    if (isUpdate && data && data._status === 'published' && matchedSite.role !== 'manager')
      return false

    return true
  }
  return adminOrSiteUser
}

// Checks if the user is an admin
export function getAdmin({ req }) {
  let { user } = req
  if (!user) return false
  if (user.isAdmin) return true

  return false
}

// site reads use a slightly different function since users don't need to have
// a site selected to read its name
export const adminOrAnySite: Access<Site> = async ({ req, data }) => {
  let { user } = req
  if (!user) return false
  if (user.isAdmin) return true

  const userSiteIds = getUserSiteIds(user)

  if (data) {
    if (!userSiteIds.includes(data.id)) return false
  }

  const query: Where = {
    id: {
      in: userSiteIds.join(),
    },
  }

  return query
}
