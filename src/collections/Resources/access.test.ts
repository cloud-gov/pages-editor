import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Resources access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Resources', async ({ tid, testUser, reports }) => {
      const foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )
      expect(foundCategories.docs).toHaveLength(reports.length)
    })

    test('write a Resources to any site', async ({ tid, testUser, sites }) => {
      const newResources = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'reports',
              data: {
                title: `${site.name} - Title`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newResources).toHaveLength(sites.length)
    })

    test('update any Resources', async ({ tid, testUser, reports }) => {
      const newResources = await Promise.all(
        reports.map(async (report) => {
          return update(
            payload,
            tid,
            {
              collection: 'reports',
              id: report.id,
              data: {
                title: `${report.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newResources.forEach((report) => {
        expect(report.title).toContain('Edited')
      })
    })

    test('delete any Resources', async ({ tid, testUser, reports }) => {
      await Promise.all(
        reports.map(async (report) => {
          return del(
            payload,
            tid,
            {
              collection: 'reports',
              id: report.id,
            },
            testUser,
          )
        }),
      )

      const foundCategories = await find(payload, tid, {
        collection: 'reports',
      })
      expect(foundCategories.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )

      const expectedResources = reports.filter((report) => siteIdHelper(report.site) === siteId)

      expect(foundCategories.docs).toHaveLength(expectedResources.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(siteId)
      })
    })

    test('not read not-their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResources = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirResources.map(async (report) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'reports',
                id: report.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a Resources to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newReport = await create(
        payload,
        tid,
        {
          collection: 'reports',
          data: {
            title: `Resources Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newReport).toBeTruthy()
    })

    test('not write a Resources to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'reports',
                data: {
                  title: `${site.name} - Title`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const theirResources = reports.filter((report) => siteIdHelper(report.site) === siteId)

      const newResources = await Promise.all(
        theirResources.map(async (report) => {
          return update(
            payload,
            tid,
            {
              collection: 'reports',
              id: report.id,
              data: {
                title: `${report.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newResources.forEach((report) => {
        expect(report.title).toContain('Edited')
      })
    })

    test('not update not-their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResources = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirResources.map(async (report) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'reports',
                id: report.id,
                data: {
                  title: `${report.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const theirResources = reports.filter((report) => siteIdHelper(report.site) === siteId)

      await Promise.all(
        theirResources.map((report) => {
          return del(
            payload,
            tid,
            {
              collection: 'reports',
              id: report.id,
            },
            testUser,
          )
        }),
      )

      const foundCategories = await find(payload, tid, {
        collection: 'reports',
      })
      expect(foundCategories.docs.length).toBe(reports.length - theirResources.length)
    })

    test('not delete not-their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResources = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirResources.map(async (report) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'reports',
                id: report.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })

  describe('site users with multiple sites can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

    const addSiteToUser = async (user, tid, site) => {
      return update(payload, tid, {
        collection: 'users',
        id: user.id,
        data: {
          sites: [...user.sites, site],
        },
      })
    }

    test('read all their Resources, upon site selection', async ({
      tid,
      testUser,
      reports,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )

      let expectedResources = reports.filter((report) => siteIdHelper(report.site) === siteId)

      expect(foundCategories.docs).toHaveLength(expectedResources.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )

      expectedResources = reports.filter((report) => siteIdHelper(report.site) === newSiteId)

      expect(foundCategories.docs).toHaveLength(expectedResources.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(newSiteId)
      })
    })

    test('create a Resources for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      let newReport = await create(
        payload,
        tid,
        {
          collection: 'reports',
          data: {
            title: `Resources Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newReport).toBeTruthy()
      expect(siteIdHelper(newReport.site)).toBe(siteId)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      newReport = await create(
        payload,
        tid,
        {
          collection: 'reports',
          data: {
            title: `Resources Title - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newReport.site)).toBe(newSiteId)
    })

    test('delete a Resources for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      reports,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirResources = reports.filter((report) => siteIdHelper(report.site) === siteId)

      await Promise.all(
        theirResources.map((report) => {
          return del(
            payload,
            tid,
            {
              collection: 'reports',
              id: report.id,
            },
            testUser,
          )
        }),
      )

      let foundCategories = await find(payload, tid, {
        collection: 'reports',
      })
      expect(foundCategories.docs.length).toBe(reports.length - theirResources.length)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreResources = reports.filter((report) => siteIdHelper(report.site) === newSiteId)

      await Promise.all(
        moreResources.map((report) => {
          return del(
            payload,
            tid,
            {
              collection: 'reports',
              id: report.id,
            },
            testUser,
          )
        }),
      )

      foundCategories = await find(payload, tid, {
        collection: 'reports',
      })
      expect(foundCategories.docs.length).toBe(reports.length - theirResources.length - moreResources.length)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )

      const expectedResources = reports.filter((report) => siteIdHelper(report.site) === siteId)

      expect(foundCategories.docs).toHaveLength(expectedResources.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(siteId)
      })
    })

    test('not read not-their Resources', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResources = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirResources.map(async (report) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'reports',
                id: report.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Resources', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'reports',
                data: {
                  title: `${site.name} - Title`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update Resources', async ({ tid, testUser, reports }) => {
      await Promise.all(
        reports.map(async (report) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'reports',
                id: report.id,
                data: {
                  title: `${report.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete Resources', async ({ tid, testUser, reports }) => {
      await Promise.all(
        reports.map(async (report) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'reports',
                id: report.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })
})
