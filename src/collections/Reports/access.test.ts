import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Reports access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Reports', async ({ tid, testUser, reports }) => {
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

    test('write a Reports to any site', async ({ tid, testUser, sites }) => {
      const newReports = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'reports',
              data: {
                title: `${site.name} - Title`,
                subtitle: `${site.name} - Subtitle`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newReports).toHaveLength(sites.length)
    })

    test('update any Reports', async ({ tid, testUser, reports }) => {
      const newReports = await Promise.all(
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

      newReports.forEach((report) => {
        expect(report.title).toContain('Edited')
      })
    })

    test('delete any Reports', async ({ tid, testUser, reports }) => {
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

    test('read their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )

      const expectedReports = reports.filter((report) => siteIdHelper(report.site) === siteId)

      expect(foundCategories.docs).toHaveLength(expectedReports.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(siteId)
      })
    })

    test('not read not-their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirReports = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirReports.map(async (report) => {
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

    test('write a Reports to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newReport = await create(
        payload,
        tid,
        {
          collection: 'reports',
          data: {
            title: `Reports Title - ${siteId}`,
            subtitle: `Subtitle - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newReport).toBeTruthy()
    })

    test('not write a Reports to not-their site', async ({ tid, testUser, sites }) => {
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
                  subtitle: `${site.name} - Subtitle`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const theirReports = reports.filter((report) => siteIdHelper(report.site) === siteId)

      const newReports = await Promise.all(
        theirReports.map(async (report) => {
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

      newReports.forEach((report) => {
        expect(report.title).toContain('Edited')
      })
    })

    test('not update not-their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirReports = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirReports.map(async (report) => {
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

    test('delete their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const theirReports = reports.filter((report) => siteIdHelper(report.site) === siteId)

      await Promise.all(
        theirReports.map((report) => {
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
      expect(foundCategories.docs.length).toBe(reports.length - theirReports.length)
    })

    test('not delete not-their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirReports = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirReports.map(async (report) => {
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

    test('read all their Reports, upon site selection', async ({
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

      let expectedReports = reports.filter((report) => siteIdHelper(report.site) === siteId)

      expect(foundCategories.docs).toHaveLength(expectedReports.length)
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

      expectedReports = reports.filter((report) => siteIdHelper(report.site) === newSiteId)

      expect(foundCategories.docs).toHaveLength(expectedReports.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(newSiteId)
      })
    })

    test('create a Reports for all their sites, upon site selection', async ({
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
            title: `Reports Title - ${siteId}`,
            subtitle: `Subtitle - ${siteId}`,
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
            title: `Reports Title - ${newSiteId}`,
            subtitle: `Subtitle - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newReport.site)).toBe(newSiteId)
    })

    test('delete a Reports for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      reports,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirReports = reports.filter((report) => siteIdHelper(report.site) === siteId)

      await Promise.all(
        theirReports.map((report) => {
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
      expect(foundCategories.docs.length).toBe(reports.length - theirReports.length)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreReports = reports.filter((report) => siteIdHelper(report.site) === newSiteId)

      await Promise.all(
        moreReports.map((report) => {
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
      expect(foundCategories.docs.length).toBe(reports.length - theirReports.length - moreReports.length)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const foundCategories = await find(
        payload,
        tid,
        {
          collection: 'reports',
        },
        testUser,
      )

      const expectedReports = reports.filter((report) => siteIdHelper(report.site) === siteId)

      expect(foundCategories.docs).toHaveLength(expectedReports.length)
      foundCategories.docs.forEach((report) => {
        expect(siteIdHelper(report.site)).toBe(siteId)
      })
    })

    test('not read not-their Reports', async ({ tid, testUser, reports }) => {
      const siteId = testUser.selectedSiteId

      const notTheirReports = reports.filter((report) => siteIdHelper(report.site) !== siteId)

      await Promise.all(
        notTheirReports.map(async (report) => {
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

    test('not write a Reports', async ({ tid, testUser, sites }) => {
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
                  subtitle: `${site.name} - Subtitle`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update Reports', async ({ tid, testUser, reports }) => {
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

    test('not delete Reports', async ({ tid, testUser, reports }) => {
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
