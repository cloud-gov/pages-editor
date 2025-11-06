import { expect, describe, beforeAll, it } from 'vitest'
import { find, update } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import { CollectionSlug } from 'payload'

import { getPayload } from 'payload'
import type { Payload } from 'payload'
import config from '@payload-config'

describe('SiteConfig global access', () => {
  let payload: Payload

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

  beforeAll(async () => {
    payload = await getPayload({ config });

    // Create a valid site entry to reference
    const site = await payload.create({
      collection: 'sites',
      data: {
        name: 'Test Site',
        slug: 'test-site',
        initialManagerEmail: 'test-manager@example.com',
        pagesSiteId: 123,
        orgId: 456,
        bucket: 'test-bucket',
        pagesOrg: 'Test Org',
      },
      overrideAccess: true,
    });

    const siteId = site.id; // This is now a valid DB ID

    await payload.create({
      collection: 'site-config-site-collection',
      data: {
        agencyName: 'Test Site Config',
        site: siteId,
      }
    })

    // Update users to use the real siteId
    // adminUser.selectedSiteId = siteId;
    managerUser.selectedSiteId = siteId;
    managerUser.sites = [{ site: siteId, role: 'manager' }];
    normalUser.selectedSiteId = siteId;
    normalUser.sites = [{ site: siteId, role: 'user' }];
    botUser.selectedSiteId = siteId;
    botUser.sites = [{ site: siteId, role: 'bot' }];

    // Seed a known SiteConfig document
    await payload.updateGlobal({
      slug: 'site-config',
      data: {
        agencyName: 'Seed Agency',
        tagline: 'Hello world',
      },
      user: adminUser,
      overrideAccess: true,
    });
  });

  describe('read', () => {
    it('manager can read', async () => {
      const doc = await payload.findGlobal({
        slug: 'site-config',
        overrideAccess: false,
        user: managerUser,
      })
      expect(doc.agencyName).toBeDefined()
    })

    it('user can read', async () => {
      const doc = await payload.findGlobal({
        slug: 'site-config',
        overrideAccess: false,
        user: normalUser,
      })
      expect(doc.agencyName).toBeDefined()
    })

    it('bot can read (allowed by `read` roles)', async () => {
      const doc = await payload.findGlobal({
        slug: 'site-config',
        overrideAccess: false,
        user: botUser,
      })
      expect(doc.agencyName).toBeDefined()
    })

    it('unauthenticated cannot read', async () => {
      await expect(
        payload.findGlobal({
          slug: 'site-config',
          overrideAccess: false,
          // no user → should be denied by your helper
        }),
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('admin can update', async () => {
      const updated = await payload.updateGlobal({
        slug: 'site-config',
        overrideAccess: false,
        user: adminUser,
        data: { agencyName: 'Admin Updated' },
      })
      expect(updated.agencyName).toBe('Admin Updated')
    })

    it('manager can update', async () => {
      const updated = await payload.updateGlobal({
        slug: 'site-config',
        overrideAccess: false,
        user: managerUser,
        data: { agencyName: 'Manager Updated' },
      })
      expect(updated.agencyName).toBe('Manager Updated')
    })

    it('user can update (no drafts/publish constraint)', async () => {
      // With drafts disabled, _status is not present—so your helper allows update.
      const updated = await payload.updateGlobal({
        slug: 'site-config',
        overrideAccess: false,
        user: normalUser,
        data: { agencyName: 'User Updated' },
      })
      expect(updated.agencyName).toBe('User Updated')
    })

    it('bot cannot update (bot not in default update roles)', async () => {
      await expect(
        payload.updateGlobal({
          slug: 'site-config',
          overrideAccess: false,
          user: botUser,
          data: { agencyName: 'Bot Try' },
        }),
      ).rejects.toThrow()
    })

    it('unauthenticated cannot update', async () => {
      await expect(
        payload.updateGlobal({
          slug: 'site-config',
          overrideAccess: false,
          data: { agencyName: 'Anon Try' },
        }),
      ).rejects.toThrow()
    })
  })
})
