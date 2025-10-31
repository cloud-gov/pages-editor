import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Page Menus access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Page Menus', async ({ tid, testUser, pageMenus }) => {
      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'page-menus',
        },
        testUser,
      )
      expect(foundItems.docs).toHaveLength(pageMenus.length)
    })

    test('write a Page Menus to any site', async ({ tid, testUser, sites }) => {
      const newReports = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'page-menus',
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

    test('update any Page Menus', async ({ tid, testUser, pageMenus }) => {
      const newReports = await Promise.all(
        pageMenus.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'page-menus',
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

    test('delete any Page Menus', async ({ tid, testUser, pageMenus }) => {
      await Promise.all(
        pageMenus.map(async (item) => {
          return del(
            payload,
            tid,
            {
              collection: 'page-menus',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const foundItems = await find(payload, tid, {
        collection: 'page-menus',
      })
      expect(foundItems.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'page-menus',
        },
        testUser,
      )

      const expectedReports = pageMenus.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const notTheirPageMenus = pageMenus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirPageMenus.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'page-menus',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a Page Menus to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newReport = await create(
        payload,
        tid,
        {
          collection: 'page-menus',
          data: {
            title: `Page Menus Title - ${siteId}`,
            name: `Page Menu Name - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newReport).toBeTruthy()
    })

    test('not write a Page Menus to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'page-menus',
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

    test('update their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const theirReports = pageMenus.filter((item) => siteIdHelper(item.site) === siteId)

      const newReports = await Promise.all(
        theirReports.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'page-menus',
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

    test('not update not-their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const notTheirPageMenus = pageMenus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirPageMenus.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'page-menus',
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

    test('delete their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const theirReports = pageMenus.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirReports.map((item) => {
          return del(
            payload,
            tid,
            {
              collection: 'page-menus',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const foundItems = await find(payload, tid, {
        collection: 'page-menus',
      })
      expect(foundItems.docs.length).toBe(pageMenus.length - theirReports.length)
    })

    test('not delete not-their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const notTheirPageMenus = pageMenus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirPageMenus.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'page-menus',
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

    test('read all their Page Menus, upon site selection', async ({
      tid,
      testUser,
      pageMenus,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundItems = await find(
        payload,
        tid,
        {
          collection: 'page-menus',
        },
        testUser,
      )

      let expectedReports = pageMenus.filter((item) => siteIdHelper(item.site) === siteId)

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
          collection: 'page-menus',
        },
        testUser,
      )

      expectedReports = pageMenus.filter((item) => siteIdHelper(item.site) === newSiteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(newSiteId)
      })
    })

    test('create a Page Menus for all their sites, upon site selection', async ({
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
          collection: 'page-menus',
          data: {
            title: `Page Menus Title - ${siteId}`,
            name: `Page Menus Name - ${siteId}`,
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
          collection: 'page-menus',
          data: {
            title: `Page Menus Title - ${newSiteId}`,
            name: `Page Menus Name - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newReport.site)).toBe(newSiteId)
    })

    test('delete a Page Menus for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      pageMenus,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirReports = pageMenus.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirReports.map((item) => {
          return del(
            payload,
            tid,
            {
              collection: 'page-menus',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      let foundItems = await find(payload, tid, {
        collection: 'page-menus',
      })
      expect(foundItems.docs.length).toBe(pageMenus.length - theirReports.length)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreReports = pageMenus.filter((item) => siteIdHelper(item.site) === newSiteId)

      await Promise.all(
        moreReports.map((item) => {
          return del(
            payload,
            tid,
            {
              collection: 'page-menus',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      foundItems = await find(payload, tid, {
        collection: 'page-menus',
      })
      expect(foundItems.docs.length).toBe(pageMenus.length - theirReports.length - moreReports.length)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const foundItems = await find(
        payload,
        tid,
        {
          collection: 'page-menus',
        },
        testUser,
      )

      const expectedReports = pageMenus.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundItems.docs).toHaveLength(expectedReports.length)
      foundItems.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Page Menus', async ({ tid, testUser, pageMenus }) => {
      const siteId = testUser.selectedSiteId

      const notTheirPageMenus = pageMenus.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirPageMenus.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'page-menus',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Page Menus', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'page-menus',
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

    test('not update Page Menus', async ({ tid, testUser, pageMenus }) => {
      await Promise.all(
        pageMenus.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'page-menus',
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

    test('not delete Page Menus', async ({ tid, testUser, pageMenus }) => {
      await Promise.all(
        pageMenus.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'page-menus',
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
