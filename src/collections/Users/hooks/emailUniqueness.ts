import { type FieldHook, ValidationError } from "payload"
import type { User, Site } from "@/payload-types"
import { getSiteId } from "@/access/preferenceHelper"

export const ensureEmailUniqueness: FieldHook<User> = async({
  data, originalDoc, req: { payload, user }, value, operation
}) => {
  if (operation === 'create' || operation == 'update')
  // if value is unchanged, skip validation
  if (originalDoc?.email === value) {
    return value
  }

  const match = await payload.find({
    collection: 'users',
    depth: 2,
    where: {
      email: {
        equals: value
      }
    }
  })
  if (match.docs.length && user ) {
    const existingUser = match.docs[0]
    if (existingUser && user.isAdmin) {
      throw new ValidationError({
        errors: [{
          message: `User with email ${value} exists.`,
          path: 'email',
        }]
      })
    }
    // if the user matches the current site, this is a true validation error
    // if the user exists but on another site, treat this essentially like a new user
    const siteId = await getSiteId(payload, user.id)
    if (siteId && existingUser.sites.map(s => (s.site as Site).id).includes(siteId)) {
      throw new ValidationError({
        errors: [{
          message: `User with email ${value} exists for this site`,
          path: 'email',
        }]
      })
    } else if (data) {
      await payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          sites: (data?.sites || []).concat(existingUser.sites)
        }
      })
      return false
    }
  }
  return value
}
