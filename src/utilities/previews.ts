import type { CollectionSlug } from 'payload'

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

export const getCollectionPreviewUrl = (collection: CollectionSlug) => {
  return async ({ data, req }): Promise<string> => {
    const slug = await getSiteSlug(req, data.site)
    const path = `${collection}/${data.slug}`

    return choosePreviewUrl(slug, path)
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
