import type { CollectionAfterChangeHook } from 'payload'
import type { Post, Site } from '../payload-types'

import pDebounce from 'p-debounce';

const DEBOUNCE_TIME = 1000
const debouncedFetch = pDebounce(fetch, DEBOUNCE_TIME, { before: true });

// webhook to update preview
export const previewWebhook: CollectionAfterChangeHook<Post> = async ({
  doc, req: { payload }
}) => {
  if (process.env.PREVIEW_ROOT) {
    try {
      const url = `${process.env.PREVIEW_ROOT}-${(doc.site as Site).name}.app.cloud.gov/reload`
      await debouncedFetch(url)
    } catch (e) {
      payload.logger.warn(e)
    }
  }
  return doc
}

// export const livePreviewUrl:

// export const previewUrl:
