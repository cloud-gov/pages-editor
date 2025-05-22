import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';

describe('Categories access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Categories', async ({ tid, testUser, categories }) => {
            const foundCategories = await find(payload, tid, {
                collection: 'categories'
            }, testUser)
            expect(foundCategories.docs).toHaveLength(categories.length)
        })

        test('write a Categories to any site', async ({ tid, testUser, sites }) => {
            const newCategories = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'categories',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser)
            }))

            expect(newCategories).toHaveLength(sites.length)
        })

        test('update any Categories', async ({ tid, testUser, categories }) => {
            const newCategories = await Promise.all(categories.map(async category => {
                return update(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                    data: {
                        title: `${category.title} (Edited)`,
                    }
                }, testUser)

            }))

            newCategories.forEach(category => {
                expect(category.title).toContain('Edited')
            })

        })

        test('delete any Categories', async ({ tid, testUser, categories }) => {
            await Promise.all(categories.map(async category => {
                return del(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                }, testUser)

            }))

            const foundCategories = await find(payload, tid, {
                collection: 'categories'
            })
            expect(foundCategories.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const foundCategories = await find(payload, tid, {
                collection: 'categories'
            }, testUser)

            const expectedCategories = categories.filter(category => siteIdHelper(category.site) === siteId)

            expect(foundCategories.docs).toHaveLength(expectedCategories.length)
            foundCategories.docs.forEach(category => {
                expect(siteIdHelper(category.site)).toBe(siteId)
            })
        })

        test('not read not-their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = categories.filter(category => siteIdHelper(category.site) !== siteId)

            await Promise.all(notTheirCategories.map(async category => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'categories',
                    id: category.id
                }, testUser))
            }))
        })

        test('write a Categories to their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newReport = await create(payload, tid, {
                collection: 'categories',
                data: {
                    title: `Categories Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newReport).toBeTruthy()
        })

        test('not write a Categories to not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'categories',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('update their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const theirCategories = categories.filter(category => siteIdHelper(category.site) === siteId)

            const newCategories = await Promise.all(theirCategories.map(async category => {
                return update(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                    data: {
                        title: `${category.title} (Edited)`,
                    }
                }, testUser)

            }))

            newCategories.forEach(category => {
                expect(category.title).toContain('Edited')
            })
        })

        test('not update not-their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = categories.filter(category => siteIdHelper(category.site) !== siteId)

            await Promise.all(notTheirCategories.map(async category => {
                return isAccessError(update(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                    data: {
                        title: `${category.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('delete their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const theirCategories = categories.filter(category => siteIdHelper(category.site) === siteId)

            await Promise.all(theirCategories.map(category => {
                return del(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                }, testUser)
            }))

            const foundCategories = await find(payload, tid, {
                collection: 'categories'
            })
            expect(foundCategories.docs.length).toBe(categories.length - theirCategories.length)
        })

        test('not delete not-their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = categories.filter(category => siteIdHelper(category.site) !== siteId)

            await Promise.all(notTheirCategories.map(async category => {
                return isAccessError(del(payload, tid, {
                    collection: 'categories',
                    id: category.id
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

        test('read all their Categories, upon site selection', async ({ tid, testUser, categories, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})
            const siteId = testUser.selectedSiteId

            let foundCategories = await find(payload, tid, {
                collection: 'categories'
            }, testUser)

            let expectedCategories = categories.filter(category => siteIdHelper(category.site) === siteId)

            expect(foundCategories.docs).toHaveLength(expectedCategories.length)
            foundCategories.docs.forEach(category => {
                expect(siteIdHelper(category.site)).toBe(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundCategories = await find(payload, tid, {
                collection: 'categories'
            }, testUser)

            expectedCategories = categories.filter(category => siteIdHelper(category.site) === newSiteId)

            expect(foundCategories.docs).toHaveLength(expectedCategories.length)
            foundCategories.docs.forEach(category => {
                expect(siteIdHelper(category.site)).toBe(newSiteId)
            })

        })

        test('create a Categories for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            let newCategory = await create(payload, tid, {
                collection: 'categories',
                data: {
                    title: `Categories Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newCategory).toBeTruthy()
            expect(siteIdHelper(newCategory.site)).toBe(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newCategory = await create(payload, tid, {
                collection: 'categories',
                data: {
                    title: `Categories Title - ${newSiteId}`,
                    site: newSiteId,
                }
            }, testUser)

            expect(siteIdHelper(newCategory.site)).toBe(newSiteId)
        })

        test('delete a Categories for all their sites, upon site selection', async ({ tid, testUser, sites, categories }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            const theirCategories = categories.filter(category => siteIdHelper(category.site) === siteId)

            await Promise.all(theirCategories.map(category => {
                return del(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                }, testUser)
            }))

            let foundCategories = await find(payload, tid, {
                collection: 'categories'
            })
            expect(foundCategories.docs.length).toBe(categories.length - theirCategories.length)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            const moreCategories = categories.filter(category => siteIdHelper(category.site) === newSiteId)

            await Promise.all(moreCategories.map(category => {
                return del(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                }, testUser)
            }))

            foundCategories = await find(payload, tid, {
                collection: 'categories'
            })
            expect(foundCategories.docs.length).toBe(categories.length - theirCategories.length - moreCategories.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const foundCategories = await find(payload, tid, {
                collection: 'categories'
            }, testUser)

            const expectedCategories = categories.filter(category => siteIdHelper(category.site) === siteId)

            expect(foundCategories.docs).toHaveLength(expectedCategories.length)
            foundCategories.docs.forEach(category => {
                expect(siteIdHelper(category.site)).toBe(siteId)
            })
        })

        test('not read not-their Categories', async ({ tid, testUser, categories }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = categories.filter(category => siteIdHelper(category.site) !== siteId)

            await Promise.all(notTheirCategories.map(async category => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'categories',
                    id: category.id
                }, testUser))
            }))
        })

        test('not write a Categories', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'categories',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('not update Categories', async ({ tid, testUser, categories }) => {
            await Promise.all(categories.map(async category => {
                return isAccessError(update(payload, tid, {
                    collection: 'categories',
                    id: category.id,
                    data: {
                        title: `${category.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete Categories', async ({ tid, testUser, categories }) => {
            await Promise.all(categories.map(async category => {
                return isAccessError(del(payload, tid, {
                    collection: 'categories',
                    id: category.id
                }, testUser))
            }))
        })
    })
})
