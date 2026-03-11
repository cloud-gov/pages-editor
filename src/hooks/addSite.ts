import type { CollectionBeforeChangeHook } from 'payload'
import type { CollectionEntry, CollectionType, Media } from '@/payload-types'

export const addSite: CollectionBeforeChangeHook<
  CollectionEntry | CollectionType | Media
> = async ({ data, req, operation }) => {
  const { user } = req

  if (operation === 'create' && user && !user.isAdmin && user.selectedSiteId) {
    data.site = user.selectedSiteId
  }
  return data
}
