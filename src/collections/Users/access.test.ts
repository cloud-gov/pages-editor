import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';
import { getUserSiteIds } from '@/utilities/idHelper';
import { v4 as uuid } from 'uuid';

describe('Users access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Users', async ({ tid, testUser, users }) => {
            const foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)
            // the +1 represents the test user, not included in the fixture
            expect(foundUsers.docs).toHaveLength(users.length + 1)
        })

        test('write a User to any site', async ({ tid, testUser, sites }) => {
            const newUsers = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'users',
                    data: {
                        email: `newuser@${site.name}.gov`,
                        sites: [{
                            site,
                            role: 'user'
                        }],
                        selectedSiteId: site.id,
                        sub: uuid(),

                    }
                }, testUser)
            }))

            expect(newUsers).toHaveLength(sites.length)
        })

        test('update any User', async ({ tid, testUser, users }) => {
            const newUsers = await Promise.all(users.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        email: `Edited${user.email}`,
                    }
                }, testUser)

            }))

            newUsers.forEach(user => {
                expect(user.email).toContain('Edited')
            })
        })

        test('delete any User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return del(payload, tid, {
                    collection: 'users',
                    id: user.id,
                }, testUser)
            }))

            const foundUsers = await find(payload, tid, {
                collection: 'users'
            })
            // test user remains
            expect(foundUsers.docs.length).toBe(1)
        })
    })

    describe('site managers can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

        test('read their Users', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            const expectedUsers = users.filter(user => {
                return getUserSiteIds(user).includes(siteId)
            })
            // filtered users and the test user
            expect(foundUsers.docs).toHaveLength(expectedUsers.length + 1)
            foundUsers.docs.forEach(user => {
                expect(getUserSiteIds(user)).toContain(siteId)
            })
        })

        test('not read not-their Users', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const notTheirUsers = users.filter(user => {
                return !getUserSiteIds(user).includes(siteId)
            })

            await Promise.all(notTheirUsers.map(async user => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })

        test('create a User for their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newuser@agency${siteId}.gov`,
                    sites: [{
                        site: siteId,
                        role: 'user'
                    }],
                    selectedSiteId: siteId,
                    sub: uuid(),
                }
            }, testUser)

            expect(newUser).toBeTruthy()
        })

        test('not create a User for not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => {
                site.id !== siteId
            })

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'users',
                    data: {
                        email: `newuser@${site.name}.gov`,
                        sites: [{
                            site,
                            role: 'user'
                        }],
                        selectedSiteId: site.id,
                        sub: uuid(),
                    }
                }, testUser))
            }))
        })

        test('update their Users', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const theirUsers = users.filter(user => {
                return getUserSiteIds(user).includes(siteId)
            })

            const newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: siteId,
                            role: 'manager'
                        }],
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                const userSites = user.sites ?? []
                const relevantSite = userSites.find(us => siteIdHelper(us.site) === siteId)
                expect(relevantSite).toHaveProperty('role', 'manager')
            })
        })

        test('only update their Users role or sites', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const theirUsers = users.filter(user => {
                return getUserSiteIds(user).includes(siteId)
            })

            const newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        email: `${user.email} updated`,
                        sub: `${user.sub} updated`
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                expect(user.email).not.toContain('updated')
                expect(user.sub).toBe(undefined)
            })
        })


        test('not update not-their Users', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const notTheirUsers = users.filter(user => {
                return !getUserSiteIds(user).includes(siteId)
            })

            await Promise.all(notTheirUsers.map(async user => {
                return isAccessError(update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: siteId,
                            role: 'manager'
                        }],
                    }
                }, testUser))
            }))
        })

        test('not delete Users', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return isAccessError(del(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })

        test('add a site role to Users from other sites', async ({tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const notTheirUser = users.find(user => {
                return !getUserSiteIds(user).includes(siteId)
            })

            if (!notTheirUser) throw new Error('fixture error')

            await create(payload, tid, {
                collection: 'users',
                data: {
                    email: notTheirUser.email,
                    sites: [{
                        site: siteId,
                        role: 'user'
                    }],
                    selectedSiteId: notTheirUser.selectedSiteId,
                    sub: uuid(),
                }
            }, testUser)

            const user = await findByID(payload, tid, {
                collection: 'users',
                id: notTheirUser.id
            })

            expect(user.sites).toHaveLength((notTheirUser.sites ?? []).length + 1)
            expect(getUserSiteIds(user)).toContain(siteId)
        })
    })

    describe('site managers with multiple sites can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

        const addSiteToUser = async (user, tid, site) => {
            return update(payload, tid, {
                collection: 'users',
                id: user.id,
                data: {
                    sites: [...user.sites, site]
                }
            })
        }

        test('read all their Users, upon site selection', async ({ tid, testUser, users, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})

            const siteId = testUser.selectedSiteId

            let foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            let expectedUsers = users.filter(user => {
                return getUserSiteIds(user).includes(siteId)
            })
            // filtered users and the test user
            expect(foundUsers.docs).toHaveLength(expectedUsers.length + 1)
            foundUsers.docs.forEach(user => {
                expect(getUserSiteIds(user)).toContain(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            expectedUsers = users.filter(user => {
                return getUserSiteIds(user).includes(newSiteId)
            })
            // filtered users and the test user
            expect(foundUsers.docs).toHaveLength(expectedUsers.length + 1)
            foundUsers.docs.forEach(user => {
                expect(getUserSiteIds(user)).toContain(newSiteId)
            })
        })

        test('create a User for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})

            const siteId = testUser.selectedSiteId

            let newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newuser@agency${siteId}.gov`,
                    sites: [{
                        site: siteId,
                        role: 'user'
                    }],
                    selectedSiteId: siteId,
                    sub: uuid(),
                }
            }, testUser)

            expect(getUserSiteIds(newUser)).toContain(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newuser@agency${newSiteId}.gov`,
                    sites: [{
                        site: newSiteId,
                        role: 'user'
                    }],
                    selectedSiteId: newSiteId,
                    sub: uuid(),
                }
            }, testUser)

            expect(getUserSiteIds(newUser)).toContain(newSiteId)
        })

        test('update a User for all their sites, upon site selection', async ({ tid, testUser, users, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})

            const siteId = testUser.selectedSiteId

            let theirUsers = users.filter(user => {
                return getUserSiteIds(user).includes(siteId)
            })

            let newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: siteId,
                            role: 'manager'
                        }],
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                const userSites = user.sites ?? []
                const relevantSite = userSites.find(us => siteIdHelper(us.site) === siteId)
                expect(relevantSite).toHaveProperty('role', 'manager')
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)

            const newSiteId = testUser.selectedSiteId

            theirUsers = users.filter(user => {
                return getUserSiteIds(user).includes(newSiteId)
            })

            newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: newSiteId,
                            role: 'manager'
                        }],
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                const userSites = user.sites ?? []
                const relevantSite = userSites.find(us => siteIdHelper(us.site) === newSiteId)
                expect(relevantSite).toHaveProperty('role', 'manager')
            })
        })
    })

    describe('site users can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

        test('read their Users', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            const expectedUsers = users.filter(user => {
                return getUserSiteIds(user).includes(siteId)
            })
            // filtered users and the test user
            expect(foundUsers.docs).toHaveLength(expectedUsers.length + 1)
            foundUsers.docs.forEach(user => {
                expect(getUserSiteIds(user)).toContain(siteId)
            })
        })

        test('not read not-their Users', async ({ tid, testUser, users }) => {
            const siteId = testUser.selectedSiteId

            const notTheirUsers = users.filter(user => {
                return !getUserSiteIds(user).includes(siteId)
            })

            await Promise.all(notTheirUsers.map(async user => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })

        test('not create a User', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'users',
                    data: {
                        email: `newuser@${site.name}.gov`,
                        sites: [{
                            site,
                            role: 'user'
                        }],
                        selectedSiteId: site.id,
                        sub: uuid(),
                    }
                }, testUser))
            }))
        })

        test('not update a User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                const siteId = user.selectedSiteId
                return isAccessError(update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: siteId,
                            role: 'manager'
                        }],
                        selectedSiteId: siteId
                    }
                }, testUser))
            }))
        })

        test('not delete a User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return isAccessError(del(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('not read Users', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return isAccessError(findByID(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })

        test('not create a User', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'users',
                    data: {
                        email: `newuser@${site.name}.gov`,
                        sites: [{
                            site,
                            role: 'user'
                        }],
                        selectedSiteId: site.id,
                        sub: uuid(),
                    }
                }, testUser))
            }))
        })

        test('not update a User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                const siteId = user.selectedSiteId
                return isAccessError(update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: siteId,
                            role: 'manager'
                        }],
                    }
                }, testUser))
            }))
        })

        test('not delete a User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return isAccessError(del(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })
    })

    describe('general use:', async () => {
        test.scoped({ defaultUserAdmin: true })
        test('no one can create admins', async ({ tid, sites, testUser }) => {
            const newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newAdminUser@agency.gov`,
                    sites: [{
                        site: sites[0],
                        role: 'manager'
                    }],
                    selectedSiteId: sites[0].id,
                    isAdmin: true,
                    sub: uuid(),
                }
            }, testUser)

            expect(newUser).toHaveProperty('isAdmin', false)
        })


    })
})
