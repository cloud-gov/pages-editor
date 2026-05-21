import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Published Build Status access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Published Build Statuses', async ({ tid, testUser, publishedBuildStatus }) => {
      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'published-build-status',
        },
        testUser,
      )
      expect(foundItems.docs).toHaveLength(publishedBuildStatus.length)
    })

    test('Create a new Published Build Status', async ({ tid, testUser, sites, publishedBuildStatus }) => {

          const newPublishedBuildStatus = await create(
            payload,
            tid,
            {
              collection: 'published-build-status',
              data: {
                completedAt: new Date().toISOString(),
                startedAt:new Date().toISOString(),
                pagesBuildId:4, 
                error:'new error',
                state:'error',
                site: sites[0],
              },
            },
            testUser,
          )

      expect(newPublishedBuildStatus).not.toBeNull()
      expect(newPublishedBuildStatus).not.toBeUndefined()
    })

    test('update Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      const errorMessage = 'this is error message'
      const publishedBuildStatusToUpdate = publishedBuildStatus[0];
      const newPublishedBuildStatus = await update(
            payload,
            tid,
            {
              collection: 'published-build-status',
              id: publishedBuildStatusToUpdate.id,
              data: {
                error: errorMessage,
              },
            },
            testUser,
          )
    
      expect(newPublishedBuildStatus.error).toEqual(errorMessage)
      
    })

    test('delete all Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      await Promise.all(
        publishedBuildStatus.map(async (item) => {
          return del(
            payload,
            tid,
            {
              collection: 'published-build-status',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const foundItems = await find(payload, tid, {
        collection: 'published-build-status',
      })
      expect(foundItems.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'published-build-status',
        },
        testUser,
      )

      const expectedPublishedBuildStatuses = publishedBuildStatus.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedPublishedBuildStatuses.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Published Build Statuses', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const notTheirPublishedBuildStatuses = publishedBuildStatus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirPublishedBuildStatuses.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'published-build-status',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )

    })

    test('not write a Published Build Status to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      await isAccessError(create(
        payload,
        tid,
        {
          collection: 'published-build-status',
          data: {
            completedAt: new Date().toISOString(),
            startedAt:new Date().toISOString(),
            pagesBuildId:4, 
            error:'',
            state:'success',
            site: siteId,
          },
        },
        testUser,
      ));
    })

    test('not write a Published Build Status to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'published-build-status',
                data: {
                  completedAt: new Date().toISOString(),
                  startedAt:new Date().toISOString(),
                  pagesBuildId:4, 
                  error:'',
                  state:'success',
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update their Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const theirPublishedBuildStatus = publishedBuildStatus.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirPublishedBuildStatus.map(async (item) => {
          return  isAccessError(update(
            payload,
            tid,
            {
              collection: 'published-build-status',
              id: item.id,
              data: {
                  completedAt: new Date().toISOString(),
                  startedAt:new Date().toISOString(),
                  pagesBuildId:4, 
                  error:'',
                  state:'success',
              },
            },
            testUser,
          ))
        }),
      )
    })

    test('not update not-their Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const notPublishedBuildStatus = publishedBuildStatus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notPublishedBuildStatus.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'published-build-status',
                id: item.id,
                data: {
                  completedAt: new Date().toISOString(),
                  startedAt:new Date().toISOString(),
                  pagesBuildId:4, 
                  error:'',
                  state:'success',
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete their Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const theirPublishedBuildStatus = publishedBuildStatus.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirPublishedBuildStatus.map((item) => {
          return isAccessError(del(
            payload,
            tid,
            {
              collection: 'published-build-status',
              id: item.id,
            },
            testUser,
          ))
        }),
      )
    })

    test('not delete not-their Published Build Status', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const notPublishedBuildStatus = publishedBuildStatus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notPublishedBuildStatus.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'published-build-status',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Page Menus', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'published-build-status',
        },
        testUser,
      )

      const expectedReports = publishedBuildStatus.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Build Status access', async ({ tid, testUser, publishedBuildStatus }) => {
      const siteId = testUser.selectedSiteId

      const notPublishedBuildStatus = publishedBuildStatus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notPublishedBuildStatus.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'published-build-status',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Build Status access', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'published-build-status',
                data: {
                  completedAt: new Date().toISOString(),
                  startedAt:new Date().toISOString(),
                  pagesBuildId:4, 
                  error:'new error',
                  state:'error',
                  site: sites[0],
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update Build Status access', async ({ tid, testUser, publishedBuildStatus }) => {
      await Promise.all(
        publishedBuildStatus.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'published-build-status',
                id: item.id,
                data: {
                  completedAt: new Date().toISOString(),
                  startedAt:new Date().toISOString(),
                  pagesBuildId:4, 
                  error:'new error',
                  state:'error',
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete Build Status access', async ({ tid, testUser, publishedBuildStatus }) => {
      await Promise.all(
        publishedBuildStatus.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'published-build-status',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })
})
