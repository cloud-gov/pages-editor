import type { CollectionBeforeChangeHook } from 'payload'
import type { Post, Page } from '@/payload-types'
import { getSiteId } from '@/access/preferenceHelper'


export const addSite: CollectionBeforeChangeHook<Post | Page> = async ({
  data, req: { payload, user }, operation
}) => {
  if (operation === 'create' && user && !user.isAdmin) {
    data.site = await getSiteId(payload, user)
  }
  return data
}
