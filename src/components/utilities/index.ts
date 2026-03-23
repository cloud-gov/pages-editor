import type { BasePayload } from 'payload'
import { Site, SiteAuthSiteCollection, User } from '@/payload-types'
import { redirect } from 'next/dist/server/api-utils'

type UserSiteInfo = {
  user: User
  sites: Site[]
  selectedSiteId: string | null
  selectedSiteRole?: 'manager' | 'user' | 'bot'
}

export const buildFilteredUrl = (collectionTypeId: string | number) => {
  const params = new URLSearchParams({
    limit: '10',
    page: '1',
  })

  // Add the where filter with the proper structure
  params.append('where[or][0][and][0][collectionType][equals]', String(collectionTypeId))

  return `/admin/collections/collection-entries?${params.toString()}`
}

export const getUserSiteInfo = async (
  payload: BasePayload,
  headers: any,
): Promise<UserSiteInfo> => {
  const { user } = await payload.auth({ headers })

  // Don't render without a user
  if (!user) throw new Error('User not authenticated')

  // Get sites for non-admin users
  const sites = user?.isAdmin ? [] : user.sites?.map((site) => site.site as Site) || []
  const selectedSiteId = user?.selectedSiteId?.toString()
  const selectedSiteRole = user?.sites?.find((s) => {
    if (typeof s.site === 'number') return null
    return s?.site?.id?.toString() === selectedSiteId
  })?.role

  return { user, sites, selectedSiteId, selectedSiteRole }
}

export const getManagerSiteInfo = async (
  payload: BasePayload,
  headers: any,
): Promise<UserSiteInfo> => {
  const { user, sites, selectedSiteId, selectedSiteRole } = await getUserSiteInfo(payload, headers)

  if (!user) throw new Error('User not authenticated')

  if (!user.isAdmin && !user.sites?.some((s) => s.role === 'manager')) {
    throw new Error('User does not have manager access to any sites')
  }

  return { user, sites, selectedSiteId, selectedSiteRole }
}

interface ATUPackage {
  user: User
  siteUsers: {
    id: number
    email: string
    role: 'manager' | 'user' | 'bot'
  }[]
  atuPackage: SiteAuthSiteCollection
}

export const getSiteATUPackage = async (
  payload: BasePayload,
  headers: any,
): Promise<ATUPackage> => {
  const { user, selectedSiteId } = await getManagerSiteInfo(payload, headers)

  const atuPackage = await payload.find({
    collection: 'site-auth-site-collection',
    where: {
      site: {
        equals: selectedSiteId,
      },
    },
  })

  if (!atuPackage) throw new Error('ATU Package not found for site')

  const siteUsersList = await payload.find({
    collection: 'users',
    where: {
      'sites.site.id': { equals: selectedSiteId },
    },
  })

  if (!siteUsersList || siteUsersList.totalDocs === 0) throw new Error('No users found for site')

  const siteUsers = siteUsersList.docs.map((u) => {
    const userRole =
      u.sites.find((s) => {
        if (typeof s.site === 'number') return 'user'

        return s.site.id.toString() === selectedSiteId
      })?.role || 'user'

    return {
      id: u.id,
      email: u.email,
      role: userRole,
    }
  })

  return { user, siteUsers, atuPackage: atuPackage.docs[0] }
}

export const getCollectionTypes = async (payload: BasePayload, headers) => {
  const { selectedSiteId } = await getUserSiteInfo(payload, headers)

  // Get sites collection types
  const collectionTypes = await payload.find({
    collection: 'collection-types',
    where: {
      site: {
        equals: selectedSiteId,
      },
    },
    limit: 100, // Adjust as needed
  })

  return collectionTypes
}
