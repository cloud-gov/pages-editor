import { expect } from 'vitest'
import { create, find, setUserSite } from './utils/localHelpers';
import { test } from './utils/test'

test('generic starter test',  async ({ transactions, payload }) => {
    const tid = transactions.get('tid') ?? 1

    const siteName = 'test-site'

    const site = await create(payload, tid, {
        collection: 'sites',
        data: {
            name: siteName
        },
    })
    expect(site.name).toBe(siteName)

    const email = "testuser@agency.gov"
    const user = await create(payload, tid, {
        collection: 'users',
        data: {
            email,
            sites: [
                {
                    site,
                    role: 'user'
                }

            ]
        }
    })

    await setUserSite(payload, tid, user, site)

    expect(user.email).toBe(email)
    expect(user.sites[0]).toHaveProperty('site.name', siteName)
    expect(user.sites[0]).toHaveProperty('role', 'user')

    const failure = await find(payload, tid, {
        collection: 'users',
    }, user)

    expect(failure.docs).toHaveLength(2)
})
