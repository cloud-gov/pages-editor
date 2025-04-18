import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';
import { Event } from '@/payload-types';

const fieldsToFill: Pick<Event, 'startDate' | 'format' | 'description'> = {
    startDate: new Date().toISOString(),
    format: 'inperson',
    description: 'a great new event'
}

describe('Events access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all Events', async ({ tid, testUser, events }) => {
            const foundEvents = await find(payload, tid, {
                collection: 'events'
            }, testUser)
            expect(foundEvents.docs).toHaveLength(events.length)
        })

        test('write a Event to any site', async ({ tid, testUser, sites }) => {
            const newEvents = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'events',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                        ...fieldsToFill,
                    }
                }, testUser)
            }))

            expect(newEvents).toHaveLength(sites.length)
        })

        test('update any Event', async ({ tid, testUser, events }) => {
            const newEvents = await Promise.all(events.map(async event => {
                return update(payload, tid, {
                    collection: 'events',
                    id: event.id,
                    data: {
                        title: `${event.title} (Edited)`,
                    }
                }, testUser)

            }))

            newEvents.forEach(event => {
                expect(event.title).toContain('Edited')
            })

        })

        test('delete any Event', async ({ tid, testUser, events }) => {
            await Promise.all(events.map(async event => {
                return del(payload, tid, {
                    collection: 'events',
                    id: event.id,
                }, testUser)

            }))

            const foundEvents = await find(payload, tid, {
                collection: 'events'
            })
            expect(foundEvents.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const foundEvents = await find(payload, tid, {
                collection: 'events'
            }, testUser)

            const expectedEvents = events.filter(event => siteIdHelper(event.site) === siteId)

            expect(foundEvents.docs).toHaveLength(expectedEvents.length)
            foundEvents.docs.forEach(event => {
                expect(siteIdHelper(event.site)).toBe(siteId)
            })
        })

        test('not read not-their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const notTheirEvents = events.filter(event => siteIdHelper(event.site) !== siteId)

            await Promise.all(notTheirEvents.map(async event => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'events',
                    id: event.id
                }, testUser))
            }))
        })

        test('write a Event to their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newEvent = await create(payload, tid, {
                collection: 'events',
                data: {
                    title: `Event Title - ${siteId}`,
                    site: siteId,
                    ...fieldsToFill,
                }
            }, testUser)

            expect(newEvent).toBeTruthy()
        })

        test('not write a Event to not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'events',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                        ...fieldsToFill,
                    }
                }, testUser))
            }))
        })

        test('update their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const theirEvents = events.filter(event => siteIdHelper(event.site) === siteId)

            const newEvents = await Promise.all(theirEvents.map(async event => {
                return update(payload, tid, {
                    collection: 'events',
                    id: event.id,
                    data: {
                        title: `${event.title} (Edited)`,
                    }
                }, testUser)

            }))

            newEvents.forEach(event => {
                expect(event.title).toContain('Edited')
            })
        })

        test('not update not-their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const notTheirEvents = events.filter(event => siteIdHelper(event.site) !== siteId)

            await Promise.all(notTheirEvents.map(async event => {
                return isAccessError(update(payload, tid, {
                    collection: 'events',
                    id: event.id,
                    data: {
                        title: `${event.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('delete their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const theirEvents = events.filter(event => siteIdHelper(event.site) === siteId)

            await Promise.all(theirEvents.map(event => {
                return del(payload, tid, {
                    collection: 'events',
                    id: event.id,
                }, testUser)
            }))

            const foundEvents = await find(payload, tid, {
                collection: 'events'
            })
            expect(foundEvents.docs.length).toBe(events.length - theirEvents.length)
        })

        test('not delete not-their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const notTheirEvents = events.filter(event => siteIdHelper(event.site) !== siteId)

            await Promise.all(notTheirEvents.map(async event => {
                return isAccessError(del(payload, tid, {
                    collection: 'events',
                    id: event.id
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

        test('read all their Events, upon site selection', async ({ tid, testUser, events, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})
            const siteId = testUser.selectedSiteId

            let foundEvents = await find(payload, tid, {
                collection: 'events'
            }, testUser)

            let expectedEvents = events.filter(event => siteIdHelper(event.site) === siteId)

            expect(foundEvents.docs).toHaveLength(expectedEvents.length)
            foundEvents.docs.forEach(event => {
                expect(siteIdHelper(event.site)).toBe(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundEvents = await find(payload, tid, {
                collection: 'events'
            }, testUser)

            expectedEvents = events.filter(event => siteIdHelper(event.site) === newSiteId)

            expect(foundEvents.docs).toHaveLength(expectedEvents.length)
            foundEvents.docs.forEach(event => {
                expect(siteIdHelper(event.site)).toBe(newSiteId)
            })

        })

        test('create a Event for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            let newEvent = await create(payload, tid, {
                collection: 'events',
                data: {
                    title: `Event Title - ${siteId}`,
                    site: siteId,
                    ...fieldsToFill,
                }
            }, testUser)

            expect(newEvent).toBeTruthy()
            expect(siteIdHelper(newEvent.site)).toBe(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newEvent = await create(payload, tid, {
                collection: 'events',
                data: {
                    title: `Event Title - ${newSiteId}`,
                    site: newSiteId,
                    ...fieldsToFill,
                }
            }, testUser)

            expect(siteIdHelper(newEvent.site)).toBe(newSiteId)
        })

        test('delete a Event for all their sites, upon site selection', async ({ tid, testUser, sites, events }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            const theirEvents = events.filter(event => siteIdHelper(event.site) === siteId)

            await Promise.all(theirEvents.map(event => {
                return del(payload, tid, {
                    collection: 'events',
                    id: event.id,
                }, testUser)
            }))

            let foundEvents = await find(payload, tid, {
                collection: 'events'
            })
            expect(foundEvents.docs.length).toBe(events.length - theirEvents.length)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            const moreEvents = events.filter(event => siteIdHelper(event.site) === newSiteId)

            await Promise.all(moreEvents.map(event => {
                return del(payload, tid, {
                    collection: 'events',
                    id: event.id,
                }, testUser)
            }))

            foundEvents = await find(payload, tid, {
                collection: 'events'
            })
            expect(foundEvents.docs.length).toBe(events.length - theirEvents.length - moreEvents.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const foundEvents = await find(payload, tid, {
                collection: 'events'
            }, testUser)

            const expectedEvents = events.filter(event => siteIdHelper(event.site) === siteId)

            expect(foundEvents.docs).toHaveLength(expectedEvents.length)
            foundEvents.docs.forEach(event => {
                expect(siteIdHelper(event.site)).toBe(siteId)
            })
        })

        test('not read not-their Events', async ({ tid, testUser, events }) => {
            const siteId = testUser.selectedSiteId

            const notTheirEvents = events.filter(event => siteIdHelper(event.site) !== siteId)

            await Promise.all(notTheirEvents.map(async event => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'events',
                    id: event.id
                }, testUser))
            }))
        })

        test('not write a Event', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'events',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                        ...fieldsToFill,
                    }
                }, testUser))
            }))
        })

        test('not update Events', async ({ tid, testUser, events }) => {
            await Promise.all(events.map(async event => {
                return isAccessError(update(payload, tid, {
                    collection: 'events',
                    id: event.id,
                    data: {
                        title: `${event.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete Events', async ({ tid, testUser, events }) => {
            await Promise.all(events.map(async event => {
                return isAccessError(del(payload, tid, {
                    collection: 'events',
                    id: event.id
                }, testUser))
            }))
        })
    })
})
