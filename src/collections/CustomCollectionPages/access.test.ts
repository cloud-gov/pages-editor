import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('CustomCollectionPages access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all CustomCollectionPages', async ({ tid, testUser, sites }) => {
      // Create custom collections for each site
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collections',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      // Create custom collection pages for each custom collection
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `${collection.title} - Page`,
                collectionConfig: collection.id,
                site: collection.site,
              },
            },
            testUser,
          )
        }),
      )

      const foundPages = await find(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
        },
        testUser,
      )
      expect(foundPages.docs).toHaveLength(customCollectionPages.length)
    })

    test('write a CustomCollectionPages to any site', async ({ tid, testUser, sites }) => {
      // Create custom collections for each site
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collections',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const newPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `${collection.title} - Title`,
                collectionConfig: collection.id,
                site: collection.site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newPages).toHaveLength(customCollections.length)
    })

    test('update any CustomCollectionPages', async ({ tid, testUser, sites }) => {
      // Create custom collections and pages
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collections',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `${collection.title} - Page`,
                collectionConfig: collection.id,
                site: collection.site,
              },
            },
            testUser,
          )
        }),
      )

      const updatedPages = await Promise.all(
        customCollectionPages.map(async (page) => {
          return update(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              id: page.id,
              data: {
                title: `${page.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      updatedPages.forEach((page) => {
        expect(page.title).toContain('Edited')
      })
    })

    test('update showInPageNav field', async ({ tid, testUser, sites }) => {
      // Create custom collection and page
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `${sites[0].name} Collection`,
            site: sites[0],
          },
        },
        testUser,
      )

      const page = await create(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          data: {
            title: `${customCollection.title} - Page`,
            collectionConfig: customCollection.id,
            site: sites[0],
          },
        },
        testUser,
      )

      const updatedPage = await update(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          id: page.id,
          data: {
            showInPageNav: false,
          } as any,
        },
        testUser,
      )

      expect((updatedPage as any).showInPageNav).toBe(false)

      const updatedPage2 = await update(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          id: page.id,
          data: {
            showInPageNav: true,
          } as any,
        },
        testUser,
      )

      expect((updatedPage2 as any).showInPageNav).toBe(true)
    })

    test('delete any CustomCollectionPages', async ({ tid, testUser, sites }) => {
      // Create custom collections and pages
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collections',
              data: {
                title: `${site.name} Collection`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `${collection.title} - Page`,
                collectionConfig: collection.id,
                site: collection.site,
              },
            },
            testUser,
          )
        }),
      )

      await Promise.all(
        customCollectionPages.map(async (page) => {
          return del(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              id: page.id,
            },
            testUser,
          )
        }),
      )

      const foundPages = await find(payload, tid, {
        collection: 'custom-collection-pages',
      })
      expect(foundPages.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access for non-user sites)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      const foundPages = await find(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
        },
        testUser,
      )

      const expectedPages = customCollectionPages.filter(
        (page) => siteIdHelper(page.site) === siteId,
      )

      expect(foundPages.docs).toHaveLength(expectedPages.length)
      foundPages.docs.forEach((page) => {
        expect(siteIdHelper(page.site)).toBe(siteId)
      })
    })

    test('not read not-their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access for non-user sites)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      const notTheirPages = customCollectionPages.filter(
        (page) => siteIdHelper(page.site) !== siteId,
      )

      await Promise.all(
        notTheirPages.map(async (page) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'custom-collection-pages',
                id: page.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a CustomCollectionPages to their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collection for their site
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      const newPage = await create(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          data: {
            title: `Page Title - ${siteId}`,
            collectionConfig: customCollection.id,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newPage).toBeTruthy()
    })

    test('not write a CustomCollectionPages to not-their site', async ({
      tid,
      testUser,
      sites,
    }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          // Create custom collection for not-their site (without user to bypass access)
          const customCollection = await create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site: site.id,
            },
          })

          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'custom-collection-pages',
                data: {
                  title: `${site.name} - Title`,
                  collectionConfig: customCollection.id,
                  site: site.id,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collection for their site
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      // Create multiple pages for their site
      const theirPages = await Promise.all(
        [1, 2].map(async (num) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `Page ${num} - ${siteId}`,
                collectionConfig: customCollection.id,
                site: siteId,
              },
            },
            testUser,
          )
        }),
      )

      const updatedPages = await Promise.all(
        theirPages.map(async (page) => {
          return update(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              id: page.id,
              data: {
                title: `${page.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      updatedPages.forEach((page) => {
        expect(page.title).toContain('Edited')
      })
    })

    test('update showInPageNav field on their CustomCollectionPages', async ({
      tid,
      testUser,
      sites,
    }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collection for their site
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      const page = await create(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          data: {
            title: `Page - ${siteId}`,
            collectionConfig: customCollection.id,
            site: siteId,
          },
        },
        testUser,
      )

      const updatedPage = await update(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          id: page.id,
          data: {
            showInPageNav: false,
          } as any,
        },
        testUser,
      )

      expect((updatedPage as any).showInPageNav).toBe(false)
    })

    test('not update not-their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access for non-user sites)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      const notTheirPages = customCollectionPages.filter(
        (page) => siteIdHelper(page.site) !== siteId,
      )

      await Promise.all(
        notTheirPages.map(async (page) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'custom-collection-pages',
                id: page.id,
                data: {
                  title: `${page.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collection for their site
      const customCollection = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      // Create multiple pages for their site
      const theirPages = await Promise.all(
        [1, 2].map(async (num) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `Page ${num} - ${siteId}`,
                collectionConfig: customCollection.id,
                site: siteId,
              },
            },
            testUser,
          )
        }),
      )

      await Promise.all(
        theirPages.map((page) => {
          return del(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              id: page.id,
            },
            testUser,
          )
        }),
      )

      const foundPages = await find(payload, tid, {
        collection: 'custom-collection-pages',
      })
      expect(foundPages.docs.length).toBe(0)
    })

    test('not delete not-their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access for non-user sites)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access for non-user sites)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      const notTheirPages = customCollectionPages.filter(
        (page) => siteIdHelper(page.site) !== siteId,
      )

      await Promise.all(
        notTheirPages.map(async (page) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'custom-collection-pages',
                id: page.id,
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

    test('read all their CustomCollectionPages, upon site selection', async ({
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
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access for non-user sites)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      let foundPages = await find(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
        },
        testUser,
      )

      let expectedPages = customCollectionPages.filter((page) => siteIdHelper(page.site) === siteId)

      expect(foundPages.docs).toHaveLength(expectedPages.length)
      foundPages.docs.forEach((page) => {
        expect(siteIdHelper(page.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundPages = await find(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
        },
        testUser,
      )

      expectedPages = customCollectionPages.filter((page) => siteIdHelper(page.site) === newSiteId)

      expect(foundPages.docs).toHaveLength(expectedPages.length)
      foundPages.docs.forEach((page) => {
        expect(siteIdHelper(page.site)).toBe(newSiteId)
      })
    })

    test('create a CustomCollectionPages for all their sites, upon site selection', async ({
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
          collection: 'custom-collections',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      let newPage = await create(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          data: {
            title: `Page Title - ${siteId}`,
            collectionConfig: customCollection1.id,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newPage).toBeTruthy()
      expect(siteIdHelper(newPage.site)).toBe(siteId)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      // Create custom collection for second site
      const customCollection2 = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `Collection - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      newPage = await create(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
          data: {
            title: `Page Title - ${newSiteId}`,
            collectionConfig: customCollection2.id,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newPage.site)).toBe(newSiteId)
    })

    test('delete a CustomCollectionPages for all their sites, upon site selection', async ({
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
          collection: 'custom-collections',
          data: {
            title: `Collection - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      // Create pages for first site
      const theirPages = await Promise.all(
        [1, 2].map(async (num) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `Page ${num} - ${siteId}`,
                collectionConfig: customCollection1.id,
                site: siteId,
              },
            },
            testUser,
          )
        }),
      )

      await Promise.all(
        theirPages.map((page) => {
          return del(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              id: page.id,
            },
            testUser,
          )
        }),
      )

      let foundPages = await find(payload, tid, {
        collection: 'custom-collection-pages',
      })
      expect(foundPages.docs.length).toBe(0)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      // Create custom collection for second site
      const customCollection2 = await create(
        payload,
        tid,
        {
          collection: 'custom-collections',
          data: {
            title: `Collection - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      // Create pages for second site
      const morePages = await Promise.all(
        [1, 2].map(async (num) => {
          return create(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              data: {
                title: `Page ${num} - ${newSiteId}`,
                collectionConfig: customCollection2.id,
                site: newSiteId,
              },
            },
            testUser,
          )
        }),
      )

      await Promise.all(
        morePages.map((page) => {
          return del(
            payload,
            tid,
            {
              collection: 'custom-collection-pages',
              id: page.id,
            },
            testUser,
          )
        }),
      )

      foundPages = await find(payload, tid, {
        collection: 'custom-collection-pages',
      })
      expect(foundPages.docs.length).toBe(0)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      const foundPages = await find(
        payload,
        tid,
        {
          collection: 'custom-collection-pages',
        },
        testUser,
      )

      const expectedPages = customCollectionPages.filter(
        (page) => siteIdHelper(page.site) === siteId,
      )

      expect(foundPages.docs).toHaveLength(expectedPages.length)
      foundPages.docs.forEach((page) => {
        expect(siteIdHelper(page.site)).toBe(siteId)
      })
    })

    test('not read not-their CustomCollectionPages', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create custom collections for all sites (without user to bypass access)
      const customCollections = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'custom-collections',
            data: {
              title: `${site.name} Collection`,
              site,
            },
          })
        }),
      )

      // Create custom collection pages for each custom collection (without user to bypass access)
      const customCollectionPages = await Promise.all(
        customCollections.map(async (collection) => {
          return create(payload, tid, {
            collection: 'custom-collection-pages',
            data: {
              title: `${collection.title} - Page`,
              collectionConfig: collection.id,
              site: collection.site,
            },
          })
        }),
      )

      const notTheirPages = customCollectionPages.filter(
        (page) => siteIdHelper(page.site) !== siteId,
      )

      await Promise.all(
        notTheirPages.map(async (page) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'custom-collection-pages',
                id: page.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a CustomCollectionPages', async ({ tid, testUser, sites }) => {
      // Create custom collection for first site (without user to bypass access)
      const customCollection = await create(payload, tid, {
        collection: 'custom-collections',
        data: {
          title: `${sites[0].name} Collection`,
          site: sites[0],
        },
      })

      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: 'custom-collection-pages',
            data: {
              title: `${sites[0].name} - Title`,
              collectionConfig: customCollection.id,
              site: sites[0],
            },
          },
          testUser,
        ),
      )
    })

    test('not update CustomCollectionPages', async ({ tid, testUser, sites }) => {
      // Create custom collection for first site (without user to bypass access)
      const customCollection = await create(payload, tid, {
        collection: 'custom-collections',
        data: {
          title: `${sites[0].name} Collection`,
          site: sites[0],
        },
      })

      // Create page without user (using overrideAccess)
      const page = await create(payload, tid, {
        collection: 'custom-collection-pages',
        data: {
          title: `${sites[0].name} - Page`,
          collectionConfig: customCollection.id,
          site: sites[0],
        },
      })

      await isAccessError(
        update(
          payload,
          tid,
          {
            collection: 'custom-collection-pages',
            id: page.id,
            data: {
              title: `${page.title} (Edited)`,
            },
          },
          testUser,
        ),
      )
    })

    test('not delete CustomCollectionPages', async ({ tid, testUser, sites }) => {
      // Create custom collection for first site (without user to bypass access)
      const customCollection = await create(payload, tid, {
        collection: 'custom-collections',
        data: {
          title: `${sites[0].name} Collection`,
          site: sites[0],
        },
      })

      // Create page without user (using overrideAccess)
      const page = await create(payload, tid, {
        collection: 'custom-collection-pages',
        data: {
          title: `${sites[0].name} - Page`,
          collectionConfig: customCollection.id,
          site: sites[0],
        },
      })

      await isAccessError(
        del(
          payload,
          tid,
          {
            collection: 'custom-collection-pages',
            id: page.id,
          },
          testUser,
        ),
      )
    })
  })
})
