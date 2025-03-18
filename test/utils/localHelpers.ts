import { User, Site } from "@/payload-types"
import { BasePayload, CollectionSlug, SelectType } from "payload"
import type { Options as CreateOptions } from "node_modules/payload/dist/collections/operations/local/create"
import type { Options as FindOptions } from "node_modules/payload/dist/collections/operations/local/find"

const siteKey = 'site-key'

// TODO: generalize these functions for other local methods; it's hard to type
export async function create<TSlug extends CollectionSlug, TSelect extends SelectType>(
    payload: BasePayload,
    tid: string | number,
    options: CreateOptions<TSlug, TSelect>,
    user?: User) {
    let localOptions = { ...options, req: { transactionID: tid } }
    if (user) {
        localOptions = { ...localOptions, overrideAccess: false, user }
    }

  return payload.create(localOptions)
}

export async function find<TSlug extends CollectionSlug, TSelect extends SelectType>(
    payload: BasePayload,
    tid: string | number,
    options: FindOptions<TSlug, TSelect>,
    user?: User) {
    let localOptions = { ...options, req: { transactionID: tid } }
    if (user) {
        localOptions = { ...localOptions, overrideAccess: false, user }
    }

  return payload.find(localOptions)
}

export async function setUserSite(
    payload: BasePayload,
    tid: string | number,
    user: User,
    site: Site,
) {
    return payload.create({
        collection: 'payload-preferences',
        data: {
          key: siteKey,
          user: {
            relationTo: 'users',
            value: user.id
          },
          value: site.id
        },
        req: {
          transactionID: tid,
          user: { ...user, collection: 'users' }
        },
      })
}
