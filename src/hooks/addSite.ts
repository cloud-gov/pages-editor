import type { CollectionBeforeChangeHook } from 'payload'
import type { Post, Page } from '@/payload-types'

export const addSite: CollectionBeforeChangeHook<Post | Page> = async ({
  data, req, operation
}) => {
  const { user } = req
  if (operation === 'create' && user && !user.isAdmin && user.selectedSiteId) {
    data.site = user.selectedSiteId
  }
  return data
}
