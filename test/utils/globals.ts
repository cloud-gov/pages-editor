import { BasePayload, getPayload, Payload } from 'payload'
import config from '@payload-config'
import { expect, it } from 'vitest'

interface User {
  id: string
  email: string
  isAdmin: boolean
  selectedSiteId: number
  sites: { site: number; role: string }[]
}
interface AdminUser {
  id: string;
  email: string;
  isAdmin: boolean
}
interface Users {
  adminUser: AdminUser,
  managerUser: User,
  normalUser: User,
  botUser: User,
}

export function initGlobalTest(): Users {
  // Example "site" id used by non-admin users
  const siteId = 1

  // Minimal user shapes that your access function expects
  const adminUser = {
    id: 'admin-1',
    email: 'admin@example.com',
    isAdmin: true,
  }

  const managerUser = {
    id: 'manager-1',
    email: 'manager@example.com',
    isAdmin: false,
    selectedSiteId: siteId,
    sites: [{ site: siteId, role: 'manager' }],
  }

  const normalUser = {
    id: 'user-1',
    email: 'user@example.com',
    isAdmin: false,
    selectedSiteId: siteId,
    sites: [{ site: siteId, role: 'user' }],
  }

  const botUser = {
    id: 'bot-1',
    email: 'bot@example.com',
    isAdmin: false,
    selectedSiteId: siteId,
    sites: [{ site: siteId, role: 'bot' }],
  }
  return { adminUser, managerUser, normalUser, botUser }
}

export async function globalBeforeAll(
  payload: BasePayload,
  users,
  globalName,
  globalCollectionName,
  optionsNew,
  optionsUpdated,
) {
  payload = await getPayload({ config })

  // Create a valid site entry to reference
  const site = await payload.create({
    collection: 'sites',
    data: {
      name: 'Test Site' + globalName,
      slug: 'test-site',
      initialManagerEmail: 'test-manager@example.com',
      pagesSiteId: 123,
      orgId: 456,
      bucket: 'test-bucket',
      pagesOrg: 'Test Org',
    },
    overrideAccess: true,
  })

  const siteId = site.id // This is now a valid DB ID

  await payload.create({
    collection: globalCollectionName,
    data: {
      ...optionsNew,
      site: siteId,
    },
  })

  // Update users to use the real siteId
  // adminUser.selectedSiteId = siteId;
  users.managerUser.selectedSiteId = siteId
  users.managerUser.sites = [{ site: siteId, role: 'manager' }]
  users.normalUser.selectedSiteId = siteId
  users.normalUser.sites = [{ site: siteId, role: 'user' }]
  users.botUser.selectedSiteId = siteId
  users.botUser.sites = [{ site: siteId, role: 'bot' }]

  // Seed a known SiteConfig document
  await payload.updateGlobal({
    slug: globalName,
    data: {
      ...optionsUpdated,
    },
    user: users.adminUser,
    overrideAccess: true,
  })
  return payload
}

export function testRead(slug, field, users) {
  return () => {
    it('manager can read', async () => {
      const doc = await payload.findGlobal({
        slug: slug,
        overrideAccess: false,
        user: users.managerUser,
      })
      expect(doc[field]).toBeDefined()
    })

    it('user can read', async () => {
      const doc = await payload.findGlobal({
        slug: slug,
        overrideAccess: false,
        user: users.normalUser,
      })
      expect(doc[field]).toBeDefined()
    })

    it('bot can read (allowed by `read` roles)', async () => {
      const doc = await payload.findGlobal({
        slug: slug,
        overrideAccess: false,
        user: users.botUser,
      })
      expect(doc[field]).toBeDefined()
    })

    it('unauthenticated cannot read', async () => {
      await expect(
        payload.findGlobal({
          slug: slug,
          overrideAccess: false,
          // no user → should be denied by your helper
        }),
      ).rejects.toThrow()
    })
  }
}

export function testUpdate(slug, field, options, users) {
  return () => {
    it('admin can update', async () => {
      const updated = await payload.updateGlobal({
        slug: slug,
        overrideAccess: false,
        user: users.adminUser,
        data: {
          ...options,
          [field]: 'Admin Updated',
        },
      })
      expect(updated[field]).toBe('Admin Updated')
    })

    it('manager can update', async () => {
      const updated = await payload.updateGlobal({
        slug: slug,
        overrideAccess: false,
        user: users.managerUser,
        data: {
          ...options,
          [field]: 'Manager Updated',
        },
      })
      expect(updated[field]).toBe('Manager Updated')
    })

    it('user can update (no drafts/publish constraint)', async () => {
      // With drafts disabled, _status is not present—so your helper allows update.
      const updated = await payload.updateGlobal({
        slug: slug,
        overrideAccess: false,
        user: users.normalUser,
        data: {
          ...options,
          [field]: 'User Updated',
        },
      })
      expect(updated[field]).toBe('User Updated')
    })

    it('bot cannot update (bot not in default update roles)', async () => {
      await expect(
        payload.updateGlobal({
          slug: slug,
          overrideAccess: false,
          user: users.botUser,
          data: {
            ...options,
            [field]: 'Bot Try',
          },
        }),
      ).rejects.toThrow()
    })

    it('unauthenticated cannot update', async () => {
      await expect(
        payload.updateGlobal({
          slug: slug,
          overrideAccess: false,
          data: {
            ...options,
            [field]: 'Anon Try',
          },
        }),
      ).rejects.toThrow()
    })
  }
}
