import type { BasePayload } from 'payload'
import { Site, User } from '@/payload-types'

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
