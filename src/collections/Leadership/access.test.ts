import { expect, describe } from 'vitest'
import { create, find, findByID, update, del } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import { Site } from '@/payload-types'

describe('Leadership access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Leadership', async ({ tid, testUser, leadership }) => {
      const foundLeadership = await find(
        payload,
        tid,
        {
          collection: 'leadership',
        },
        testUser,
      )
      expect(foundLeadership.docs).toHaveLength(leadership.length)
    })

    test('write Leadership to any site', async ({ tid, testUser, sites }) => {
      const newLeadership = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'leadership',
              data: {
                title: `${site.name} - Leader`,
                jobTitle: 'Director',
                description: 'Test description',
                imageAlt: 'Test image alt',
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newLeadership).toHaveLength(sites.length)
    })

    test('update any Leadership', async ({ tid, testUser, leadership }) => {
      const newLeadership = await Promise.all(
        leadership.map(async (leader) => {
          return update(
            payload,
            tid,
            {
              collection: 'leadership',
              id: leader.id,
              data: {
                title: `${leader.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newLeadership.forEach((leader) => {
        expect(leader.title).toContain('Edited')
      })
    })

    test('delete any Leadership', async ({ tid, testUser, leadership }) => {
      await Promise.all(
        leadership.map(async (leader) => {
          return del(
            payload,
            tid,
            {
              collection: 'leadership',
              id: leader.id,
            },
            testUser,
          )
        }),
      )

      const foundLeadership = await find(payload, tid, {
        collection: 'leadership',
      })
      expect(foundLeadership.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Leadership', async ({ tid, testUser, leadership }) => {
      const siteId = testUser.selectedSiteId

      const foundLeadership = await find(
        payload,
        tid,
        {
          collection: 'leadership',
        },
        testUser,
      )

      const expectedLeadership = leadership.filter((leader) => siteIdHelper(leader.site) === siteId)

      expect(foundLeadership.docs).toHaveLength(expectedLeadership.length)
      foundLeadership.docs.forEach((leader) => {
        expect(siteIdHelper(leader.site)).toBe(siteId)
      })
    })

    test('not read not-their Leadership', async ({ tid, testUser, leadership }) => {
      const siteId = testUser.selectedSiteId

      const notTheirLeadership = leadership.filter((leader) => siteIdHelper(leader.site) !== siteId)

      await Promise.all(
        notTheirLeadership.map(async (leader) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'leadership',
                id: leader.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write Leadership to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newLeader = await create(
        payload,
        tid,
        {
          collection: 'leadership',
          data: {
            title: `Leader - ${siteId}`,
            jobTitle: 'Director',
            description: 'Test description',
            imageAlt: 'Test image alt',
            site: siteId,
          },
        },
        testUser,
      )

      expect(newLeader).toBeTruthy()
    })

    test('not write Leadership to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'leadership',
                data: {
                  title: `${site.name} - Leader`,
                  jobTitle: 'Director',
                  description: 'Test description',
                  imageAlt: 'Test image alt',
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their Leadership', async ({ tid, testUser, leadership }) => {
      const siteId = testUser.selectedSiteId

      const theirLeadership = leadership.filter((leader) => siteIdHelper(leader.site) === siteId)

      const newLeadership = await Promise.all(
        theirLeadership.map(async (leader) => {
          return update(
            payload,
            tid,
            {
              collection: 'leadership',
              id: leader.id,
              data: {
                title: `${leader.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newLeadership.forEach((leader) => {
        expect(leader.title).toContain('Edited')
      })
    })

    test('not update not-their Leadership', async ({ tid, testUser, leadership }) => {
      const siteId = testUser.selectedSiteId

      const notTheirLeadership = leadership.filter((leader) => siteIdHelper(leader.site) !== siteId)

      await Promise.all(
        notTheirLeadership.map(async (leader) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'leadership',
                id: leader.id,
                data: {
                  title: `${leader.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their Leadership', async ({ tid, testUser, leadership }) => {
      const siteId = testUser.selectedSiteId

      const theirLeadership = leadership.filter((leader) => siteIdHelper(leader.site) === siteId)

      await Promise.all(
        theirLeadership.map((leader) => {
          return del(
            payload,
            tid,
            {
              collection: 'leadership',
              id: leader.id,
            },
            testUser,
          )
        }),
      )

      const foundLeadership = await find(payload, tid, {
        collection: 'leadership',
      })
      expect(foundLeadership.docs.length).toBe(leadership.length - theirLeadership.length)
    })

    test('not delete not-their Leadership', async ({ tid, testUser, leadership }) => {
      const siteId = testUser.selectedSiteId

      const notTheirLeadership = leadership.filter((leader) => siteIdHelper(leader.site) !== siteId)

      await Promise.all(
        notTheirLeadership.map(async (leader) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'leadership',
                id: leader.id,
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

    // TODO: fix this test
    // test.only('read Leadership from all their sites', async ({
    //   tid,
    //   testUser,
    //   sites,
    //   leadership,
    // }) => {
    //   testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
    //   const siteId = testUser.selectedSiteId

    //   const foundLeadership = await find(
    //     payload,
    //     tid,
    //     {
    //       collection: 'leadership',
    //     },
    //     testUser,
    //   )

    //   const expectedLeadership = leadership.filter(
    //     (leader) =>
    //       siteIdHelper(leader.site) === siteId || siteIdHelper(leader.site) === sites[1].id,
    //   )

    //   console.log(foundLeadership.docs)

    //   expect(foundLeadership.docs).toHaveLength(expectedLeadership.length)
    // })

    test('write Leadership to any of their sites', async ({ tid, testUser, sites }) => {
      const secondSite = await sites.find((site) => site.id !== testUser.selectedSiteId)
      testUser = await addSiteToUser(testUser, tid, { site: secondSite, role: 'user' })

      const newLeadership = await Promise.all(
        [testUser.selectedSiteId, secondSite?.id].map(async (siteId) => {
          console.log(siteId)
          return create(
            payload,
            tid,
            {
              collection: 'leadership',
              data: {
                title: `Leader - ${siteId}`,
                jobTitle: 'Director',
                description: 'Test description',
                imageAlt: 'Test image alt',
                site: siteId,
              },
            },
            { ...testUser, selectedSiteId: siteId },
          )
        }),
      )

      expect(newLeadership).toHaveLength(2)
    })
  })
})
