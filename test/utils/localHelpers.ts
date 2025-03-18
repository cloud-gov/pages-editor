import { User, Site } from "@/payload-types"
import { BasePayload, CollectionSlug, PayloadRequest, SelectType } from "payload"
import { siteIdHelper } from "@/utilities/idHelper"
import type { Options as CreateOptions } from "node_modules/payload/dist/collections/operations/local/create"
import type { Options as FindOptions } from "node_modules/payload/dist/collections/operations/local/find"
import type { Options as FindByIdOptions } from "node_modules/payload/dist/collections/operations/local/findByID"
import type { ByIDOptions as UpdateOptions } from "node_modules/payload/dist/collections/operations/local/update"
import type { ByIDOptions as DeleteOptions } from "node_modules/payload/dist/collections/operations/local/delete"

const siteKey = 'site-key'

// TODO: generalize these functions for other local methods; it's hard to type
export async function create<TSlug extends CollectionSlug, TSelect extends SelectType>(
    payload: BasePayload,
    tid: string | number | undefined,
    options: CreateOptions<TSlug, TSelect>,
    user?: User) {
    let localOptions = { ...options }
    if (tid) {
       localOptions = { ...localOptions, req: { transactionID: tid } }
    }
    if (user) {
        localOptions = { ...localOptions, overrideAccess: false, user }
    }

  return payload.create(localOptions)
}

export async function find<TSlug extends CollectionSlug, TSelect extends SelectType>(
    payload: BasePayload,
    tid: string | number | undefined,
    options: FindOptions<TSlug, TSelect>,
    user?: User) {
    let localOptions = { ...options }
    if (tid) {
       localOptions = { ...localOptions, req: { transactionID: tid } }
    }
    if (user) {
        localOptions = { ...localOptions, overrideAccess: false, user }
    }

  return payload.find(localOptions)
}

export async function findByID<TSlug extends CollectionSlug, TDisableErrors extends boolean, TSelect extends SelectType>(
  payload: BasePayload,
  tid: string | number | undefined,
  options: FindByIdOptions<TSlug, TDisableErrors, TSelect>,
  user?: User) {
  let localOptions = { ...options }
  if (tid) {
     localOptions = { ...localOptions, req: { transactionID: tid } }
  }
  if (user) {
      localOptions = { ...localOptions, overrideAccess: false, user }
  }

  return payload.findByID(localOptions)
}

export async function update<TSlug extends CollectionSlug, TSelect extends SelectType>(
  payload: BasePayload,
  tid: string | number | undefined,
  options: UpdateOptions<TSlug, TSelect>,
  user?: User) {
  let localOptions = { ...options }
  if (tid) {
     localOptions = { ...localOptions, req: { transactionID: tid } }
  }
  if (user) {
      localOptions = { ...localOptions, overrideAccess: false, user }
  }

  return payload.update(localOptions)
}

export async function del<TSlug extends CollectionSlug, TSelect extends SelectType>(
  payload: BasePayload,
  tid: string | number | undefined,
  options: DeleteOptions<TSlug, TSelect>,
  user?: User) {
  let localOptions = { ...options }
  if (tid) {
     localOptions = { ...localOptions, req: { transactionID: tid } }
  }
  if (user) {
      localOptions = { ...localOptions, overrideAccess: false, user }
  }

  return payload.delete(localOptions)
}

export async function setUserSite(
    payload: BasePayload,
    tid: string | number,
    user: User,
    site: Site | number,
) {

    let req: Partial<PayloadRequest> = {
      user: { ...user, collection: 'users' }
    }

    if (tid) {
      req = { ...req, transactionID: tid }
    }

    const pref = await getUserSitePreference(payload, tid, user)
    const siteId = siteIdHelper(site)

    if (pref) {
      return payload.update({
        collection: 'payload-preferences',
        id: pref.id,
        data: {
          value: siteId
        },
        req
      })
    }

    return payload.create({
        collection: 'payload-preferences',
        data: {
          key: siteKey,
          user: {
            relationTo: 'users',
            value: user.id
          },
          value: siteId
        },
        req
      })
}

export async function getUserSitePreference(
  payload: BasePayload,
  tid: string | number,
  user: User,
) {

  let req: Partial<PayloadRequest> = {
    user: { ...user, collection: 'users' }
  }

  if (tid) {
    req = { ...req, transactionID: tid }
  }

    const pref = await payload.find({
      collection: 'payload-preferences',
      limit: 1,
      where: {
        and: [
          {
            key: {
              equals: siteKey,
            },
          },
          {
            'user.relationTo': {
              equals: 'users',
            },
          },
          {
            'user.value': {
              equals: user.id,
            },
          },
        ],
      },
      req
    })
    return pref.docs[0]
}
