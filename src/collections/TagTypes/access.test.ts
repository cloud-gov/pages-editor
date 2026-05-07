import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'

describe('TagType access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all TagTypes Collections', async ({ tid, testUser, sites }) => {
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'tag-types',
              data: {
                title: `${site.name} Tag Type`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const foundTypes = await find(
        payload,
        tid,
        {
          collection: 'tag-types',
        },
        testUser,
      )
      expect(foundTypes.docs).toHaveLength(tagTypes.length)
    })

    test('write a TagType to any site', async ({ tid, testUser, sites }) => {
      const newTypes = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'tag-types',
              data: {
                title: `${site.name} - Title`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      expect(newTypes).toHaveLength(sites.length)
    })

    test('update any TagTypes', async ({ tid, testUser, sites }) => {
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'tag-types',
              data: {
                title: `${site.name} Tag Types`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      const updatedTagTypes = await Promise.all(
        tagTypes.map(async (collection) => {
          return update(
            payload,
            tid,
            {
              collection: 'tag-types',
              id: collection.id,
              data: {
                title: `${collection.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      updatedTagTypes.forEach((collection) => {
        expect(collection.title).toContain('Edited')
      })
    })

    test('delete any TagTypes', async ({ tid, testUser, sites }) => {
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: 'tag-types',
              data: {
                title: `${site.name} Tag Types`,
                site,
              },
            },
            testUser,
          )
        }),
      )

      await Promise.all(
        tagTypes.map(async (collection) => {
          return del(
            payload,
            tid,
            {
              collection: 'tag-types',
              id: collection.id,
            },
            testUser,
          )
        }),
      )

      const foundTagTypes = await find(payload, tid, {
        collection: 'tag-types',
      })
      expect(foundTagTypes.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their TagTypes', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access for non-user sites)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Types`,
              site,
            },
          })
        }),
      )

      const foundTagTypes = await find(
        payload,
        tid,
        {
          collection: 'tag-types',
        },
        testUser,
      )

      const expectedTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) === siteId,
      )

      expect(foundTagTypes.docs).toHaveLength(expectedTagTypes.length)
      foundTagTypes.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(siteId)
      })
    })

    test('not read not-their TagTypes', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access for non-user sites)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Types`,
              site,
            },
          })
        }),
      )

      const notTheirTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirTagTypes.map(async (collection) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'tag-types',
                id: collection.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a TagType to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newTagType = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
          data: {
            title: `Tag Type Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newTagType).toBeTruthy()
    })

    test('not write a Tag Type to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: 'tag-types',
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

    test('update their TagTypes', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for their site
      const tagTypes = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
          data: {
            title: `Tag Type - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      const updatedTagTypes = await update(
        payload,
        tid,
        {
          collection: 'tag-types',
          id: tagTypes.id,
          data: {
            title: `${tagTypes.title} (Edited)`,
          },
        },
        testUser,
      )

      expect(updatedTagTypes.title).toContain('Edited')
    })

    test('not update not-their TagType', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access for non-user sites)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Type`,
              site,
            },
          })
        }),
      )

      const notTheirTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirTagTypes.map(async (collection) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: 'tag-types',
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

    test('delete their TagTypes', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for their site
      const tagTypes = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
          data: {
            title: `Tag Type - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      await del(
        payload,
        tid,
        {
          collection: 'tag-types',
          id: tagTypes.id,
        },
        testUser,
      )

      const foundTagTypes = await find(payload, tid, {
        collection: 'tag-types',
      })
      expect(foundTagTypes.docs.length).toBe(0)
    })

    test('not delete not-their TagTypes', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access for non-user sites)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Type`,
              site,
            },
          })
        }),
      )

      const notTheirTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirTagTypes.map(async (collection) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: 'tag-types',
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

    test('read all their TagTypes, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access for non-user sites)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Type`,
              site,
            },
          })
        }),
      )

      let foundTagTypes = await find(
        payload,
        tid,
        {
          collection: 'tag-types',
        },
        testUser,
      )

      let expectedTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) === siteId,
      )

      expect(foundTagTypes.docs).toHaveLength(expectedTagTypes.length)
      foundTagTypes.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundTagTypes = await find(
        payload,
        tid,
        {
          collection: 'tag-types',
        },
        testUser,
      )

      expectedTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) === newSiteId,
      )

      expect(foundTagTypes.docs).toHaveLength(expectedTagTypes.length)
      foundTagTypes.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(newSiteId)
      })
    })

    test('create a TagType for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      let newTagType = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
          data: {
            title: `Tag Type Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newTagType).toBeTruthy()
      expect(siteIdHelper(newTagType.site)).toBe(siteId)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      newTagType = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
          data: {
            title: `Tag Type Title - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newTagType.site)).toBe(newSiteId)
    })

    test('delete a TagType for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      // Create tag types for first site
      const tagType1 = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
          data: {
            title: `Tag Type - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      await del(
        payload,
        tid,
        {
          collection: 'tag-types',
          id: tagType1.id,
        },
        testUser,
      )

      let foundTagTypes = await find(payload, tid, {
        collection: 'tag-types',
      })
      expect(foundTagTypes.docs.length).toBe(0)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      // Create tag types for second site
      const tagTypes2 = await create(
        payload,
        tid,
        {
          collection: 'tag-types',
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
          collection: 'tag-types',
          id: tagTypes2.id,
        },
        testUser,
      )

      foundTagTypes = await find(payload, tid, {
        collection: 'tag-types',
      })
      expect(foundTagTypes.docs.length).toBe(0)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their TagTypes', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Type`,
              site,
            },
          })
        }),
      )

      const foundTagTypes = await find(
        payload,
        tid,
        {
          collection: 'tag-types',
        },
        testUser,
      )

      const expectedTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) === siteId,
      )

      expect(foundTagTypes.docs).toHaveLength(expectedTagTypes.length)
      foundTagTypes.docs.forEach((collection) => {
        expect(siteIdHelper(collection.site)).toBe(siteId)
      })
    })

    test('not read not-their TagTypes', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      // Create tag types for all sites (without user to bypass access)
      const tagTypes = await Promise.all(
        sites.map(async (site) => {
          return create(payload, tid, {
            collection: 'tag-types',
            data: {
              title: `${site.name} Tag Type`,
              site,
            },
          })
        }),
      )

      const notTheirTagTypes = tagTypes.filter(
        (collection) => siteIdHelper(collection.site) !== siteId,
      )

      await Promise.all(
        notTheirTagTypes.map(async (collection) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: 'tag-types',
                id: collection.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a TagType', async ({ tid, testUser, sites }) => {
      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: 'tag-types',
            data: {
              title: `${sites[0].name} - Title`,
              site: sites[0],
            },
          },
          testUser,
        ),
      )
    })

    test('not update TagTypes', async ({ tid, testUser, sites }) => {
      // Create tag types without user (using overrideAccess)
      const tagTypes = await create(payload, tid, {
        collection: 'tag-types',
        data: {
          title: `${sites[0].name} Tag Types`,
          site: sites[0],
        },
      })

      await isAccessError(
        update(
          payload,
          tid,
          {
            collection: 'tag-types',
            id: tagTypes.id,
            data: {
              title: `${tagTypes.title} (Edited)`,
            },
          },
          testUser,
        ),
      )
    })

    test('not delete TagTypes', async ({ tid, testUser, sites }) => {
      // Create tag types without user (using overrideAccess)
      const tagTypes = await create(payload, tid, {
        collection: 'tag-types',
        data: {
          title: `${sites[0].name} Tag Types`,
          site: sites[0],
        },
      })

      await isAccessError(
        del(
          payload,
          tid,
          {
            collection: 'tag-types',
            id: tagTypes.id,
          },
          testUser,
        ),
      )
    })
  })
})
