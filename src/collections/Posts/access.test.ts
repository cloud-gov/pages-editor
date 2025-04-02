import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';

describe('Posts access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Posts', async ({ tid, testUser, posts }) => {
            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)
            expect(foundPosts.docs).toHaveLength(posts.length)
        })

        test('write a Post to any site', async ({ tid, testUser, sites }) => {
            const newPosts = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'posts',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser)
            }))

            expect(newPosts).toHaveLength(sites.length)
        })

        test('update any Post', async ({ tid, testUser, posts }) => {
            const newPosts = await Promise.all(posts.map(async post => {
                return update(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                    data: {
                        title: `${post.title} (Edited)`,
                    }
                }, testUser)

            }))

            newPosts.forEach(post => {
                expect(post.title).toContain('Edited')
            })

        })

        test('delete any Post', async ({ tid, testUser, posts }) => {
            await Promise.all(posts.map(async post => {
                return del(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                }, testUser)

            }))

            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            })
            expect(foundPosts.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)

            const expectedPosts = posts.filter(post => siteIdHelper(post.site) === siteId)

            expect(foundPosts.docs).toHaveLength(expectedPosts.length)
            foundPosts.docs.forEach(post => {
                expect(siteIdHelper(post.site)).toBe(siteId)
            })
        })

        test('not read not-their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPosts = posts.filter(post => siteIdHelper(post.site) !== siteId)

            await Promise.all(notTheirPosts.map(async post => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'posts',
                    id: post.id
                }, testUser))
            }))
        })

        test('write a Post to their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newPost = await create(payload, tid, {
                collection: 'posts',
                data: {
                    title: `Post Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newPost).toBeTruthy()
        })

        test('not write a Post to not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'posts',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('update their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const theirPosts = posts.filter(post => siteIdHelper(post.site) === siteId)

            const newPosts = await Promise.all(theirPosts.map(async post => {
                return update(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                    data: {
                        title: `${post.title} (Edited)`,
                    }
                }, testUser)

            }))

            newPosts.forEach(post => {
                expect(post.title).toContain('Edited')
            })
        })

        test('not update not-their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPosts = posts.filter(post => siteIdHelper(post.site) !== siteId)

            await Promise.all(notTheirPosts.map(async post => {
                return isAccessError(update(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                    data: {
                        title: `${post.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('delete their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const theirPosts = posts.filter(post => siteIdHelper(post.site) === siteId)

            await Promise.all(theirPosts.map(post => {
                return del(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                }, testUser)
            }))

            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            })
            expect(foundPosts.docs.length).toBe(posts.length - theirPosts.length)
        })

        test('not delete not-their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPosts = posts.filter(post => siteIdHelper(post.site) !== siteId)

            await Promise.all(notTheirPosts.map(async post => {
                return isAccessError(del(payload, tid, {
                    collection: 'posts',
                    id: post.id
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

        test('read all their Posts, upon site selection', async ({ tid, testUser, posts, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})
            const siteId = testUser.selectedSiteId

            let foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)

            let expectedPosts = posts.filter(post => siteIdHelper(post.site) === siteId)

            expect(foundPosts.docs).toHaveLength(expectedPosts.length)
            foundPosts.docs.forEach(post => {
                expect(siteIdHelper(post.site)).toBe(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)

            expectedPosts = posts.filter(post => siteIdHelper(post.site) === newSiteId)

            expect(foundPosts.docs).toHaveLength(expectedPosts.length)
            foundPosts.docs.forEach(post => {
                expect(siteIdHelper(post.site)).toBe(newSiteId)
            })

        })

        test('create a Post for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            let newPost = await create(payload, tid, {
                collection: 'posts',
                data: {
                    title: `Post Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newPost).toBeTruthy()
            expect(siteIdHelper(newPost.site)).toBe(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newPost = await create(payload, tid, {
                collection: 'posts',
                data: {
                    title: `Post Title - ${newSiteId}`,
                    site: newSiteId,
                }
            }, testUser)

            expect(siteIdHelper(newPost.site)).toBe(newSiteId)
        })

        test('delete a Post for all their sites, upon site selection', async ({ tid, testUser, sites, posts }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            const theirPosts = posts.filter(post => siteIdHelper(post.site) === siteId)

            await Promise.all(theirPosts.map(post => {
                return del(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                }, testUser)
            }))

            let foundPosts = await find(payload, tid, {
                collection: 'posts'
            })
            expect(foundPosts.docs.length).toBe(posts.length - theirPosts.length)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            const morePosts = posts.filter(post => siteIdHelper(post.site) === newSiteId)

            await Promise.all(morePosts.map(post => {
                return del(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                }, testUser)
            }))

            foundPosts = await find(payload, tid, {
                collection: 'posts'
            })
            expect(foundPosts.docs.length).toBe(posts.length - theirPosts.length - morePosts.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)

            const expectedPosts = posts.filter(post => siteIdHelper(post.site) === siteId)

            expect(foundPosts.docs).toHaveLength(expectedPosts.length)
            foundPosts.docs.forEach(post => {
                expect(siteIdHelper(post.site)).toBe(siteId)
            })
        })

        test('not read not-their Posts', async ({ tid, testUser, posts }) => {
            const siteId = testUser.selectedSiteId

            const notTheirPosts = posts.filter(post => siteIdHelper(post.site) !== siteId)

            await Promise.all(notTheirPosts.map(async post => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'posts',
                    id: post.id
                }, testUser))
            }))
        })

        test('not write a Post', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'posts',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('not update Posts', async ({ tid, testUser, posts }) => {
            await Promise.all(posts.map(async post => {
                return isAccessError(update(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                    data: {
                        title: `${post.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete Posts', async ({ tid, testUser, posts }) => {
            await Promise.all(posts.map(async post => {
                return isAccessError(del(payload, tid, {
                    collection: 'posts',
                    id: post.id
                }, testUser))
            }))
        })
    })
})
