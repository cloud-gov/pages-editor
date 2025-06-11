import type { CollectionBeforeChangeHook } from 'payload'
import type { Post, Event, News, Policy, Page } from '@/payload-types'

export const completeReview: CollectionBeforeChangeHook<
  Post | Event | News | Policy | Page
> = async ({ data, operation }) => {
  if (operation === 'update' && data._status === 'published' && data.reviewReady === true) {
    // on publish we reset the review status
    data.reviewReady = false
  }

  return data
}
