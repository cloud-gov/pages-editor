import type { CollectionAfterChangeHook } from 'payload'
import type { Post, Event, News } from '@/payload-types'
import { encryptObjectValues } from '@/utilities/encryptor'
import { siteIdHelper } from '@/utilities/idHelper'

export const publish: CollectionAfterChangeHook<Post | Event | News> = async ({
  doc, req, operation, previousDoc
}) => {
  if (operation === 'update' && doc._status === 'published' && previousDoc._status !== 'published') {
    // on publish we reset the review status
    doc.reviewReady = false

    if (process.env.PAGES_URL) {
      // needs pages site id
      const site = await req.payload.findByID({
        collection: 'sites',
        id: siteIdHelper(doc.site)
      })

      const payload = encryptObjectValues({
        siteId: site.pagesSiteId,
      }, process.env.PAGES_ENCRYPTION_KEY)

      await fetch(`${process.env.PAGES_URL}/webhook/site/build`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
    }
  }
  return doc
}
