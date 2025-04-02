import { User } from "@/payload-types"
import { BasePayload, CollectionSlug, PayloadRequest, SelectType } from "payload"
import type { Options as CreateOptions } from "node_modules/payload/dist/collections/operations/local/create"
import type { Options as FindOptions } from "node_modules/payload/dist/collections/operations/local/find"
import type { Options as FindByIdOptions } from "node_modules/payload/dist/collections/operations/local/findByID"
import type { ByIDOptions as UpdateOptions } from "node_modules/payload/dist/collections/operations/local/update"
import type { ByIDOptions as DeleteOptions } from "node_modules/payload/dist/collections/operations/local/delete"

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
  tid: string | number | undefined,
  user: User,
  selectedSiteId: number
) {
  return payload.update({
    collection: 'users',
    id: user.id,
    data: {
      selectedSiteId
    },
    req: {
      transactionID: tid
    }
  })
}
