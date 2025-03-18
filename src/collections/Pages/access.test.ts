import { expect, describe } from 'vitest'
import { create, find, findByID, update, del } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { Site } from '@/payload-types';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError } from '@test/utils/errors';

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
            const foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)
            expect(foundPages.docs).toHaveLength(1)
            expect(foundPages.docs[0].site).toStrictEqual(testUser.sites[0].site)
        })

        test('not read not-their Pages', async ({ tid, testUser, pages }) => {
            const notTheirPages = pages.filter(page => {
                siteIdHelper(page.site) !== siteIdHelper(testUser.sites[0].site)
            })

            await Promise.all(notTheirPages.map(async page => {
                return isAccessError(findByID(payload, tid, {
                    collection: 'pages',
                    id: page.id
                }, testUser))
            }))
        })

        test('write a Page to their site', async ({ tid, testUser }) => {
            const site = testUser.sites[0].site as Site
            const newPage = await create(payload, tid, {
                collection: 'pages',
                data: {
                    title: `${site.name} - Title`,
                    site,
                }
            }, testUser)

            expect(newPage).toBeTruthy()
        })

        test('not write a Page to not-their site', async ({ tid, testUser, sites }) => {
            const notTheirSites= sites.filter(site => {
                site.id !== siteIdHelper(testUser.sites[0].site)
            })

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
            const theirPages = (await find(payload, tid, {
                collection: 'pages'
            }, testUser)).docs
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
            const siteId = siteIdHelper(testUser.sites[0].site)
            const notTheirPages = (await find(payload, tid, {
                collection: 'pages',
                where: {
                    'site.id': {
                        'not_equals': siteId
                    }
                }
            }, testUser)).docs

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
            const userPages = (await find(payload, tid, {
                collection: 'pages'
            }, testUser)).docs

            await Promise.all(userPages.map(page => {
                return del(payload, tid, {
                    collection: 'pages',
                    id: page.id,
                }, testUser)
            }))

            const foundPages = await find(payload, tid, {
                collection: 'pages'
            })
            expect(foundPages.docs.length).toBe(pages.length - userPages.length)
        })

        test('not delete not-their Pages', async ({ tid, testUser, pages }) => {
            const siteId = siteIdHelper(testUser.sites[0].site)
            const notTheirPages = (await find(payload, tid, {
                collection: 'pages',
                where: {
                    'site.id': {
                        'not_equals': siteId
                    }
                }
            }, testUser)).docs

            await Promise.all(notTheirPages.map(async page => {
                return isAccessError(del(payload, tid, {
                    collection: 'pages',
                    id: page.id
                }, testUser))
            }))
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Pages', async ({ tid, testUser, pages }) => {
            const foundPages = await find(payload, tid, {
                collection: 'pages'
            }, testUser)
            expect(foundPages.docs).toHaveLength(1)
            expect(siteIdHelper(foundPages.docs[0].site)).toStrictEqual(siteIdHelper(testUser.sites[0].site))
        })

        test('not read not-their Pages', async ({ tid, testUser, pages }) => {
            const notTheirPages = pages.filter(page => {
                siteIdHelper(page.site) !== siteIdHelper(testUser.sites[0].site)
            })

            await Promise.all(notTheirPages.map(async page => {
                return isAccessError(findByID(payload, tid, {
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
