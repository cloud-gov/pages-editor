import { test as vitest } from 'vitest'
import { v4 as uuid } from 'uuid'
import type { LocalTestContext } from './context.types'
import { create, find } from './localHelpers'
import type { CollectionSlug } from 'payload'

const alertCollectionName: CollectionSlug = 'alerts' as CollectionSlug;
const footerCollectionName: CollectionSlug = 'footer-site-collection' as CollectionSlug

export const test = vitest.extend<LocalTestContext>({
  tid: async ({ payload }, use) => {
    const tid = await payload.db.beginTransaction()
    if (!tid) throw new Error('no transaction')
    await use(tid)
    await payload.db.rollbackTransaction(tid)
  },
  defaultUserRole: 'user',
  defaultUserAdmin: false,
  siteNames: ['site1', 'site2', 'site3'],
  sites: [
    async ({ payload, tid, siteNames }, use) => {
      const sites = await Promise.all(
        siteNames.map(async (name) => {
          return create(payload, tid, {
            collection: 'sites',
            data: {
              name,
              initialManagerEmail: `${name}manager@gsa.gov`,
            },
          })
        }),
      )
      await use(sites)
    },
    { auto: true },
  ],
  posts: async ({ payload, tid, sites }, use) => {
    const posts = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'posts',
          data: {
            title: `${site.name} Title`,
            site,
          },
        })
      }),
    )
    await use(posts)
  },
  categories: async ({ payload, tid, sites }, use) => {
    const categories = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'categories',
          data: {
            title: `Foo`,
            site,
          },
        })
      }),
    )
    await use(categories)
  },
  events: async ({ payload, tid, sites }, use) => {
    const events = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'events',
          data: {
            title: `${site.name} Title`,
            site,
            startDate: new Date().toISOString(),
            format: 'inperson',
            eventType: 'onetime',
            content: {
              root: {
                type: 'root',
                children: [],
                direction: 'ltr',
                format: 'left',
                indent: 0,
                version: 1,
              },
            },
          },
        })
      }),
    )
    await use(events)
  },
  leadership: async ({ payload, tid, sites }, use) => {
    const leadership = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'leadership',
          data: {
            title: `${site.name} Title`,
            jobTitle: 'Testor',
            imageAlt: 'Test image alt',
            site,
          },
        })
      }),
    )
    await use(leadership)
  },
  // media: async ({ payload, tid, sites }, use) => {
  //   const media = await Promise.all(
  //     sites.map(async (site) => {
  //       const data = uploadField({ site: site.id, filename: `${site.name}.jpg` })

  //       return upload(payload, tid, {
  //         collection: 'media',
  //         data,
  //       })
  //     }),
  //   )
  //   await use(media).catch(e => console.error(e))
  // },
  news: async ({ payload, tid, sites }, use) => {
    const news = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'news',
          data: {
            title: `${site.name} Title`,
            site,
          },
        })
      }),
    )
    await use(news)
  },
  pageMenus: async ({ payload, tid, sites }, use) => {
    const pageMenus = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'page-menus',
          data: {
            title: `${site.name} Title`,
            name: `${site.name} Name`,
            site,
          },
        })
      }),
    )
    await use(pageMenus)
  },
  reports: async ({ payload, tid, sites }, use) => {
    const reports = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'reports',
          data: {
            title: `${site.name} Title`,
            site,
          },
        })
      }),
    )
    await use(reports)
  },
  resources: async ({ payload, tid, sites }, use) => {
    const resources = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: 'resources',
          data: {
            title: `${site.name} Title`,
            site,
          },
        })
      }),
    )
    await use(resources)
  },
  pages: async ({ payload, tid, sites }, use) => {
    const pages = await Promise.all(
      sites.map(async (site) => {
        const query = await find(payload, tid, {
          collection: 'pages',
          where: {
            site: {
              equals: site.id,
            },
          },
        })

        return query.docs
      }),
    )

    await use(pages.flat())
  },
  policies: async ({ payload, tid, sites }, use) => {
    const policies = await Promise.all(
      sites.map(async (site) => {
        const query = await find(payload, tid, {
          collection: 'policies',
          where: {
            site: {
              equals: site.id,
            },
          },
        })

        return query.docs
      }),
    )

    await use(policies.flat())
  },
  users: async ({ payload, tid, sites }, use) => {
    // site creation creates bot users & managers, find them and include them
    // in the fixture
    const users = (
      await find(payload, tid, {
        collection: 'users',
        depth: 3,
      })
    ).docs

    await use(users)
  },
  testUser: async ({ payload, tid, sites, defaultUserRole, defaultUserAdmin }, use) => {
    // guarantee there is one base user in the test DB
    const email = 'test@agency.gov'

    const defaultUser = await create(payload, tid, {
      collection: 'users',
      data: {
        email,
        sites: [
          {
            site: sites[0],
            role: defaultUserRole,
          },
        ],
        isAdmin: defaultUserAdmin,
        selectedSiteId: sites[0].id,
        sub: uuid(),
      },
    })
    await use(defaultUser)
  },
  alerts: async ({ payload, tid, sites }, use) => {
    const alerts = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: alertCollectionName,
          data: {
            title: `${site.name} Alert Title`,
            site,
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
          },
        })
      }),
    )
    await use(alerts)
  },
  footerSiteCollection: async ({ payload, tid, sites }, use) => {
    const footerSiteCollection = await Promise.all(
      sites.map(async (site) => {
        return create(payload, tid, {
          collection: footerCollectionName,
          data: {
            domain: `${site.name} Domain`,
            site,
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
          },
        })
      }),
    )
    await use(footerSiteCollection)
  },
  payload: global.payload,
})
