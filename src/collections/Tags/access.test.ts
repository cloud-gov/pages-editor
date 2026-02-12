import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';

describe('Tags access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Tags', async ({ tid, testUser, tags }) => {
            const foundTags = await find(payload, tid, {
                collection: 'tags'
            }, testUser)
            expect(foundTags.docs).toHaveLength(tags.length)
        })

        test('write a Tags to any site', async ({ tid, testUser, sites }) => {
            const newTags = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'tags',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser)
            }))

            expect(newTags).toHaveLength(sites.length)
        })

        test('update any Tags', async ({ tid, testUser, tags }) => {
            const newTags = await Promise.all(tags.map(async tag => {
                return update(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                    data: {
                        title: `${tag.title} (Edited)`,
                    }
                }, testUser)

            }))

            newTags.forEach(tag => {
                expect(tag.title).toContain('Edited')
            })

        })

        test('delete any Tags', async ({ tid, testUser, tags }) => {
            await Promise.all(tags.map(async tag => {
                return del(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                }, testUser)

            }))

            const foundTags = await find(payload, tid, {
                collection: 'tags'
            })
            expect(foundTags.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const foundTags = await find(payload, tid, {
                collection: 'tags'
            }, testUser)

            const expectedCategories = tags.filter(tag => siteIdHelper(tag.site) === siteId)

            expect(foundTags.docs).toHaveLength(expectedCategories.length)
            foundTags.docs.forEach(tag => {
                expect(siteIdHelper(tag.site)).toBe(siteId)
            })
        })

        test('not read not-their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = tags.filter(tag => siteIdHelper(tag.site) !== siteId)

            await Promise.all(notTheirCategories.map(async tag => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'tags',
                    id: tag.id
                }, testUser))
            }))
        })

        test('write a Tags to their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newReport = await create(payload, tid, {
                collection: 'tags',
                data: {
                    title: `Tags Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newReport).toBeTruthy()
        })

        test('not write a Tags to not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'tags',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('update their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const theirCategories = tags.filter(tag => siteIdHelper(tag.site) === siteId)

            const newTags = await Promise.all(theirCategories.map(async tag => {
                return update(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                    data: {
                        title: `${tag.title} (Edited)`,
                    }
                }, testUser)

            }))

            newTags.forEach(tag => {
                expect(tag.title).toContain('Edited')
            })
        })

        test('not update not-their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = tags.filter(tag => siteIdHelper(tag.site) !== siteId)

            await Promise.all(notTheirCategories.map(async tag => {
                return isAccessError(update(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                    data: {
                        title: `${tag.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('delete their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const theirCategories = tags.filter(tag => siteIdHelper(tag.site) === siteId)

            await Promise.all(theirCategories.map(tag => {
                return del(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                }, testUser)
            }))

            const foundTags = await find(payload, tid, {
                collection: 'tags'
            })
            expect(foundTags.docs.length).toBe(tags.length - theirCategories.length)
        })

        test('not delete not-their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = tags.filter(tag => siteIdHelper(tag.site) !== siteId)

            await Promise.all(notTheirCategories.map(async tag => {
                return isAccessError(del(payload, tid, {
                    collection: 'tags',
                    id: tag.id
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

        test('read all their Tags, upon site selection', async ({ tid, testUser, tags, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})
            const siteId = testUser.selectedSiteId

            let foundTags = await find(payload, tid, {
                collection: 'tags'
            }, testUser)

            let expectedCategories = tags.filter(tag => siteIdHelper(tag.site) === siteId)

            expect(foundTags.docs).toHaveLength(expectedCategories.length)
            foundTags.docs.forEach(tag => {
                expect(siteIdHelper(tag.site)).toBe(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundTags = await find(payload, tid, {
                collection: 'tags'
            }, testUser)

            expectedCategories = tags.filter(tag => siteIdHelper(tag.site) === newSiteId)

            expect(foundTags.docs).toHaveLength(expectedCategories.length)
            foundTags.docs.forEach(tag => {
                expect(siteIdHelper(tag.site)).toBe(newSiteId)
            })

        })

        test('create a Tags for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            let newCategory = await create(payload, tid, {
                collection: 'tags',
                data: {
                    title: `Tags Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newCategory).toBeTruthy()
            expect(siteIdHelper(newCategory.site)).toBe(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newCategory = await create(payload, tid, {
                collection: 'tags',
                data: {
                    title: `Tags Title - ${newSiteId}`,
                    site: newSiteId,
                }
            }, testUser)

            expect(siteIdHelper(newCategory.site)).toBe(newSiteId)
        })

        test('delete a Tags for all their sites, upon site selection', async ({ tid, testUser, sites, tags }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            const theirCategories = tags.filter(tag => siteIdHelper(tag.site) === siteId)

            await Promise.all(theirCategories.map(tag => {
                return del(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                }, testUser)
            }))

            let foundTags = await find(payload, tid, {
                collection: 'tags'
            })
            expect(foundTags.docs.length).toBe(tags.length - theirCategories.length)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            const moreCategories = tags.filter(tag => siteIdHelper(tag.site) === newSiteId)

            await Promise.all(moreCategories.map(tag => {
                return del(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                }, testUser)
            }))

            foundTags = await find(payload, tid, {
                collection: 'tags'
            })
            expect(foundTags.docs.length).toBe(tags.length - theirCategories.length - moreCategories.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const foundTags = await find(payload, tid, {
                collection: 'tags'
            }, testUser)

            const expectedCategories = tags.filter(tag => siteIdHelper(tag.site) === siteId)

            expect(foundTags.docs).toHaveLength(expectedCategories.length)
            foundTags.docs.forEach(tag => {
                expect(siteIdHelper(tag.site)).toBe(siteId)
            })
        })

        test('not read not-their Tags', async ({ tid, testUser, tags }) => {
            const siteId = testUser.selectedSiteId

            const notTheirCategories = tags.filter(tag => siteIdHelper(tag.site) !== siteId)

            await Promise.all(notTheirCategories.map(async tag => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'tags',
                    id: tag.id
                }, testUser))
            }))
        })

        test('not write a Tags', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'tags',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('not update Tags', async ({ tid, testUser, tags }) => {
            await Promise.all(tags.map(async tag => {
                return isAccessError(update(payload, tid, {
                    collection: 'tags',
                    id: tag.id,
                    data: {
                        title: `${tag.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete Tags', async ({ tid, testUser, tags }) => {
            await Promise.all(tags.map(async tag => {
                return isAccessError(del(payload, tid, {
                    collection: 'tags',
                    id: tag.id
                }, testUser))
            }))
        })
    })
})
