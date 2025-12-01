import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Side Navigation access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'side-navigation',
        },
        testUser,
      )
      expect(foundItems.docs).toHaveLength(sideNavigations.length)
    })

    test('write a Side Navigation to any site', async ({ tid, testUser, sites }) => {
      const newReports = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'side-navigation',
              data: {
                title: `${site.name} - Title`,
                name: `${site.name} - Name`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newReports).toHaveLength(sites.length)
    })

    test('update any Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      const newReports = await Promise.all(
        sideNavigations.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'side-navigation',
              id: item.id,
              data: {
                title: `${item.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newReports.forEach((item) => {
        expect(item.title).toContain('Edited')
      })
    })

    test('delete any Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      await Promise.all(
        sideNavigations.map(async (item) => {
          return del(
            payload,
            tid,
            {
              collection: 'side-navigation',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const foundItems = await find(payload, tid, {
        collection: 'side-navigation',
      })
      expect(foundItems.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Page Menus', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'side-navigation',
        },
        testUser,
      )

      const expectedReports = sideNavigations.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Page Menus', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSideNavigations = sideNavigations.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirSideNavigations.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'side-navigation',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a Side Navigation to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newReport = await create(
        payload,
        tid,
        {
          collection: 'side-navigation',
          data: {
            title: `Side Navigation Title - ${siteId}`,
            name: `Side Navigation Name - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newReport).toBeTruthy()
    })

    test('not write a Side Navigation to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'side-navigation',
                data: {
                  title: `${site.name} - Title`,
                  name: `${site.name} - Name`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const theirReports = sideNavigations.filter((item) => siteIdHelper(item.site) === siteId)

      const newReports = await Promise.all(
        theirReports.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'side-navigation',
              id: item.id,
              data: {
                title: `${item.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newReports.forEach((item) => {
        expect(item.title).toContain('Edited')
      })
    })

    test('not update not-their Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSideNavigations = sideNavigations.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirSideNavigations.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'side-navigation',
                id: item.id,
                data: {
                  title: `${item.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const theirReports = sideNavigations.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirReports.map((item) => {
          return del(
            payload,
            tid,
            {
              collection: 'side-navigation',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const foundItems = await find(payload, tid, {
        collection: 'side-navigation',
      })
      expect(foundItems.docs.length).toBe(sideNavigations.length - theirReports.length)
    })

    test('not delete not-their Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSideNavigations = sideNavigations.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirSideNavigations.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'side-navigation',
                id: item.id,
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

    test('read all their Side Navigation, upon site selection', async ({
      tid,
      testUser,
      sideNavigations,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundItems = await find(
        payload,
        tid,
        {
          collection: 'side-navigation',
        },
        testUser,
      )

      let expectedReports = sideNavigations.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundItems = await find(
        payload,
        tid,
        {
          collection: 'side-navigation',
        },
        testUser,
      )

      expectedReports = sideNavigations.filter((item) => siteIdHelper(item.site) === newSiteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(newSiteId)
      })
    })

    test('create a Side Navigation for all their sites, upon site selection', async ({
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
          collection: 'side-navigation',
          data: {
            title: `Side Navigation Title - ${siteId}`,
            name: `Side Navigation Name - ${siteId}`,
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
          collection: 'side-navigation',
          data: {
            title: `Side Navigation Title - ${newSiteId}`,
            name: `Side Navigation Name - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newReport.site)).toBe(newSiteId)
    })

    test('delete a Side Navigation for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      sideNavigations,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirReports = sideNavigations.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirReports.map((item) => {
          return del(
            payload,
            tid,
            {
              collection: 'side-navigation',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      let foundItems = await find(payload, tid, {
        collection: 'side-navigation',
      })
      expect(foundItems.docs.length).toBe(sideNavigations.length - theirReports.length)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreReports = sideNavigations.filter((item) => siteIdHelper(item.site) === newSiteId)

      await Promise.all(
        moreReports.map((item) => {
          return del(
            payload,
            tid,
            {
              collection: 'side-navigation',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      foundItems = await find(payload, tid, {
        collection: 'side-navigation',
      })
      expect(foundItems.docs.length).toBe(sideNavigations.length - theirReports.length - moreReports.length)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Page Menus', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'side-navigation',
        },
        testUser,
      )

      const expectedReports = sideNavigations.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Page Menus', async ({ tid, testUser, sideNavigations }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSideNavigations = sideNavigations.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirSideNavigations.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'side-navigation',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Side Navigation', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'side-navigation',
                data: {
                  title: `${site.name} - Title`,
                  name: `${site.name} - Name`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      await Promise.all(
        sideNavigations.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'side-navigation',
                id: item.id,
                data: {
                  title: `${item.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete Side Navigation', async ({ tid, testUser, sideNavigations }) => {
      await Promise.all(
        sideNavigations.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'side-navigation',
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
