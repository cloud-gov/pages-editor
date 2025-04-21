import type { CollectionBeforeChangeHook } from 'payload'
import type { Post, Event, News } from '@/payload-types'

export const addSite: CollectionBeforeChangeHook<Post | Event | News> = async ({
  data, req, operation
}) => {
  const { user } = req
  if (operation === 'create' && user && !user.isAdmin && user.selectedSiteId) {
    data.site = user.selectedSiteId
  }
  return data
}
