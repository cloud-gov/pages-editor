import { expect, describe } from 'vitest'
import { create, find, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test'

async function createSites(payload, tid, names: string[]) {
    return Promise.all(names.map(async name => {
        return create(payload, tid, {
            collection: 'sites',
            data: {
                name
            },
        })
    }))
}

async function createPage(payload, tid, site, title) {
    return create(payload, tid, {
        collection: 'pages',
        data: {
            title,
            site
        }
    })
}

describe('Pages access',  () => {
    test('admins can read all Pages',  async ({ tid }) => {
        const sites = await createSites(payload, tid, ['site1', 'site2'])
        await Promise.all(sites.map(async site => {
            return createPage(payload, tid, site, 'New Page')
        }))

        const [site1, _] = sites

        const user = await create(payload, tid, {
            collection: 'users',
            data: {
                email: 'admin@example.gov',
                sites: [{
                    site: site1,
                    role: 'manager'
                }],
                isAdmin: true
            }
        })
        await setUserSite(payload, tid, user, site1)

        const foundPages = await find(payload, tid, {
            collection: 'pages'
        }, user)
        expect(foundPages.docs).toHaveLength(2)
    })

    test('site users can read their Pages only',  async ({ tid }) => {
        const sites = await createSites(payload, tid, ['site1', 'site2'])
        await Promise.all(sites.map(async site => {
            return createPage(payload, tid, site, 'New Page')
        }))

        const [site1, _] = sites

        const user = await create(payload, tid, {
            collection: 'users',
            data: {
                email: 'user@example.gov',
                sites: [{
                    site: site1,
                    role: 'user'
                }],
            }
        })
        await setUserSite(payload, tid, user, site1)

        const foundPages = await find(payload, tid, {
            collection: 'pages'
        }, user)

        expect(foundPages.docs).toHaveLength(1)
        expect(foundPages.docs[0]).toHaveProperty('site.name', site1.name)
    })

    test('site users can only read if a site is selected',  async ({ tid }) => {
        const sites = await createSites(payload, tid, ['site1', 'site2'])
        await Promise.all(sites.map(async site => {
            return createPage(payload, tid, site, 'New Page')
        }))

        const [site1, _] = sites

        const user = await create(payload, tid, {
            collection: 'users',
            data: {
                email: 'user@example.gov',
                sites: [{
                    site: site1,
                    role: 'user'
                }],
            }
        })

        expect(find(payload, tid, {
            collection: 'pages'
        }, user)).rejects.toThrowError('You are not allowed to perform this action')
    })
})
