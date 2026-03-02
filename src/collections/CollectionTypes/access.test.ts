import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('CustomCollections access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all CustomCollections', async ({ tid, testUser, sites }) => {
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'collection-types',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const foundCollections = await find(
        payload,
        tid,
        {
          collection: 'collection-types',
        },
        testUser,
      )
      expect(foundCollections.docs).toHaveLength(customCollections.length)
    })

    test('write a CustomCollections to any site', async ({ tid, testUser, sites }) => {
      const newCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'collection-types',
              data: {
                title: `${site.name} - Title`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newCollections).toHaveLength(sites.length)
    })

    test('update any CustomCollections', async ({ tid, testUser, sites }) => {
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'collection-types',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const updatedCollections = await Promise.all(
        customCollections.map(async (collection) => {
          return update(
            payload,
            tid,
            {
              collection: 'collection-types',
              id: collection.id,
              data: {
                title: `${collection.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      updatedCollections.forEach((collection) => {
        expect(collection.title).toContain('Edited')
      })
    })

    test('delete any CustomCollections', async ({ tid, testUser, sites }) => {
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'collection-types',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      await Promise.all(
        customCollections.map(async (collection) => {
          return del(
            payload,
            tid,
            {
              collection: 'collection-types',
              id: collection.id,
            },
            testUser,
          )
        }),
      )

      const foundCollections = await find(payload, tid, {
        collection: 'collection-types',
      })
      expect(foundCollections.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      const foundCollections = await find(
        payload,
        tid,
        {
          collection: 'collection-types',
        },
        testUser,
      )

      const expectedCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) === siteId,
      )

      expect(foundCollections.docs).toHaveLength(expectedCollections.length)
      foundCollections.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(siteId)
      })
    })

    test('not read not-their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      const notTheirCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirCollections.map(async (collection) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'collection-types',
                id: collection.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a CustomCollections to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newCollection = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newCollection).toBeTruthy()
    })

    test('not write a CustomCollections to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'collection-types',
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

    test('update their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collection for their site
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      const updatedCollection = await update(
        payload,
        tid,
        {
          collection: 'collection-types',
          id: customCollection.id,
          data: {
            title: `${customCollection.title} (Edited)`,
          },
        },
        testUser,
      )

      expect(updatedCollection.title).toContain('Edited')
    })

    test('not update not-their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      const notTheirCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirCollections.map(async (collection) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'collection-types',
                id: collection.id,
                data: {
                  title: `${collection.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their CustomCollections', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collection for their site
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      await del(
        payload,
        tid,
        {
          collection: 'collection-types',
          id: customCollection.id,
        },
        testUser,
      )

      const foundCollections = await find(payload, tid, {
        collection: 'collection-types',
      })
      expect(foundCollections.docs.length).toBe(0)
    })

    test('not delete not-their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      const notTheirCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirCollections.map(async (collection) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'collection-types',
                id: collection.id,
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

    test('read all their CustomCollections, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      let foundCollections = await find(
        payload,
        tid,
        {
          collection: 'collection-types',
        },
        testUser,
      )

      let expectedCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) === siteId,
      )

      expect(foundCollections.docs).toHaveLength(expectedCollections.length)
      foundCollections.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundCollections = await find(
        payload,
        tid,
        {
          collection: 'collection-types',
        },
        testUser,
      )

      expectedCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) === newSiteId,
      )

      expect(foundCollections.docs).toHaveLength(expectedCollections.length)
      foundCollections.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(newSiteId)
      })
    })

    test('create a CustomCollections for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      let newCollection = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newCollection).toBeTruthy()
      expect(siteIdHelper(newCollection.site)).toBe(siteId)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      newCollection = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection Title - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newCollection.site)).toBe(newSiteId)
    })

    test('delete a CustomCollections for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      // Create custom collection for first site
      const customCollection1 = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      await del(
        payload,
        tid,
        {
          collection: 'collection-types',
          id: customCollection1.id,
        },
        testUser,
      )

      let foundCollections = await find(payload, tid, {
        collection: 'collection-types',
      })
      expect(foundCollections.docs.length).toBe(0)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      // Create custom collection for second site
      const customCollection2 = await create(
        payload,
        tid,
        {
          collection: 'collection-types',
          data: {
            title: `Collection - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      await del(
        payload,
        tid,
        {
          collection: 'collection-types',
          id: customCollection2.id,
        },
        testUser,
      )

      foundCollections = await find(payload, tid, {
        collection: 'collection-types',
      })
      expect(foundCollections.docs.length).toBe(0)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      const foundCollections = await find(
        payload,
        tid,
        {
          collection: 'collection-types',
        },
        testUser,
      )

      const expectedCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) === siteId,
      )

      expect(foundCollections.docs).toHaveLength(expectedCollections.length)
      foundCollections.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(siteId)
      })
    })

    test('not read not-their CustomCollections', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'collection-types',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      const notTheirCollections = customCollections.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirCollections.map(async (collection) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'collection-types',
                id: collection.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a CustomCollections', async ({ tid, testUser, sites }) => {
      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: 'collection-types',
            data: {
              title: `${sites[0].name} - Title`,
              site: sites[0],
            },
          },
          testUser,
        ),
      )
    })

    test('not update CustomCollections', async ({ tid, testUser, sites }) => {
      // Create custom collection without user (using overrideAccess)
      const customCollection = await create(payload, tid, {
        collection: 'collection-types',
        data: {
          title: `${sites[0].name} Collection`,
          site: sites[0],
        },
      })

      await isAccessError(
        update(
          payload,
          tid,
          {
            collection: 'collection-types',
            id: customCollection.id,
            data: {
              title: `${customCollection.title} (Edited)`,
            },
          },
          testUser,
        ),
      )
    })

    test('not delete CustomCollections', async ({ tid, testUser, sites }) => {
      // Create custom collection without user (using overrideAccess)
      const customCollection = await create(payload, tid, {
        collection: 'collection-types',
        data: {
          title: `${sites[0].name} Collection`,
          site: sites[0],
        },
      })

      await isAccessError(
        del(
          payload,
          tid,
          {
            collection: 'collection-types',
            id: customCollection.id,
          },
          testUser,
        ),
      )
    })
  })
})
