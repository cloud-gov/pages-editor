import { test as vitest } from 'vitest'
import type { LocalTestContext } from './context.types'
import { create, find, setUserSite } from './localHelpers';

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
    sites: [async({ payload, tid, siteNames }, use) => {
            const sites = await Promise.all(siteNames.map(name => {
                return create(payload, tid, {
                    collection: 'sites',
                    data: {
                        name
                    }
                })
            }))
            await use(sites)
        },
        { auto: true }
    ],
    pages: async({ payload, tid, sites }, use) => {
        const pages = await Promise.all(sites.map(async site => {
            return create(payload, tid, {
                collection: 'pages',
                data: {
                    title: `${site.name} Title`,
                    site
                }
            })
        }))
        await use(pages)
    },
    posts: async({ payload, tid, sites }, use) => {
        const posts = await Promise.all(sites.map(async site => {
            return create(payload, tid, {
                collection: 'posts',
                data: {
                    title: `${site.name} Title`,
                    site
                }
            })
        }))
        await use(posts)
    },
    users: async({ payload, tid, sites }, use) => {
        // site creation creates bot users, find them and include them
        // in the fixture
        const bots = (await find(payload, tid, {
            collection: 'users',
            depth: 3,
        })).docs
        await Promise.all(bots.map(bot => {
            return setUserSite(payload, tid, bot, bot.sites[0].site)
        }))

        // create a user per site
        let users = await Promise.all(sites.map(async site => {
            const user = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `user@${site.name}.gov`,
                    sites: [{
                        site,
                        role: 'user'
                    }]
                }
            })
            await setUserSite(payload, tid, user, site)
            return user
        }))

        users = [ ...users, ...bots]
        await use(users)
    },
    testUser: async({ payload, tid, sites, defaultUserRole, defaultUserAdmin }, use) => {
        // guarantee there is one base user in the test DB
        const email = 'test@agency.gov'

        const defaultUser = await create(payload, tid, {
            collection: 'users',
            data: {
                email,
                sites: [{
                    site: sites[0],
                    role: defaultUserRole
                }],
                isAdmin: defaultUserAdmin
            }
        })
        await setUserSite(payload, tid, defaultUser, sites[0])

        await use(defaultUser)
    },
    payload: global.payload
})
