import { User } from '@/payload-types'
import { getUserSiteIds, siteIdHelper } from '@/utilities/idHelper'
import { generateUserInvitationEmailData } from '@/utilities/emailData'

import {
  CollectionBeforeOperationHook,
  CollectionBeforeValidateHook,
  ValidationError,
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
} from 'payload'
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
    // get the site they are invited to, assume it's the first
    const site = await payload.findByID({
      collection: 'sites',
      id: siteIdHelper(doc.sites[0].site),
      req
    })

    // get the invitor information
    const invitor = req.user
    const invitorEmail = invitor?.email || 'pages-support@cloud.gov'
    const invitorName = invitor?.email || 'Site Administrator'

    // get user role for the site
    const userRole = doc.sites[0]?.role || 'user'

    const emailData = generateUserInvitationEmailData(doc.email, site.name, invitorName)

    // Send email if EMAIL_HOST is configured
    if (process.env.EMAIL_HOST) {
      await fetch(`${process.env.EMAIL_HOST}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.EMAIL_USERNAME + ":" + process.env.EMAIL_PASSWORD).toString('base64')
        },
        body: JSON.stringify(emailData)
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
export const ensureSites: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  const { user } = req

  if (!user) return args

  if (!user.isAdmin && operation === 'read') {
    // Check user object to make sure selectedSiteId exists
    // If a user's selectSiteId is for a deleted site, set it to the first site in their sites array
    // This is needed to avoid 403 errors when the selected site is deleted
    if (user.sites.length > 0) {
      const siteExists = user.sites.find((s) => {
        if (typeof s.site === 'number') {
          return s.site === user.selectedSiteId
        }

        return s.site.id === user.selectedSiteId
      })

      if (!siteExists) {
        if (typeof user.sites[0].site === 'number') {
          const selectedSiteId = user.sites[0].site

          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              selectedSiteId,
            },
          })
        } else {
          const selectedSiteId = user.sites[0].site.id

          await req.payload.update({
            collection: 'users',
            id: user.id,
            data: {
              selectedSiteId,
            },
          })
        }
      }
    }
  }

  if (operation === 'create' || operation === 'update') {
    const data = args.data as Partial<User> | undefined
    let sites = data?.sites as User['sites'] | undefined
    const hasNewSites = sites && sites.length > 0

    // with no sites on creation, this is a true error
    if (operation === 'create' && !hasNewSites) {
      throw new ValidationError({
        errors: [
          {
            label: 'Role',
            message: 'User must have at least one role',
            path: 'sites',
          },
        ],
      })
    } else if (!user.isAdmin && hasNewSites) {
      // for every added role by non-admins, add a corresponding site id
      // @ts-ignore
      sites = sites.map((site) => ({ site: user.selectedSiteId, ...site }))
    }
    // always deduplicate sites if present
    if (hasNewSites && data) {
      args['data']['sites'] = deDepulicateSites(sites)
    }
  }

  return args
}

export const testEmailUniqueness: CollectionBeforeChangeHook<User> = async({
  data, originalDoc, req, operation, context
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
    if (match.docs.length && user && data.sites) {
      const existingUser = match.docs[0]
      // for admins, we could end up here via site creation so check the site
      let siteId;
      if (user.isAdmin) {
        siteId = siteIdHelper(data.sites[0].site)
      } else {
        siteId = user.selectedSiteId;
      }
      // if the user matches the current site, this is a true validation error
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
        //  - save the updated user in context for final redirect
      }

      const updatedUser = await payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          sites: [...(data.sites ?? []), ...existingUser.sites]
        },
        req: partialReq
      })

      context.updatedUser = updatedUser

      data.email = `${req.transactionID}@toberemoved.gov`
      data.sites = (data.sites ?? []).map(site => ({ ...site, id: 'temp' }))
    }
  }
  return data
}

export const removeDummyUsers: CollectionAfterChangeHook<User> = async ({
  doc, req, context
}) => {
  if (doc.email.includes('toberemoved')) {
    await req.payload.delete({
      collection: 'users',
      id: doc.id,
      req
    })
    if (context.updatedUser) {
      return context.updatedUser
    }
  }
  return doc
}
