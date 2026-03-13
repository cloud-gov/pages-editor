import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'
import { encryptObjectValues } from '@/utilities/encryptor'
import { siteIdHelper } from '@/utilities/idHelper'

const sendBuildTrigger = async (id: number, req: PayloadRequest): Promise<Response | undefined> => {
  if (process.env.PAGES_URL) {
    // needs pages site id)
    const site = await req.payload.findByID({
      collection: 'sites',
      id,
    })

    const payload = encryptObjectValues(
      {
        siteId: site.pagesSiteId,
      },
      process.env.PAGES_ENCRYPTION_KEY,
    )

    return fetch(`${process.env.PAGES_URL}/webhook/site/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }
}

export const afterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // only trigger a build when a site is published or unpublished, not on every update
  if (
    operation === 'update' &&
    ((doc._status === 'published' && previousDoc._status !== 'published') ||
      (doc._status === 'draft' && previousDoc._status === 'published'))
  ) {
    const siteId = siteIdHelper(doc.site)
    await sendBuildTrigger(siteId, req)
  }

  return doc
}

export const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const siteId = siteIdHelper(doc.site)
  await sendBuildTrigger(siteId, req)

  return doc
}

const buildSite = {
  afterChange,
  afterDelete,
}

export default buildSite
