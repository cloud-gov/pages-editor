import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload'
import { siteIdHelper } from '@/utilities/idHelper'

const REVIEW_TYPE_LABELS: Record<string, string> = {
  'pages': 'Page',
  'collection-entries': 'Collection Entry',
  'collection-types': 'Collection Type',
  'tag-types': 'Tag Type',
  'side-navigation': 'Side Navigation',
  'alerts': 'Alert',
  'site-forms': 'Form',
  'menu-site-collection': 'Main Navigation',
  'site-config-site-collection': 'Site Identity',
  'home-page-site-collection': 'Home Page',
  'footer-site-collection': 'Footer',
  'pre-footer-site-collection': 'Pre-Footer',
  'not-found-page-site-collection': 'Not Found 404 Page',
  'search-analytics-page-site-collection': 'Search and Digital Analytics',
  'site-auth-site-collection': 'Site Authorization',
}

const REVIEW_QUEUE_SLUG = 'review-queue'

function resolveTitle(doc: Record<string, unknown>, fallback: string): string {
  const candidate =
    (typeof doc.title === 'string' && doc.title) ||
    (typeof doc.name === 'string' && doc.name) ||
    (typeof doc.filename === 'string' && doc.filename) ||
    (typeof doc.agencyName === 'string' && doc.agencyName) ||
    (typeof doc.domain === 'string' && doc.domain)

  return candidate || fallback
}



async function resolveContentType(
  slug: string,
  doc: Record<string, unknown>,
  req: PayloadRequest,
): Promise<string> {
  const fallback = REVIEW_TYPE_LABELS[slug] || slug

  if (slug === 'collection-entries' && doc.collectionType != null) {
    const collectionType = doc.collectionType
    
    if (
      typeof collectionType === 'object' &&
      collectionType !== null &&
      typeof (collectionType as Record<string, unknown>).title === 'string'
    ) {
      return (collectionType as Record<string, unknown>).title as string
    }

    const ctId =
      typeof collectionType === 'number' || typeof collectionType === 'string'
        ? collectionType
        : (collectionType as Record<string, unknown>).id

    if (ctId != null) {
      const ct = await req.payload.findByID({
        collection: 'collection-types',
        id: ctId as number,
        depth: 0,
        req,
        overrideAccess: true,
      })
      if (ct?.title) return ct.title
    }
  }

  return fallback
}

function resolveSiteId(doc: Record<string, unknown>): number | undefined {
  if (doc.site == null) return undefined
  return siteIdHelper(doc.site as never)
}

async function findExistingRow(
  req: PayloadRequest,
  slug: string,
  sourceId: string,
) {
  const existing = await req.payload.find({
    collection: REVIEW_QUEUE_SLUG,
    where: {
      and: [
        { sourceCollection: { equals: slug } },
        { sourceId: { equals: sourceId } },
      ],
    },
    limit: 1,
    depth: 0,
    req,
    overrideAccess: true,
  })

  return existing.docs[0]
}





export const syncReviewQueueAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
}) => {
  const slug = collection?.slug
  
  if (!slug || slug === REVIEW_QUEUE_SLUG) return doc

  const data = doc as Record<string, unknown>
  const sourceId = String(data.id)
  const isReady = data.reviewReady === true

  const existing = await findExistingRow(req, slug, sourceId)

  if (!isReady) {
    if (existing) {
      await req.payload.delete({
        collection: REVIEW_QUEUE_SLUG,
        id: existing.id,
        req,
        overrideAccess: true,
      })
    }
    return doc
  }

  const siteId = resolveSiteId(data)
  if (siteId == null) {
    
    
    req.payload.logger.warn({
      msg: `syncReviewQueue: skipping ${slug}:${sourceId} because it has no site`,
    })
    return doc
  }

  const title = resolveTitle(data, `${REVIEW_TYPE_LABELS[slug] || slug} ${sourceId}`)
  const contentType = await resolveContentType(slug, data, req)
  const editUrl = `/admin/collections/${slug}/${sourceId}`
  const lastModified =
    (typeof data.updatedAt === 'string' && data.updatedAt) || new Date().toISOString()

  const rowData = {
    title,
    contentType,
    sourceCollection: slug,
    sourceId,
    editUrl,
    lastModified,
    site: siteId,
  }

  if (existing) {
    await req.payload.update({
      collection: REVIEW_QUEUE_SLUG,
      id: existing.id,
      data: rowData,
      req,
      overrideAccess: true,
    })
  } else {
    await req.payload.create({
      collection: REVIEW_QUEUE_SLUG,
      data: rowData,
      req,
      overrideAccess: true,
    })
  }

  return doc
}


export const syncReviewQueueAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
  collection,
}) => {
  const slug = collection?.slug
  if (!slug || slug === REVIEW_QUEUE_SLUG) return doc

  const sourceId = String((doc as Record<string, unknown>).id)
  const existing = await findExistingRow(req, slug, sourceId)

  if (existing) {
    await req.payload.delete({
      collection: REVIEW_QUEUE_SLUG,
      id: existing.id,
      req,
      overrideAccess: true,
    })
  }

  return doc
}
