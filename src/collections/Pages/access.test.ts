import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';

describe('Pages access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Pages', async ({ tid, testUser, pages }) => {
            const foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)
            expect(foundPages.docs).toHaveLength(pages.length)
        })

        test('write a Page to any site', async ({ tid, testUser, sites }) => {
            const newPages = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'pages',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser)
            }))

            expect(newPages).toHaveLength(sites.length)
        })

        test('update any Page', async ({ tid, testUser, pages }) => {
            const newPages = await Promise.all(pages.map(async page => {
                return update(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                    data: {
                        title: `${page.title} (Edited)`,
                    }
                }, testUser)

            }))

            newPages.forEach(page => {
                expect(page.title).toContain('Edited')
            })

        })

        test('delete any Page', async ({ tid, testUser, pages }) => {
            await Promise.all(pages.map(async page => {
                return del(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                }, testUser)

            }))

            const foundPages = await find(payload, tid, {
                collection: 'pages'
            })
            expect(foundPages.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)

            const expectedPages = pages.filter(page => siteIdHelper(page.site) === siteId)

            expect(foundPages.docs).toHaveLength(expectedPages.length)
            foundPages.docs.forEach(page => {
                expect(siteIdHelper(page.site)).toBe(siteId)
            })
        })

        test('not read not-their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPages = pages.filter(page => siteIdHelper(page.site) !== siteId)

            await Promise.all(notTheirPages.map(async page => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'pages',
                    id: page.id
                }, testUser))
            }))
        })

        test('write a Page to their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newPage = await create(payload, tid, {
                collection: 'pages',
                data: {
                    title: `Page Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newPage).toBeTruthy()
        })

        test('not write a Page to not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'pages',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('update their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const theirPages = pages.filter(page => siteIdHelper(page.site) === siteId)

            const newPages = await Promise.all(theirPages.map(async page => {
                return update(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                    data: {
                        title: `${page.title} (Edited)`,
                    }
                }, testUser)

            }))

            newPages.forEach(page => {
                expect(page.title).toContain('Edited')
            })
        })

        test('not update not-their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPages = pages.filter(page => siteIdHelper(page.site) !== siteId)

            await Promise.all(notTheirPages.map(async page => {
                return isAccessError(update(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                    data: {
                        title: `${page.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('delete their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const theirPages = pages.filter(page => siteIdHelper(page.site) === siteId)

            await Promise.all(theirPages.map(page => {
                return del(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                }, testUser)
            }))

            const foundPages = await find(payload, tid, {
                collection: 'pages'
            })
            expect(foundPages.docs.length).toBe(pages.length - theirPages.length)
        })

        test('not delete not-their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPages = pages.filter(page => siteIdHelper(page.site) !== siteId)

            await Promise.all(notTheirPages.map(async page => {
                return isAccessError(del(payload, tid, {
                    collection: 'pages',
                    id: page.id
                }, testUser))
            }))
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

        test('read all their Pages, upon site selection', async ({ tid, testUser, pages, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})
            const siteId = testUser.selectedSiteId

            let foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)

            let expectedPages = pages.filter(page => siteIdHelper(page.site) === siteId)

            expect(foundPages.docs).toHaveLength(expectedPages.length)
            foundPages.docs.forEach(page => {
                expect(siteIdHelper(page.site)).toBe(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)

            expectedPages = pages.filter(page => siteIdHelper(page.site) === newSiteId)

            expect(foundPages.docs).toHaveLength(expectedPages.length)
            foundPages.docs.forEach(page => {
                expect(siteIdHelper(page.site)).toBe(newSiteId)
            })

        })

        test('create a Page for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            let newPage = await create(payload, tid, {
                collection: 'pages',
                data: {
                    title: `Page Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newPage).toBeTruthy()
            expect(siteIdHelper(newPage.site)).toBe(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newPage = await create(payload, tid, {
                collection: 'pages',
                data: {
                    title: `Page Title - ${newSiteId}`,
                    site: newSiteId,
                }
            }, testUser)

            expect(siteIdHelper(newPage.site)).toBe(newSiteId)
        })

        test('delete a Page for all their sites, upon site selection', async ({ tid, testUser, sites, pages }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            const theirPages = pages.filter(page => siteIdHelper(page.site) === siteId)

            await Promise.all(theirPages.map(page => {
                return del(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                }, testUser)
            }))

            let foundPages = await find(payload, tid, {
                collection: 'pages'
            })
            expect(foundPages.docs.length).toBe(pages.length - theirPages.length)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            const morePages = pages.filter(page => siteIdHelper(page.site) === newSiteId)

            await Promise.all(morePages.map(page => {
                return del(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                }, testUser)
            }))

            foundPages = await find(payload, tid, {
                collection: 'pages'
            })
            expect(foundPages.docs.length).toBe(pages.length - theirPages.length - morePages.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)

            const expectedPages = pages.filter(page => siteIdHelper(page.site) === siteId)

            expect(foundPages.docs).toHaveLength(expectedPages.length)
            foundPages.docs.forEach(page => {
                expect(siteIdHelper(page.site)).toBe(siteId)
            })
        })

        test('not read not-their Pages', async ({ tid, testUser, pages }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPages = pages.filter(page => siteIdHelper(page.site) !== siteId)

            await Promise.all(notTheirPages.map(async page => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'pages',
                    id: page.id
                }, testUser))
            }))
        })

        test('not write a Page', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'pages',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('not update Pages', async ({ tid, testUser, pages }) => {
            await Promise.all(pages.map(async page => {
                return isAccessError(update(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                    data: {
                        title: `${page.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete Pages', async ({ tid, testUser, pages }) => {
            await Promise.all(pages.map(async page => {
                return isAccessError(del(payload, tid, {
                    collection: 'pages',
                    id: page.id
                }, testUser))
            }))
        })
    })
})
