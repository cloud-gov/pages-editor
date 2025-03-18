import { expect, describe } from 'vitest'
import { create, find, findByID, update, del } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { Site } from '@/payload-types';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError } from '@test/utils/errors';
import { setUserSite } from '@test/utils/localHelpers';

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
            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)
            expect(foundPosts.docs).toHaveLength(posts.filter(siteid).length)
            expect(foundPosts.docs[0].site).toStrictEqual(testUser.sites[0].site)
        })

        test('not read not-their Posts', async ({ tid, testUser, posts }) => {
            const notTheirPosts = posts.filter(post => {
                siteIdHelper(post.site) !== siteIdHelper(testUser.sites[0].site)
            })

            await Promise.all(notTheirPosts.map(async post => {
                return isAccessError(findByID(payload, tid, {
                    collection: 'posts',
                    id: post.id
                }, testUser))
            }))
        })

        test('write a Post to their site', async ({ tid, testUser }) => {
            const site = testUser.sites[0].site as Site
            const newPost = await create(payload, tid, {
                collection: 'posts',
                data: {
                    title: `${site.name} - Title`,
                    site,
                }
            }, testUser)

            expect(newPost).toBeTruthy()
        })

        test('not write a Post to not-their site', async ({ tid, testUser, sites }) => {
            const notTheirSites= sites.filter(site => {
                site.id !== siteIdHelper(testUser.sites[0].site)
            })

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
            const theirPosts = (await find(payload, tid, {
                collection: 'posts'
            }, testUser)).docs
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
            const siteId = siteIdHelper(testUser.sites[0].site)
            const notTheirPosts = (await find(payload, tid, {
                collection: 'posts',
                where: {
                    'site.id': {
                        'not_equals': siteId
                    }
                }
            }, testUser)).docs

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
            const userPosts = (await find(payload, tid, {
                collection: 'posts'
            }, testUser)).docs

            await Promise.all(userPosts.map(post => {
                return del(payload, tid, {
                    collection: 'posts',
                    id: post.id,
                }, testUser)
            }))

            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            })
            expect(foundPosts.docs.length).toBe(posts.length - userPosts.length)
        })

        test('not delete not-their Posts', async ({ tid, testUser, posts }) => {
            const siteId = siteIdHelper(testUser.sites[0].site)
            const notTheirPosts = (await find(payload, tid, {
                collection: 'posts',
                where: {
                    'site.id': {
                        'not_equals': siteId
                    }
                }
            }, testUser)).docs

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

            let foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)

            expect(foundPosts.docs).toHaveLength(1)
            expect(siteIdHelper(foundPosts.docs[0].site)).toBe(sites[0].id)

            // switch site
            await setUserSite(payload, tid, testUser, sites[1])

            foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)

            expect(foundPosts.docs).toHaveLength(1)
            expect(siteIdHelper(foundPosts.docs[0].site)).toBe(sites[1].id)

        })

        // test('create a User for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
        //     testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})

        //     let site = sites[0]
        //     let newUser = await create(payload, tid, {
        //         collection: 'users',
        //         data: {
        //             email: `newuser@${site.name}.gov`,
        //             sites: [{
        //                 site,
        //                 role: 'user'
        //             }],
        //         }
        //     }, testUser)

        //     expect(siteIdHelper(newUser.sites[0].site)).toBe(site.id)

        //     // switch site
        //     await setUserSite(payload, tid, testUser, sites[1])
        //     site = sites[1]

        //     newUser = await create(payload, tid, {
        //         collection: 'users',
        //         data: {
        //             email: `newuser@${site.name}.gov`,
        //             sites: [{
        //                 site,
        //                 role: 'user'
        //             }],
        //         }
        //     }, testUser)

        //     expect(siteIdHelper(newUser.sites[0].site)).toBe(site.id)
        // })

        // test('update a User for all their sites, upon site selection', async ({ tid, testUser, users, sites }) => {
        //     testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
        //     let site = sites[0]

        //     let theirUsers = (await find(payload, tid, {
        //         collection: 'users'
        //     }, testUser)).docs

        //     let newUsers = await Promise.all(theirUsers.map(async user => {
        //         return update(payload, tid, {
        //             collection: 'users',
        //             id: user.id,
        //             data: {
        //                 sites: [{
        //                     site,
        //                     role: 'manager'
        //                 }],
        //             }
        //         }, testUser)
        //     }))

        //     newUsers.forEach(user => {
        //         expect(user.sites[0].role).toBe('manager')
        //         expect(siteIdHelper(user.sites[0].site)).toBe(site.id)
        //     })

        //     // switch site
        //     await setUserSite(payload, tid, testUser, sites[1])
        //     site = sites[1]

        //     theirUsers = (await find(payload, tid, {
        //         collection: 'users'
        //     }, testUser)).docs

        //     newUsers = await Promise.all(theirUsers.map(async user => {
        //         return update(payload, tid, {
        //             collection: 'users',
        //             id: user.id,
        //             data: {
        //                 sites: [{
        //                     site,
        //                     role: 'manager'
        //                 }],
        //             }
        //         }, testUser)
        //     }))

        //     newUsers.forEach(user => {
        //         expect(user.sites[0].role).toBe('manager')
        //         expect(siteIdHelper(user.sites[0].site)).toBe(site.id)
        //     })
        // })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Posts', async ({ tid, testUser, posts }) => {
            const foundPosts = await find(payload, tid, {
                collection: 'posts'
            }, testUser)
            expect(foundPosts.docs).toHaveLength(1)
            expect(siteIdHelper(foundPosts.docs[0].site)).toStrictEqual(siteIdHelper(testUser.sites[0].site))
        })

        test('not read not-their Posts', async ({ tid, testUser, posts }) => {
            const notTheirPosts = posts.filter(post => {
                siteIdHelper(post.site) !== siteIdHelper(testUser.sites[0].site)
            })

            await Promise.all(notTheirPosts.map(async post => {
                return isAccessError(findByID(payload, tid, {
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
