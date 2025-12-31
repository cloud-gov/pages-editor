import type { GlobalConfig, CollectionConfig, Config, CollectionSlug } from 'payload'
import { adminField } from '@/access/admin'
import { SiteConfig } from '@/payload-types'
import { publish } from '@/hooks/publish'
import { completeReview } from '@/hooks/completeReview'

export const createSiteGlobal = (config: GlobalConfig): [GlobalConfig, CollectionConfig] => {
  const fields = config.fields
  // hardcoded type assertion is required since we'll be writing `payload.find|create|update` and a valid collection name is required`
  // TODO: this collection should really be generated from the slug but it will break typing on the payload local
  // API response
  // const collectionName = 'site-config-site-collection'
  const collectionName: CollectionSlug = `${config.slug}-site-collection` as CollectionSlug

  const global: GlobalConfig = {
    ...config,
    admin: {
      ...config.admin,
      hidden: ({ user }) => Boolean(user && user.isAdmin),
      hideAPIURL: true,
    },
    hooks: {
      beforeChange: [
        async ({ req, data, originalDoc }) => {
          const siteId = req?.user?.selectedSiteId
          if (!siteId || isNaN(Number(siteId))) return data;

          // skip writes during autosave draft saves
          const isAutosave = req.query.autosave === 'true';
          const wasPublished = originalDoc?._status === 'published'
          if (isAutosave && wasPublished) return data;

          // strip fields that should be owned by the DB or the collection itself

          const {
            id,
            globalType,
            createdAt,
            updatedAt,
            _status,
            ...rest
          } = (data as Record<string, unknown>) || {}

          const sanitized = { ...rest, site: siteId }

          const existing = (
            await req.payload.find({
              collection: collectionName,
              where: {
                site: { equals: siteId },
              },
            })
          ).docs as SiteConfig[]

          if (existing[0]) {
            await req.payload.update({
              collection: collectionName,
              id: existing[0].id,
              data: sanitized,
              req,
            })
          } else {
            await req.payload.create({
              collection: collectionName,
              data: sanitized,
              req,
            })
          }

          return data
        },
        ...(config.hooks?.beforeChange || []),
      ],
      beforeRead: [
        async ({ req, doc }) => {
          const siteId = req?.user?.selectedSiteId

          // if reading a draft/autosave, return the Global doc (do not swap in collection)
          const isDraftOrAutosave = req.query?.draft === 'true' || req.query?.autosave === 'true'

          if (isDraftOrAutosave || (doc?._status === 'draft')) {
            return doc ?? {} // show the actual Global draft version
          }

          // For non-draft reads, use the site collection mirror
          const globalSiteCollection = await req.payload.find({
            collection: collectionName,
            // The admin expects to fetch its own relationships, so we must force depth to 0,
            depth: 0,
            where: {
              site: { equals: siteId },
            },
          })

          if (globalSiteCollection.docs[0]) {
            return globalSiteCollection.docs[0]
          } else {
            // fallback to Global if mirror doesn't exist yet
            return doc ?? {}
          }
        },
        ...(config.hooks?.beforeRead || []),
      ],
    },
    versions: {
      max: 50,
      drafts: {
        autosave: {
          interval: 500,
        },
      },
    },
  }

  const collection: CollectionConfig = {
    ...config,
    slug: collectionName,
    graphQL: {},
    admin: {
      ...config.admin,
      hidden: ({ user }) => !(user && user.isAdmin),
      group: 'Global Collections',
    },
    // hooks should be passed to the global, not the collection, since the global is the main interface.
    hooks: {
      afterChange: [publish],
      beforeChange: [completeReview],
    },
    // custom site field is passed here to manage ownership of collections.
    fields: [
      ...fields,
      {
        name: 'site',
        type: 'relationship',
        relationTo: 'sites',
        required: true,
        access: {
          create: adminField,
          update: adminField,
          read: () => true,
        },
      },
    ],
    versions: {
      maxPerDoc: 50,
      drafts: {
        autosave: {
          interval: 500,
        },
      },
    },
  }

  return [global, collection]
}
