import { User } from '@/payload-types'
import { getUserSiteIds, siteIdHelper } from '@/utilities/idHelper'
// import { redirect } from 'next/navigation'
import { CollectionAfterLogoutHook, CollectionBeforeOperationHook, CollectionBeforeValidateHook, ValidationError, CollectionAfterChangeHook, FieldHook, CollectionBeforeChangeHook, CollectionAfterOperationHook } from 'payload'
import { v4 as uuidv4 } from 'uuid'

// deduplicate sites, prioritizing the 'higher' role
// TODO: test this
function deDepulicateSites (sites) {
  const siteIndices = new Map()
  return sites.reduce((acc, elem) => {
    // check previously stored versions of this site
    const siteId = siteIdHelper(elem.site)
    let { index, role } = siteIndices.get(siteId) ?? { index: false, role: false }
    if (index === false) {
      siteIndices.set(siteId, { index: acc.length, role: elem.role })
      return [...acc, elem]
      // ignore bots for now
    } else if (elem.role === 'manager' && role === 'user') {
      siteIndices.set(siteId, { index, role: elem.role })
      const newArray = acc.slice()
      newArray.splice(index, 1, elem)
      return newArray
    }
    return acc
  }, [] as typeof sites)
}

export const userEmail: CollectionAfterChangeHook<User> = async ({
  doc, req, operation
}) => {
  const { payload } = req
  if (operation === 'create') {
    // email the user
    // TODO: mock a local endpoint
    if (process.env.EMAIL_HOST) {
      // get the site they are invited to, assume it's the first
      const site = await payload.findByID({
        collection: 'sites',
        id: siteIdHelper(doc.sites[0].site),
        req
      })

      await fetch(`${process.env.EMAIL_HOST}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.EMAIL_USERNAME + ":" + process.env.EMAIL_PASSWORD).toString('base64')
        },
        body: JSON.stringify({
          to: doc.email,
          subject: `You have been invited to join ${site.name} on Pages Editor`,
          html: 'add some email template here'
        })
      })
    }
  }
  return doc
}

export const addSub: CollectionBeforeValidateHook<User> = async ({
  data, operation
}) => {
  if (operation === 'create' && data) {
    data.sub = uuidv4()
  }
  return data
}

export const addSelectedSiteId: CollectionBeforeValidateHook<User> = async ({
  data, operation
}) => {
  if (operation === 'create' && data?.sites) {
    data.selectedSiteId = siteIdHelper(data.sites[0].site)
  }
  return data
}

// ensureSites is called pre-operation (rather than pre-validation)
// because the sites array is used in access controls checked for
// creation of the object
export const ensureSites: CollectionBeforeOperationHook = async ({
  args, operation, req,
}) => {
  const { user } = req;
  if (!user) return args
  if (operation === 'create' || operation === 'update') {
    let { data: { sites } } : { data: { sites: User["sites"] }} = args;
    const hasNewSites = sites && sites.length > 0

    // with no sites on creation, this is a true error
    if (operation === 'create' && !hasNewSites) {
      throw new ValidationError({
        errors: [{
          label: 'Role',
          message: 'User must have at least one role',
          path: 'sites',
        }]
      })
    } else if (!user.isAdmin && hasNewSites) {
      // for every added role by non-admins, add a corresponding site id
      // @ts-ignore
      sites = sites.map(site => ({ site: user.selectedSiteId, ...site }))
    }
    // always deduplicate sites if present
    if (hasNewSites) {
      args.data.sites = deDepulicateSites(sites)
    }
  }

  return args
}

export const testEmailUniqueness: CollectionBeforeChangeHook<User> = async({
  data, originalDoc, req, operation
}) => {
  const { payload, user } = req
  if (!data.email) return data
  if (operation === 'create' || operation == 'update') {
    // if email is unchanged, skip validation
    if (originalDoc?.email === data.email) {
      return data
    }

    // this particular validation should be part of the same transaction
    // but not the same full request because it needs broader permissions
    // than the individual user
    const partialReq = { transactionID: req.transactionID }

    const match = await payload.find({
      collection: 'users',
      depth: 2,
      where: {
        email: {
          equals: data.email
        }
      },
      req: partialReq
    })
    if (match.docs.length && user) {
      const existingUser = match.docs[0]
      if (existingUser && user.isAdmin) {
        throw new ValidationError({
          errors: [{
            message: `User with email ${data.email} exists.`,
            path: 'email',
          }]
        })
      }
      // if the user matches the current site, this is a true validation error
      const siteId = user.selectedSiteId;
      if (siteId && getUserSiteIds(existingUser).includes(siteId)) {
        throw new ValidationError({
          errors: [{
            message: `User with email ${data.email} exists for this site`,
            path: 'email',
          }]
        })
      // until https://github.com/payloadcms/payload/discussions/11943
      // if the user exists but on another site:
      //  - pass data to create a new dummy user (so this operation "succeeds")
      //  - update the existing user
      }

      const update = await payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          sites: [...(data.sites ?? []), ...existingUser.sites]
        },
        req: partialReq
      })

      data.email = `${req.transactionID}@toberemoved.gov`
      data.sites = (data.sites ?? []).map(site => ({ ...site, id: 'temp' }))
    }
  }
  return data
}

export const removeDummyUsers: CollectionAfterChangeHook<User> = async ({
  doc, req,
}) => {
  if (doc.email.includes('toberemoved')) {
    return req.payload.delete({
      collection: 'users',
      id: doc.id,
      req
    })
  }
  return doc
}
