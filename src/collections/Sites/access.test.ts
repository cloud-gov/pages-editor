import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { getUserSiteIds, siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';


describe('Sites access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Sites', async ({ tid, testUser, sites }) => {
            const foundSites = await find(payload, tid, {
                collection: 'sites'
            }, testUser)
            expect(foundSites.docs).toHaveLength(sites.length)
        })

        test('create a new Site', async ({ tid, testUser }) => {
            const site = await create(payload, tid, {
                collection: 'sites',
                data: {
                    name: 'A New Site',
                }
            }, testUser)

            expect(site).toBeTruthy()
        })

        test('update any Site', async ({ tid, testUser, sites }) => {
            const newSites = await Promise.all(sites.map(async site => {
                return update(payload, tid, {
                    collection: 'sites',
                    id: site.id,
                    data: {
                        name: `${site.name} (Edited)`,
                    }
                }, testUser)

            }))

            newSites.forEach(site => {
                expect(site.name).toContain('Edited')
            })

        })

        test('delete any Site', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return del(payload, tid, {
                    collection: 'sites',
                    id: site.id,
                }, testUser)

            }))

            const foundSites = await find(payload, tid, {
                collection: 'sites'
            })
            expect(foundSites.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their Sites', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const foundSites = await find(payload, tid, {
                collection: 'sites'
            }, testUser)

            const expectedSites = sites.filter(site => site.id === siteId)

            expect(foundSites.docs).toHaveLength(expectedSites.length)
            foundSites.docs.forEach(site => {
                expect(site.id).toBe(siteId)
            })
        })

        test('not read not-their Sites', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'sites',
                    id: site.id
                }, testUser))
            }))
        })

        test('not create new Sites', async ({ tid, testUser }) => {
            await isAccessError(create(payload, tid, {
                collection: 'sites',
                data: {
                    name: 'A New Site'
                }
            }, testUser))
        })

        test('not update Sites', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            await isAccessError(update(payload, tid, {
                collection: 'sites',
                id: siteId,
                data: {
                    name: 'A New Site (Updated)'
                }
            }, testUser))
        })

        test('not delete Sites', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            await isAccessError(del(payload, tid, {
                collection: 'sites',
                id: siteId,
            }, testUser))
        })
    })

    describe('site users with multiple sites can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

        const addSiteToUser = async (user, tid, site) => {
            return update(payload, tid, {
                collection: 'users',
                id: user.id,
                data: {
                    sites: [...user.sites, site]
                }
            })
        }

        test('read all their Sites (non-selection dependent)', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})

            let foundSites = await find(payload, tid, {
                collection: 'sites'
            }, testUser)

            let expectedSites = sites.filter(site => getUserSiteIds(testUser).includes(site.id))

            expect(foundSites.docs).toHaveLength(expectedSites.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Sites', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const foundSites = await find(payload, tid, {
                collection: 'sites'
            }, testUser)

            const expectedSites = sites.filter(site => site.id === siteId)

            expect(foundSites.docs).toHaveLength(expectedSites.length)
            foundSites.docs.forEach(site => {
                expect(site.id).toBe(siteId)
            })
        })

        test('not read not-their Sites', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId
            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'sites',
                    id: site.id
                }, testUser))
            }))
        })

        test('not write a Site', async ({ tid, testUser, sites }) => {
            await isAccessError(create(payload, tid, {
                collection: 'sites',
                data: {
                    name: 'A New Site'
                }
            }, testUser))
        })

        test('not update Sites', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(update(payload, tid, {
                    collection: 'sites',
                    id: site.id,
                    data: {
                        name: `${site.name} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete Sites', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(del(payload, tid, {
                    collection: 'sites',
                    id: site.id
                }, testUser))
            }))
        })
    })
})
