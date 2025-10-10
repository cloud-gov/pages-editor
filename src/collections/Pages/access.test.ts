import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Pages access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Pages', async ({ tid, testUser, pages }) => {
      const result = await find(
        payload,
        tid,
        {
          collection: 'pages',
          limit: 20,
        },
        testUser,
      )

      expect(result.docs).toHaveLength(pages.length)
    })

    test('write a Page to any site', async ({ tid, testUser, sites }) => {
      const result = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'pages',
              data: {
                title: `${site.name} - Page`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(result).toHaveLength(sites.length)
    })

    test('update any Page', async ({ tid, testUser, pages }) => {
      const result = await Promise.all(
        pages.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'pages',
              id: item.id,
              data: {
                title: `${item.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      result.forEach((item) => {
        expect(item.title).toContain('Edited')
      })
    })

    test('delete any Page', async ({ tid, testUser, pages }) => {
      await Promise.all(
        pages.map(async (item) => {
          return del(
            payload,
            tid,
            {
              collection: 'pages',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const result = await find(payload, tid, {
        collection: 'pages',
      })
      expect(result.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const result = await find(
        payload,
        tid,
        {
          collection: 'pages',
        },
        testUser,
      )

      const expectedEvents = pages.filter((item) => siteIdHelper(item.site) === siteId)

      expect(result.docs).toHaveLength(expectedEvents.length)
      result.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = pages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'pages',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('can write a Page to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const result = await create(
        payload,
        tid,
        {
          collection: 'pages',
          data: {
            title: `Page`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(result).toBeTruthy()
    })

    test('not write a Page to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'pages',
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

    test('can update their Pages title', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const theirResults = pages.filter((item) => siteIdHelper(item.site) === siteId)
      const theirTitles = theirResults.map((item) => item.title)

      const newResults = await Promise.all(
        theirResults.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'pages',
              id: item.id,
              data: {
                title: `${item.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newResults.forEach((item) => {
        expect(item.title).toContain('(Edited)')
      })
    })

    test('not update not-their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = pages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'pages',
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

    test('not delete their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const theirEvents = pages.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirEvents.map((item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'pages',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete not-their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = pages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'pages',
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

    test('read all their Pages, upon site selection', async ({ tid, testUser, pages, sites }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundResult = await find(
        payload,
        tid,
        {
          collection: 'pages',
        },
        testUser,
      )

      let result = pages.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundResult.docs).toHaveLength(result.length)
      foundResult.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundResult = await find(
        payload,
        tid,
        {
          collection: 'pages',
        },
        testUser,
      )

      result = pages.filter((item) => siteIdHelper(item.site) === newSiteId)

      expect(foundResult.docs).toHaveLength(result.length)
      foundResult.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(newSiteId)
      })
    })

    test('can create a Page for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const result = await create(
        payload,
        tid,
        {
          collection: 'pages',
          data: {
            title: `Page Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )
      expect(result).toBeTruthy()
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const foundResult = await find(
        payload,
        tid,
        {
          collection: 'pages',
        },
        testUser,
      )

      const expected = pages.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundResult.docs).toHaveLength(expected.length)
      foundResult.docs.forEach((event) => {
        expect(siteIdHelper(event.site)).toBe(siteId)
      })
    })

    test('not read not-their Pages', async ({ tid, testUser, pages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = pages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'pages',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Page', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'pages',
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

    test('not update Pages', async ({ tid, testUser, pages }) => {
      await Promise.all(
        pages.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'pages',
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

    test('not delete Pages', async ({ tid, testUser, pages }) => {
      await Promise.all(
        pages.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'pages',
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
