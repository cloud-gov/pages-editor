import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('Policies access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Policies', async ({ tid, testUser, policies }) => {
      const result = await find(
        payload,
        tid,
        {
          collection: 'policies',
          limit: 20,
        },
        testUser,
      )

      expect(result.docs).toHaveLength(policies.length)
    })

    test('write a Policy to any site', async ({ tid, testUser, sites }) => {
      const result = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'policies',
              data: {
                title: `${site.name} - Policy`,
                label: `${site.name} - Policy Label`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(result).toHaveLength(sites.length)
    })

    test('update any Policy', async ({ tid, testUser, policies }) => {
      const result = await Promise.all(
        policies.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'policies',
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

    test('delete any Policy', async ({ tid, testUser, policies }) => {
      await Promise.all(
        policies.map(async (item) => {
          return del(
            payload,
            tid,
            {
              collection: 'policies',
              id: item.id,
            },
            testUser,
          )
        }),
      )

      const result = await find(payload, tid, {
        collection: 'policies',
      })
      expect(result.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const result = await find(
        payload,
        tid,
        {
          collection: 'policies',
        },
        testUser,
      )

      const expectedEvents = policies.filter((item) => siteIdHelper(item.site) === siteId)

      expect(result.docs).toHaveLength(expectedEvents.length)
      result.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not read not-their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = policies.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'policies',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Policy to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: 'policies',
            data: {
              title: `Policy Title - ${siteId}`,
              label: `Policy Label - ${siteId}`,
              site: siteId,
            },
          },
          testUser,
        ),
      )
    })

    test('not write a Policy to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'policies',
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

    test('not update their Policies title', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const theirResults = policies.filter((item) => siteIdHelper(item.site) === siteId)
      const theirTitles = theirResults.map((item) => item.title)

      const newResults = await Promise.all(
        theirResults.map(async (item) => {
          return update(
            payload,
            tid,
            {
              collection: 'policies',
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

    test('not update not-their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = policies.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'policies',
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

    test('not delete their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const theirEvents = policies.filter((item) => siteIdHelper(item.site) === siteId)

      await Promise.all(
        theirEvents.map((item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'policies',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete not-their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = policies.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'policies',
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

    test('read all their Policies, upon site selection', async ({
      tid,
      testUser,
      policies,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundResult = await find(
        payload,
        tid,
        {
          collection: 'policies',
        },
        testUser,
      )

      let result = policies.filter((item) => siteIdHelper(item.site) === siteId)

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
          collection: 'policies',
        },
        testUser,
      )

      result = policies.filter((item) => siteIdHelper(item.site) === newSiteId)

      expect(foundResult.docs).toHaveLength(result.length)
      foundResult.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(newSiteId)
      })
    })

    test('not create a Policy for all their sites, upon site selection', async ({
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
            collection: 'policies',
            data: {
              title: `Policy Title - ${siteId}`,
              label: `Policy Label - ${siteId}`,
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

    test('read their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const foundResult = await find(
        payload,
        tid,
        {
          collection: 'policies',
        },
        testUser,
      )

      const expected = policies.filter((item) => siteIdHelper(item.site) === siteId)

      expect(foundResult.docs).toHaveLength(expected.length)
      foundResult.docs.forEach((event) => {
        expect(siteIdHelper(event.site)).toBe(siteId)
      })
    })

    test('not read not-their Policies', async ({ tid, testUser, policies }) => {
      const siteId = testUser.selectedSiteId

      const notTheirResult = policies.filter((item) => siteIdHelper(item.site) !== siteId)

      await Promise.all(
        notTheirResult.map(async (item) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'policies',
                id: item.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Policy', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'policies',
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

    test('not update Policies', async ({ tid, testUser, policies }) => {
      await Promise.all(
        policies.map(async (item) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'policies',
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

    test('not delete Policies', async ({ tid, testUser, policies }) => {
      await Promise.all(
        policies.map(async (item) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'policies',
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
