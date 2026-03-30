import { expect, describe } from 'vitest'
import { create, find, update } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { CollectionSlug } from 'payload'
import { SiteAuthSiteCollection } from '@/payload-types'
import { siteAuthItemFieldsPick } from '@test/utils/globals'

const siteAuthCollection: CollectionSlug = 'site-auth-site-collection' as CollectionSlug

describe('SiteAuth access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all SiteAuth', async ({ tid, testUser, siteAuthSiteCollection }) => {
      const siteAuths = await find(
        payload,
        tid,
        {
          collection: siteAuthCollection,
        },
        testUser,
      )
      expect(siteAuths.docs).toHaveLength(siteAuthSiteCollection.length)
    })

    test('write a SiteAuth to any site', async ({ tid, testUser, sites }) => {
      const newSiteAuths = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: siteAuthCollection,
              data: {
                ...siteAuthItemFieldsPick(),
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newSiteAuths).toHaveLength(sites.length)
    })

    test('update any SiteAuth', async ({ tid, testUser, siteAuthSiteCollection }) => {
      const updatedSiteAuth = (await Promise.all(
        siteAuthSiteCollection.map(async (siteAuth) => {
          return update(
            payload,
            tid,
            {
              collection: siteAuthCollection,
              id: siteAuth.id,
              data: {
                websiteInfo: {
                  ...siteAuth.websiteInfo,
                  siteName: `${siteAuth?.websiteInfo?.siteName} (Edited)`,
                },
              },
            },
            testUser,
          )
        }),
      )) as SiteAuthSiteCollection[]

      updatedSiteAuth.forEach((siteAuth) => {
        expect(siteAuth?.websiteInfo?.siteName).toContain('Edited')
      })
    })
  })

  describe('managers can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

    test('read SiteAuth for their site', async ({
      tid,
      sites,
      testUser,
      siteAuthSiteCollection,
    }) => {
      const siteAuths = await find(
        payload,
        tid,
        {
          collection: siteAuthCollection,
          where: {
            site: {
              equals: sites[1].id,
            },
          },
        },
        testUser,
      )

      expect(siteAuths.docs).toHaveLength(1)
      expect(siteAuths.docs[0].id).toBe(siteAuthSiteCollection[1].id)
    })

    test('write a SiteAuth to their site', async ({ tid, testUser, siteAuthSiteCollection }) => {
      const siteAuthRecord = siteAuthSiteCollection[0]

      const siteAuth = (await update(
        payload,
        tid,
        {
          collection: siteAuthCollection,
          id: siteAuthRecord.id,
          data: {
            websiteInfo: {
              ...siteAuthRecord.websiteInfo,
              siteName: `${siteAuthRecord?.websiteInfo?.siteName} (Edited)`,
            },
          },
        },
        testUser,
      )) as SiteAuthSiteCollection

      expect(siteAuth?.websiteInfo?.siteName).toContain('Edited')
    })
  })

  describe('users cannot...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

    test('read any SiteAuth', async ({ tid, sites, testUser }) => {
      for (const site of sites) {
        await expect(
          find(
            payload,
            tid,
            {
              collection: siteAuthCollection,
              where: { site: { equals: site.id } },
            },
            testUser,
          ),
        ).rejects.toThrow()
      }
    })

    test('write a SiteAuth to any site', async ({ tid, testUser, sites }) => {
      for (const site of sites) {
        await expect(
          create(
            payload,
            tid,
            {
              collection: siteAuthCollection,
              data: {
                ...siteAuthItemFieldsPick(),
                site,
              },
            },
            testUser,
          ),
        ).rejects.toThrow()
      }
    })
  })
})
