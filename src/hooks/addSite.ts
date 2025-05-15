import type { CollectionBeforeChangeHook } from 'payload'
import type { Post, Event, News, Media } from '@/payload-types'

export const addSite: CollectionBeforeChangeHook<Post | Event | News | Media> = async ({
  data, req, operation
}) => {
  const { user } = req

  if (operation === 'create' && user && !user.isAdmin && user.selectedSiteId) {
    data.site = user.selectedSiteId
  }
  return data
}
