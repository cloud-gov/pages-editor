import type { CollectionSlug, GeneratePreviewURL, PayloadRequest } from 'payload'

async function getSiteSlug(req, siteId: number): Promise<string> {
  const { slug } = await req.payload.findByID({
    collection: 'sites',
    id: siteId,
  })

  return slug
}

const choosePreviewUrl = (slug: string, path: string = ''): string => {
  if (!process.env.PREVIEW_ROOT) {
    return `http://${slug}/${path}`
  } else {
    return `https://${slug}.${process.env.PREVIEW_ROOT}/${path}`
  }
}

export const getCollectionPreviewUrl = (
  collection: CollectionSlug,
  useCollectionPrefix: boolean = true,
) => {
  return async ({ data, req }): Promise<string> => {
    const slug = await getSiteSlug(req, data.site)
    const path = useCollectionPrefix ? `${collection}/${data.slug}` : data.slug

    return choosePreviewUrl(slug, path)
  }
}

export const getCustomCollectionLivePreview = async ({ data, req }): Promise<string | null> => {
  try {
    const record = await req.payload.findByID({
      collection: 'collection-entries',
      id: data.id,
    })

    const slug = await getSiteSlug(req, data.site)
    const path = `${record.collectionConfig.slug}/${record.slug}`

    return choosePreviewUrl(slug, path)
  } catch (error) {
    return null
  }
}

export const getCustomCollectionPreview = async (doc, { req }): Promise<string | null> => {
  try {
    return getCustomCollectionLivePreview({ data: { id: doc.id }, req })
  } catch (error) {
    return null
  }
}

export const getPagePreviewUrl = async ({ data, req }): Promise<string> => {
  const slug = await getSiteSlug(req, data.site)
  const path = data.slug

  return choosePreviewUrl(slug, path)
}

export const getGlobalPreviewUrl = async ({ req }): Promise<string> => {
  const slug = await getSiteSlug(req, req.user.selectedSiteId)

  return choosePreviewUrl(slug)
}

/**
 * Extract an ID when a relation field might be:
 * - a primitive id (string|number)
 * - a populated object with `id` or select-like { value }
 * - an array (hasMany) — returns the first id if present
 */
function __extractId(value: unknown): string | number | undefined {
  if (value == null) return undefined
  if (typeof value === 'string' || typeof value === 'number') return value
  if (Array.isArray(value)) return value.length ? __extractId(value[0]) : undefined
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>
    if (typeof v.id === 'string' || typeof v.id === 'number') return v.id
    if (typeof v.value === 'string' || typeof v.value === 'number') return v.value
  }
  return undefined
}

/**
 * Extract a slug when it might be:
 * - a simple string
 * - a localized object like { en: 'x', fr: 'y' } — picks first string value
 */
function __extractSlug(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const vals = Object.values(value as Record<string, unknown>).filter(
      (v) => typeof v === 'string',
    ) as string[]
    return vals[0] || ''
  }
  return String(value)
}

/**
 * Reusable adapter for admin.preview that reuses the existing factory:
 *   getCollectionPreviewUrl(collection) // ( { data, req } ) => Promise<string>
 *
 * It adapts Payload’s (doc, { req }) signature to the factory by:
 * - Normalizing `site` to a primitive ID
 * - Normalizing `slug` to a plain string
 * - Passing { data, req } to your existing utility
 */
export const getAdminCollectionPreview = (
  collection: string,
  useCollectionPrefix: boolean = true,
): GeneratePreviewURL => {
  // import the existing utility lazily to avoid circular imports if needed
  const getUrlFactory = getCollectionPreviewUrl as (
    c: string,
    useCollectionPrefix: boolean,
  ) => ({ data, req }: { data: any; req: PayloadRequest }) => Promise<string>

  return async (doc, { req }) => {
    const normalized = {
      ...doc,
      site: __extractId((doc as any).site),
      slug: __extractSlug((doc as any).slug),
    }

    const buildUrl = getUrlFactory(collection, useCollectionPrefix)
    return buildUrl({ data: normalized, req: req as PayloadRequest })
  }
}
