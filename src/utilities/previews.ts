import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '../payload-types'

import pDebounce from 'p-debounce';

const DEBOUNCE_TIME = 1000
const debouncedFetch = pDebounce(fetch, DEBOUNCE_TIME, { before: true });

// webhook to update preview
export const previewWebhook: CollectionAfterChangeHook<Post> = async ({
  doc, req: { payload }
}) => {
  try {
    await debouncedFetch(`${process.env.PREVIEW_URL}/reload`)
  } catch (e) {
    payload.logger.warn(e)
  }
  return doc
}

// export const livePreviewUrl:

// export const previewUrl:
