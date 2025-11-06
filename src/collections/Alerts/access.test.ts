import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import { Alert } from '@/payload-types'
import type { CollectionSlug } from 'payload'

const alertCollectionName: CollectionSlug = 'alerts' as CollectionSlug

const fieldsToFill: Pick<Alert, 'title' | 'type' | 'isActive' | 'publishDate' | 'content'> = {
  title: 'Alert Title',
  type: 'info',
  isActive: false,
  publishDate: new Date().toISOString(),
  content: {
    "root": {
      "type": "root",
      "format": "",
      "indent": 0,
      "version": 1,
      "children": [
        {
          "type": "paragraph",
          "format": "",
          "indent": 0,
          "version": 1,
          "children": [
            {
              "mode": "normal",
              "text": "Alert Text",
              "type": "text",
              "style": "",
              "detail": 0,
              "format": 0,
              "version": 1
            }
          ],
          "direction": "ltr",
          "textStyle": "",
          "textFormat": 0
        }
      ],
      "direction": "ltr"
    }
  },
}

describe('Alerts access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Alerts', async ({ tid, testUser, alerts }) => {
      const foundAlerts = await find(
        payload,
        tid,
        {
          collection: alertCollectionName,
        },
        testUser,
      )
      expect(foundAlerts.docs).toHaveLength(alerts.length)
    })

    test('write a Alert to any site', async ({ tid, testUser, sites }) => {
      const newAlerts = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: alertCollectionName,
              data: {
                ...fieldsToFill,
              },
            },
            testUser,
          )
        }),
      )

      expect(newAlerts).toHaveLength(sites.length)
    })

    test('update any Alert', async ({ tid, testUser, alerts }) => {
      const newAlerts = await Promise.all(
        alerts.map(async (alert) => {
          return update(
            payload,
            tid,
            {
              collection: alertCollectionName,
              id: alert.id,
              data: {
                title: `${alert.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newAlerts.forEach((alert) => {
        expect(alert.title).toContain('Edited')
      })
    })

    test('delete any Alert', async ({ tid, testUser, alerts }) => {
      await Promise.all(
        alerts.map(async (alert) => {
          return del(
            payload,
            tid,
            {
              collection: alertCollectionName,
              id: alert.id,
            },
            testUser,
          )
        }),
      )

      const foundAlerts = await find(payload, tid, {
        collection: alertCollectionName,
      })
      expect(foundAlerts.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
    test.scoped({ defaultUserAdmin: false })

    test('read their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const foundAlerts = await find(
        payload,
        tid,
        {
          collection: alertCollectionName,
        },
        testUser,
      )

      const expectedAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === siteId)

      expect(foundAlerts.docs).toHaveLength(expectedAlerts.length)
      foundAlerts.docs.forEach((alert) => {
        expect(siteIdHelper(alert.site)).toBe(siteId)
      })
    })

    test('not read not-their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const notTheirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) !== siteId)

      await Promise.all(
        notTheirAlerts.map(async (alert) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: alertCollectionName,
                id: alert.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a Alert to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newAlert = await create(
        payload,
        tid,
        {
          collection: alertCollectionName,
          data: {
            title: `Alert Title - ${siteId}`,
            site: siteId,
            ...fieldsToFill,
          },
        },
        testUser,
      )

      expect(newAlert).toBeTruthy()
    })

    test('not write a Alert to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: alertCollectionName,
                data: {
                  title: `${site.name} - Title`,
                  site,
                  ...fieldsToFill,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const theirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === siteId)

      const newAlerts = await Promise.all(
        theirAlerts.map(async (alert) => {
          return update(
            payload,
            tid,
            {
              collection: alertCollectionName,
              id: alert.id,
              data: {
                title: `${alert.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newAlerts.forEach((alert) => {
        expect(alert.title).toContain('Edited')
      })
    })

    test('not update not-their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const notTheirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) !== siteId)

      await Promise.all(
        notTheirAlerts.map(async (alert) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: alertCollectionName,
                id: alert.id,
                data: {
                  title: `${alert.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const theirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === siteId)

      await Promise.all(
        theirAlerts.map((alert) => {
          return del(
            payload,
            tid,
            {
              collection: alertCollectionName,
              id: alert.id,
            },
            testUser,
          )
        }),
      )

      const foundAlerts = await find(payload, tid, {
        collection: alertCollectionName,
      })
      expect(foundAlerts.docs.length).toBe(alerts.length - theirAlerts.length)
    })

    test('not delete not-their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const notTheirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) !== siteId)

      await Promise.all(
        notTheirAlerts.map(async (alert) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: alertCollectionName,
                id: alert.id,
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

    test('read all their Alerts, upon site selection', async ({ tid, testUser, alerts, sites }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundAlerts = await find(
        payload,
        tid,
        {
          collection: alertCollectionName,
        },
        testUser,
      )

      let expectedAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === siteId)

      expect(foundAlerts.docs).toHaveLength(expectedAlerts.length)
      foundAlerts.docs.forEach((alert) => {
        expect(siteIdHelper(alert.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundAlerts = await find(
        payload,
        tid,
        {
          collection: alertCollectionName,
        },
        testUser,
      )

      expectedAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === newSiteId)

      expect(foundAlerts.docs).toHaveLength(expectedAlerts.length)
      foundAlerts.docs.forEach((alert) => {
        expect(siteIdHelper(alert.site)).toBe(newSiteId)
      })
    })

    test('create a Alert for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      let newAlert = await create(
        payload,
        tid,
        {
          collection: alertCollectionName,
          data: {
            title: `Alert Title - ${siteId}`,
            site: siteId,
            ...fieldsToFill,
          },
        },
        testUser,
      )

      expect(newAlert).toBeTruthy()
      expect(siteIdHelper(newAlert.site)).toBe(siteId)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      newAlert = await create(
        payload,
        tid,
        {
          collection: alertCollectionName,
          data: {
            title: `alert Title - ${newSiteId}`,
            site: newSiteId,
            ...fieldsToFill,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newAlert.site)).toBe(newSiteId)
    })

    test('delete a Alert for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      alerts,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === siteId)

      await Promise.all(
        theirAlerts.map((alert) => {
          return del(
            payload,
            tid,
            {
              collection: alertCollectionName,
              id: alert.id,
            },
            testUser,
          )
        }),
      )

      let foundAlerts = await find(payload, tid, {
        collection: alertCollectionName,
      })
      expect(foundAlerts.docs.length).toBe(alerts.length - theirAlerts.length)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === newSiteId)

      await Promise.all(
        moreAlerts.map((alert) => {
          return del(
            payload,
            tid,
            {
              collection: alertCollectionName,
              id: alert.id,
            },
            testUser,
          )
        }),
      )

      foundAlerts = await find(payload, tid, {
        collection: alertCollectionName,
      })
      expect(foundAlerts.docs.length).toBe(alerts.length - theirAlerts.length - moreAlerts.length)
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const foundAlerts = await find(
        payload,
        tid,
        {
          collection: alertCollectionName,
        },
        testUser,
      )

      const expectedAlerts = alerts.filter((alert) => siteIdHelper(alert.site) === siteId)

      expect(foundAlerts.docs).toHaveLength(expectedAlerts.length)
      foundAlerts.docs.forEach((alert) => {
        expect(siteIdHelper(alert.site)).toBe(siteId)
      })
    })

    test('not read not-their Alerts', async ({ tid, testUser, alerts }) => {
      const siteId = testUser.selectedSiteId

      const notTheirAlerts = alerts.filter((alert) => siteIdHelper(alert.site) !== siteId)

      await Promise.all(
        notTheirAlerts.map(async (alert) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: alertCollectionName,
                id: alert.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Alert', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: alertCollectionName,
                data: {
                  title: `${site.name} - Title`,
                  site,
                  ...fieldsToFill,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update Alerts', async ({ tid, testUser, alerts }) => {
      await Promise.all(
        alerts.map(async (alert) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: alertCollectionName,
                id: alert.id,
                data: {
                  title: `${alert.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete Alerts', async ({ tid, testUser, alerts }) => {
      await Promise.all(
        alerts.map(async (alert) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: alertCollectionName,
                id: alert.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })
})
