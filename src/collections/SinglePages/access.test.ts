import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import { Singlepage } from '@/payload-types'

describe('SinglePages access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all SinglePages', async ({ tid, testUser, singlePages }) => {
      const result = await find(
        payload,
        tid,
        {
          collection: 'singlepages',
          limit: 20,
        },
        testUser,
      )

      expect(result.docs).toHaveLength(singlePages.length)
    })

    test('write a Singlepage to any site', async ({ tid, testUser, sites }) => {
      const result = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'singlepages',
              data: {
                title: `${site.name} - Single Page`,
                label: `${site.name} - Single Page Label`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(result).toHaveLength(sites.length)
    })

    test('update any Singlepage', async ({ tid, testUser, singlePages }) => {
      const result = await Promise.all(
        singlePages.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'singlepages',
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

    test('delete any Singlepage', async ({ tid, testUser, singlePages }) => {
      await Promise.all(
        singlePages.map(async (item) => {
          return del(
            payload,
            tid,
            {
              collection: 'singlepages',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const result = await find(payload, tid, {
        collection: 'singlepages',
      })
      expect(result.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const result = await find(
        payload,
        tid,
        {
          collection: 'singlepages',
        },
        testUser,
      )

      const expectedEvents = singlePages.filter((item) => siteIdHelper(item.site) === siteId)

      expect(result.docs).toHaveLength(expectedEvents.length)
      result.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = singlePages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'singlepages',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Singlepage to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: 'singlepages',
            data: {
              title: `Singlepage Title - ${siteId}`,
              label: `Singlepage Label - ${siteId}`,
              site: siteId,
            },
          },
          testUser,
        ),
      )
    })

    test('not write a Singlepage to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'singlepages',
                data: {
                  title: `${site.name} - Title`,
                  label: `${site.name} - Label`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update their SinglePages title', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const theirResults = singlePages.filter((item) => siteIdHelper(item.site) === siteId)
      const theirTitles = theirResults.map((item) => item.title)

      const newResults = await Promise.all(
        theirResults.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'singlepages',
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
        expect(theirTitles).toContain(item.title)
      })
    })

    test('update their SinglePages subtitle', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const theirResults = singlePages.filter((item) => siteIdHelper(item.site) === siteId)

      const newResults = await Promise.all(
        theirResults.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'singlepages',
              id: item.id,
              data: {
                subtitle: `${item.subtitle} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newResults.forEach((item) => {
        expect(item.subtitle).toContain('Edited')
      })
    })

    test('not update not-their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = singlePages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'singlepages',
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

    test('not delete their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const theirEvents = singlePages.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirEvents.map((item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'singlepages',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete not-their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = singlePages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'singlepages',
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

    test('read all their SinglePages, upon site selection', async ({
      tid,
      testUser,
      singlePages,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundResult = await find(
        payload,
        tid,
        {
          collection: 'singlepages',
        },
        testUser,
      )

      let result = singlePages.filter((item) => siteIdHelper(item.site) === siteId)

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
          collection: 'singlepages',
        },
        testUser,
      )

      result = singlePages.filter((item) => siteIdHelper(item.site) === newSiteId)

      expect(foundResult.docs).toHaveLength(result.length)
      foundResult.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(newSiteId)
      })
    })

    test('not create a Singlepage for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: 'singlepages',
            data: {
              title: `Singlepage Title - ${siteId}`,
              label: `Singlepage Label - ${siteId}`,
              site: siteId,
            },
          },
          testUser,
        ),
      )
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const foundResult = await find(
        payload,
        tid,
        {
          collection: 'singlepages',
        },
        testUser,
      )

      const expected = singlePages.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundResult.docs).toHaveLength(expected.length)
      foundResult.docs.forEach((event) => {
        expect(siteIdHelper(event.site)).toBe(siteId)
      })
    })

    test('not read not-their SinglePages', async ({ tid, testUser, singlePages }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = singlePages.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'singlepages',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Singlepage', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'singlepages',
                data: {
                  title: `${site.name} - Title`,
                  label: `${site.name} - Label`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update SinglePages', async ({ tid, testUser, singlePages }) => {
      await Promise.all(
        singlePages.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'singlepages',
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

    test('not delete SinglePages', async ({ tid, testUser, singlePages }) => {
      await Promise.all(
        singlePages.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'singlepages',
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
