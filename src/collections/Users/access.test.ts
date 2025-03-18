import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { Site } from '@/payload-types';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError } from '@test/utils/errors';
import { getSiteId } from '@/access/preferenceHelper';

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
                        }]
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
                        email: `${user.email} (Edited)`,
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
            const siteId = siteIdHelper(testUser.sites[0].site)
            const foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            // created user, bot user, test user
            expect(foundUsers.docs).toHaveLength(3)
            foundUsers.docs.forEach(user => {
                expect(user.sites[0]).toHaveProperty('site.id', siteId)
            })
        })

        test('not read not-their Users', async ({ tid, testUser, users }) => {
            const notTheirUsers = users.filter(user => {
                siteIdHelper(user.sites[0].site) !== siteIdHelper(testUser.sites[0].site)
            })

            await Promise.all(notTheirUsers.map(async user => {
                return isAccessError(findByID(payload, tid, {
                    collection: 'users',
                    id: user.id
                }, testUser))
            }))
        })

        test('create a User for their site', async ({ tid, testUser }) => {
            const site = testUser.sites[0].site as Site
            const newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newuser@${site.name}.gov`,
                    sites: [{
                        site,
                        role: 'user'
                    }],
                }
            }, testUser)

            expect(newUser).toBeTruthy()
        })

        test('not create a User for not-their site', async ({ tid, testUser, sites }) => {
            const notTheirSites= sites.filter(site => {
                site.id !== siteIdHelper(testUser.sites[0].site)
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
                    }
                }, testUser))
            }))
        })

        test('update their Users', async ({ tid, testUser, users }) => {
            const theirUsers = (await find(payload, tid, {
                collection: 'users'
            }, testUser)).docs
            const newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: user.sites[0].site,
                            role: 'manager'
                        }],
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                expect(user.sites[0].role).toBe('manager')
            })
        })

        test('only update their Users role or sites', async ({ tid, testUser, users }) => {
            const theirUsers = (await find(payload, tid, {
                collection: 'users'
            }, testUser)).docs
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
                expect(user.sub).not.toContain('updated')
            })
        })


        test('not update not-their Users', async ({ tid, testUser, users }) => {
            const theirUsers = (await find(payload, tid, {
                collection: 'users'
            }, testUser)).docs
            const notTheirUsers = users.filter(user => {
                return !theirUsers.map(u => u.id).includes(user.id)
            })

            await Promise.all(notTheirUsers.map(async user => {
                return isAccessError(update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: user.sites[0].site,
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

            let foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            // created user, bot user, test user
            expect(foundUsers.docs).toHaveLength(3)
            foundUsers.docs.forEach(user => {
                expect(siteIdHelper(user.sites[0].site)).toBe(sites[0].id)
            })

            // switch site
            await setUserSite(payload, tid, testUser, sites[1])

            foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            expect(foundUsers.docs).toHaveLength(3)
            foundUsers.docs.forEach(user => {
                expect(user.sites.map(s => siteIdHelper(s.site))).toContain(sites[1].id)
            })

        })

        test('create a User for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})

            let site = sites[0]
            let newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newuser@${site.name}.gov`,
                    sites: [{
                        site,
                        role: 'user'
                    }],
                }
            }, testUser)

            expect(siteIdHelper(newUser.sites[0].site)).toBe(site.id)

            // switch site
            await setUserSite(payload, tid, testUser, sites[1])
            site = sites[1]

            newUser = await create(payload, tid, {
                collection: 'users',
                data: {
                    email: `newuser@${site.name}.gov`,
                    sites: [{
                        site,
                        role: 'user'
                    }],
                }
            }, testUser)

            expect(siteIdHelper(newUser.sites[0].site)).toBe(site.id)
        })

        test('update a User for all their sites, upon site selection', async ({ tid, testUser, users, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            let site = sites[0]

            let theirUsers = (await find(payload, tid, {
                collection: 'users'
            }, testUser)).docs

            let newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site,
                            role: 'manager'
                        }],
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                expect(user.sites[0].role).toBe('manager')
                expect(siteIdHelper(user.sites[0].site)).toBe(site.id)
            })

            // switch site
            await setUserSite(payload, tid, testUser, sites[1])
            site = sites[1]

            theirUsers = (await find(payload, tid, {
                collection: 'users'
            }, testUser)).docs

            newUsers = await Promise.all(theirUsers.map(async user => {
                return update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site,
                            role: 'manager'
                        }],
                    }
                }, testUser)
            }))

            newUsers.forEach(user => {
                expect(user.sites[0].role).toBe('manager')
                expect(siteIdHelper(user.sites[0].site)).toBe(site.id)
            })
        })
    })

    describe('site users can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

        test('read their Users', async ({ tid, testUser, users }) => {
            const siteId = siteIdHelper(testUser.sites[0].site)
            const foundUsers = await find(payload, tid, {
                collection: 'users'
            }, testUser)

            // created user, bot user, test user
            expect(foundUsers.docs).toHaveLength(3)
            foundUsers.docs.forEach(user => {
                expect(user.sites[0]).toHaveProperty('site.id', siteId)
            })
        })

        test('not read not-their Users', async ({ tid, testUser, users }) => {
            const notTheirUsers = users.filter(user => {
                siteIdHelper(user.sites[0].site) !== siteIdHelper(testUser.sites[0].site)
            })

            await Promise.all(notTheirUsers.map(async user => {
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
                    }
                }, testUser))
            }))
        })

        test('not update a User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return isAccessError(update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: user.sites[0].site,
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
                    }
                }, testUser))
            }))
        })

        test('not update a User', async ({ tid, testUser, users }) => {
            await Promise.all(users.map(async user => {
                return isAccessError(update(payload, tid, {
                    collection: 'users',
                    id: user.id,
                    data: {
                        sites: [{
                            site: user.sites[0].site,
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
                    isAdmin: true
                }
            }, testUser)

            expect(newUser).toHaveProperty('isAdmin', false)
        })
    })
})
