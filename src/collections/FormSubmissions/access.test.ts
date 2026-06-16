import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import type { CollectionSlug } from 'payload'

const siteFormSubmissionsCollectionName: CollectionSlug =
  'site-form-submissions' as CollectionSlug

describe('SiteSiteFormSubmissions access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const foundSubmissions = await find(
        payload,
        tid,
        {
          collection: siteFormSubmissionsCollectionName,
        },
        testUser,
      )
      expect(foundSubmissions.docs).toHaveLength(siteFormSubmissions.length)
    })

    test('update any SiteFormSubmission', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const newSubmissions = await Promise.all(
        siteFormSubmissions.map(async (submission) => {
          return update(
            payload,
            tid,
            {
              collection: siteFormSubmissionsCollectionName,
              id: submission.id,
              data: {
                status: 'reviewed',
              },
            },
            testUser,
          )
        }),
      )

      newSubmissions.forEach((submission) => {
        expect(submission.status).toBe('reviewed')
      })
    })

    test('delete any SiteFormSubmission', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      await Promise.all(
        siteFormSubmissions.map(async (submission) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormSubmissionsCollectionName,
              id: submission.id,
            },
            testUser,
          )
        }),
      )

      const foundSubmissions = await find(payload, tid, {
        collection: siteFormSubmissionsCollectionName,
      })
      expect(foundSubmissions.docs.length).toBe(0)
    })
  })

  describe('site managers can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

    test('read their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const foundSubmissions = await find(
        payload,
        tid,
        {
          collection: siteFormSubmissionsCollectionName,
        },
        testUser,
      )

      const expectedSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === siteId,
      )

      expect(foundSubmissions.docs).toHaveLength(expectedSubmissions.length)
      foundSubmissions.docs.forEach((submission) => {
        expect(siteIdHelper(submission.site)).toBe(siteId)
      })
    })

    test('not read not-their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) !== siteId,
      )

      await Promise.all(
        notTheirSubmissions.map(async (submission) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const theirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === siteId,
      )

      const newSubmissions = await Promise.all(
        theirSubmissions.map(async (submission) => {
          return update(
            payload,
            tid,
            {
              collection: siteFormSubmissionsCollectionName,
              id: submission.id,
              data: {
                status: 'reviewed',
                notes: 'Reviewed by manager',
              },
            },
            testUser,
          )
        }),
      )

      newSubmissions.forEach((submission) => {
        expect(submission.status).toBe('reviewed')
        expect(submission.notes).toBe('Reviewed by manager')
      })
    })

    test('not update not-their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) !== siteId,
      )

      await Promise.all(
        notTheirSubmissions.map(async (submission) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
                data: {
                  status: 'reviewed',
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const theirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === siteId,
      )

      await Promise.all(
        theirSubmissions.map((submission) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormSubmissionsCollectionName,
              id: submission.id,
            },
            testUser,
          )
        }),
      )

      const foundSubmissions = await find(payload, tid, {
        collection: siteFormSubmissionsCollectionName,
      })
      expect(foundSubmissions.docs.length).toBe(
        siteFormSubmissions.length - theirSubmissions.length,
      )
    })

    test('not delete not-their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) !== siteId,
      )

      await Promise.all(
        notTheirSubmissions.map(async (submission) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })

  describe('site users can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

    test('read their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const foundSubmissions = await find(
        payload,
        tid,
        {
          collection: siteFormSubmissionsCollectionName,
        },
        testUser,
      )

      const expectedSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === siteId,
      )

      expect(foundSubmissions.docs).toHaveLength(expectedSubmissions.length)
      foundSubmissions.docs.forEach((submission) => {
        expect(siteIdHelper(submission.site)).toBe(siteId)
      })
    })

    test('not read not-their SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) !== siteId,
      )

      await Promise.all(
        notTheirSubmissions.map(async (submission) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      await Promise.all(
        siteFormSubmissions.map(async (submission) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
                data: {
                  status: 'reviewed',
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      await Promise.all(
        siteFormSubmissions.map(async (submission) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })

  describe('site users with multiple sites can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

    const addSiteToUser = async (user, tid, site) => {
      return update(payload, tid, {
        collection: 'users',
        id: user.id,
        data: {
          sites: [...user.sites, site],
        },
      })
    }

    test('read all their SiteFormSubmissions, upon site selection', async ({
      tid,
      testUser,
      siteFormSubmissions,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      let foundSubmissions = await find(
        payload,
        tid,
        {
          collection: siteFormSubmissionsCollectionName,
        },
        testUser,
      )

      let expectedSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === siteId,
      )

      expect(foundSubmissions.docs).toHaveLength(expectedSubmissions.length)
      foundSubmissions.docs.forEach((submission) => {
        expect(siteIdHelper(submission.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundSubmissions = await find(
        payload,
        tid,
        {
          collection: siteFormSubmissionsCollectionName,
        },
        testUser,
      )

      expectedSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === newSiteId,
      )

      expect(foundSubmissions.docs).toHaveLength(expectedSubmissions.length)
      foundSubmissions.docs.forEach((submission) => {
        expect(siteIdHelper(submission.site)).toBe(newSiteId)
      })
    })

    test('delete a SiteFormSubmission for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      siteFormSubmissions,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === siteId,
      )

      await Promise.all(
        theirSubmissions.map((submission) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormSubmissionsCollectionName,
              id: submission.id,
            },
            testUser,
          )
        }),
      )

      let foundSubmissions = await find(payload, tid, {
        collection: siteFormSubmissionsCollectionName,
      })
      expect(foundSubmissions.docs.length).toBe(
        siteFormSubmissions.length - theirSubmissions.length,
      )

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreSubmissions = siteFormSubmissions.filter(
        (submission) => siteIdHelper(submission.site) === newSiteId,
      )

      await Promise.all(
        moreSubmissions.map((submission) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormSubmissionsCollectionName,
              id: submission.id,
            },
            testUser,
          )
        }),
      )

      foundSubmissions = await find(payload, tid, {
        collection: siteFormSubmissionsCollectionName,
      })
      expect(foundSubmissions.docs.length).toBe(
        siteFormSubmissions.length - theirSubmissions.length - moreSubmissions.length,
      )
    })
  })

  describe('public API can...', async () => {
    // Note: The create: () => true access allows unauthenticated submissions
    // This is tested at the API/endpoint level rather than here since
    // the test utilities require authenticated users
  })

  describe('bots cannot...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('not read SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      // Bots are not included in the read access roles ['manager', 'user']
      // so they get a Forbidden error
      await isAccessError(
        find(
          payload,
          tid,
          {
            collection: siteFormSubmissionsCollectionName,
          },
          testUser,
        ),
      )
    })

    test('not update SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      await Promise.all(
        siteFormSubmissions.map(async (submission) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
                data: {
                  status: 'reviewed',
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete SiteFormSubmissions', async ({
      tid,
      testUser,
      siteFormSubmissions,
    }) => {
      await Promise.all(
        siteFormSubmissions.map(async (submission) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: siteFormSubmissionsCollectionName,
                id: submission.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })
})
