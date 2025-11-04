import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers';
import { test } from '@test/utils/test';
import { siteIdHelper } from '@/utilities/idHelper';
import { isAccessError, notFoundError } from '@test/utils/errors';

describe('News access',  () => {
    describe('admins can...', async () => {
        test.scoped({ defaultUserAdmin: true })

        test('read all News', async ({ tid, testUser, news }) => {
            const foundNews = await find(payload, tid, {
                collection: 'news'
            }, testUser)
            expect(foundNews.docs).toHaveLength(news.length)
        })

        test('write a News to any site', async ({ tid, testUser, sites }) => {
            const newNews = await Promise.all(sites.map(async site => {
                return create(payload, tid, {
                    collection: 'news',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser)
            }))

            expect(newNews).toHaveLength(sites.length)
        })

        test('update any News', async ({ tid, testUser, news }) => {
            const newNews = await Promise.all(news.map(async news => {
                return update(payload, tid, {
                    collection: 'news',
                    id: news.id,
                    data: {
                        title: `${news.title} (Edited)`,
                    }
                }, testUser)

            }))

            newNews.forEach(news => {
                expect(news.title).toContain('Edited')
            })

        })

        test('update showInPageNav field', async ({ tid, testUser, news }) => {
            const newsItem = news[0]
            const updatedNews = await update(payload, tid, {
                collection: 'news',
                id: newsItem.id,
                data: {
                    showInPageNav: false,
                } as any
            }, testUser)

            expect((updatedNews as any).showInPageNav).toBe(false)

            const updatedNews2 = await update(payload, tid, {
                collection: 'news',
                id: newsItem.id,
                data: {
                    showInPageNav: true,
                } as any
            }, testUser)

            expect((updatedNews2 as any).showInPageNav).toBe(true)
        })

        test('delete any News', async ({ tid, testUser, news }) => {
            await Promise.all(news.map(async news => {
                return del(payload, tid, {
                    collection: 'news',
                    id: news.id,
                }, testUser)

            }))

            const foundNews = await find(payload, tid, {
                collection: 'news'
            })
            expect(foundNews.docs.length).toBe(0)
        })
    })

    describe('site users can...', async () => {
        // TODO: this is a bug in https://github.com/vitest-dev/vitest/pull/7233
        test.scoped({ defaultUserAdmin: false })

        test('read their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const foundNews = await find(payload, tid, {
                collection: 'news'
            }, testUser)

            const expectedNews = news.filter(news => siteIdHelper(news.site) === siteId)

            expect(foundNews.docs).toHaveLength(expectedNews.length)
            foundNews.docs.forEach(news => {
                expect(siteIdHelper(news.site)).toBe(siteId)
            })
        })

        test('not read not-their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const notTheirNews = news.filter(news => siteIdHelper(news.site) !== siteId)

            await Promise.all(notTheirNews.map(async news => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'news',
                    id: news.id
                }, testUser))
            }))
        })

        test('write a News to their site', async ({ tid, testUser }) => {
            const siteId = testUser.selectedSiteId

            const newNews = await create(payload, tid, {
                collection: 'news',
                data: {
                    title: `News Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newNews).toBeTruthy()
        })

        test('not write a News to not-their site', async ({ tid, testUser, sites }) => {
            const siteId = testUser.selectedSiteId

            const notTheirSites = sites.filter(site => site.id !== siteId)

            await Promise.all(notTheirSites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'news',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('update their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const theirNews = news.filter(news => siteIdHelper(news.site) === siteId)

            const newNews = await Promise.all(theirNews.map(async news => {
                return update(payload, tid, {
                    collection: 'news',
                    id: news.id,
                    data: {
                        title: `${news.title} (Edited)`,
                    }
                }, testUser)

            }))

            newNews.forEach(news => {
                expect(news.title).toContain('Edited')
            })
        })

        test('update showInPageNav field on their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId
            const theirNews = news.filter(news => siteIdHelper(news.site) === siteId)
            const newsItem = theirNews[0]

            const updatedNews = await update(payload, tid, {
                collection: 'news',
                id: newsItem.id,
                data: {
                    showInPageNav: false,
                } as any
            }, testUser)

            expect((updatedNews as any).showInPageNav).toBe(false)
        })

        test('not update not-their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const notTheirNews = news.filter(news => siteIdHelper(news.site) !== siteId)

            await Promise.all(notTheirNews.map(async news => {
                return isAccessError(update(payload, tid, {
                    collection: 'news',
                    id: news.id,
                    data: {
                        title: `${news.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('delete their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const theirNews = news.filter(news => siteIdHelper(news.site) === siteId)

            await Promise.all(theirNews.map(news => {
                return del(payload, tid, {
                    collection: 'news',
                    id: news.id,
                }, testUser)
            }))

            const foundNews = await find(payload, tid, {
                collection: 'news'
            })
            expect(foundNews.docs.length).toBe(news.length - theirNews.length)
        })

        test('not delete not-their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const notTheirNews = news.filter(news => siteIdHelper(news.site) !== siteId)

            await Promise.all(notTheirNews.map(async news => {
                return isAccessError(del(payload, tid, {
                    collection: 'news',
                    id: news.id
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

        test('read all their News, upon site selection', async ({ tid, testUser, news, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user'})
            const siteId = testUser.selectedSiteId

            let foundNews = await find(payload, tid, {
                collection: 'news'
            }, testUser)

            let expectedNews = news.filter(news => siteIdHelper(news.site) === siteId)

            expect(foundNews.docs).toHaveLength(expectedNews.length)
            foundNews.docs.forEach(news => {
                expect(siteIdHelper(news.site)).toBe(siteId)
            })

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            foundNews = await find(payload, tid, {
                collection: 'news'
            }, testUser)

            expectedNews = news.filter(news => siteIdHelper(news.site) === newSiteId)

            expect(foundNews.docs).toHaveLength(expectedNews.length)
            foundNews.docs.forEach(news => {
                expect(siteIdHelper(news.site)).toBe(newSiteId)
            })

        })

        test('create a News for all their sites, upon site selection', async ({ tid, testUser, sites }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            let newNews = await create(payload, tid, {
                collection: 'news',
                data: {
                    title: `News Title - ${siteId}`,
                    site: siteId,
                }
            }, testUser)

            expect(newNews).toBeTruthy()
            expect(siteIdHelper(newNews.site)).toBe(siteId)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            newNews = await create(payload, tid, {
                collection: 'news',
                data: {
                    title: `News Title - ${newSiteId}`,
                    site: newSiteId,
                }
            }, testUser)

            expect(siteIdHelper(newNews.site)).toBe(newSiteId)
        })

        test('delete a News for all their sites, upon site selection', async ({ tid, testUser, sites, news }) => {
            testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager'})
            const siteId = testUser.selectedSiteId

            const theirNews = news.filter(news => siteIdHelper(news.site) === siteId)

            await Promise.all(theirNews.map(news => {
                return del(payload, tid, {
                    collection: 'news',
                    id: news.id,
                }, testUser)
            }))

            let foundNews = await find(payload, tid, {
                collection: 'news'
            })
            expect(foundNews.docs.length).toBe(news.length - theirNews.length)

            // switch site
            testUser = await setUserSite(payload, tid, testUser, sites[1].id)
            const newSiteId = testUser.selectedSiteId

            const moreNews = news.filter(news => siteIdHelper(news.site) === newSiteId)

            await Promise.all(moreNews.map(news => {
                return del(payload, tid, {
                    collection: 'news',
                    id: news.id,
                }, testUser)
            }))

            foundNews = await find(payload, tid, {
                collection: 'news'
            })
            expect(foundNews.docs.length).toBe(news.length - theirNews.length - moreNews.length)
        })
    })

    describe('bots can...', async () => {
        test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

        test('read their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const foundNews = await find(payload, tid, {
                collection: 'news'
            }, testUser)

            const expectedNews = news.filter(news => siteIdHelper(news.site) === siteId)

            expect(foundNews.docs).toHaveLength(expectedNews.length)
            foundNews.docs.forEach(news => {
                expect(siteIdHelper(news.site)).toBe(siteId)
            })
        })

        test('not read not-their News', async ({ tid, testUser, news }) => {
            const siteId = testUser.selectedSiteId

            const notTheirNews = news.filter(news => siteIdHelper(news.site) !== siteId)

            await Promise.all(notTheirNews.map(async news => {
                return notFoundError(findByID(payload, tid, {
                    collection: 'news',
                    id: news.id
                }, testUser))
            }))
        })

        test('not write a News', async ({ tid, testUser, sites }) => {
            await Promise.all(sites.map(async site => {
                return isAccessError(create(payload, tid, {
                    collection: 'news',
                    data: {
                        title: `${site.name} - Title`,
                        site,
                    }
                }, testUser))
            }))
        })

        test('not update News', async ({ tid, testUser, news }) => {
            await Promise.all(news.map(async news => {
                return isAccessError(update(payload, tid, {
                    collection: 'news',
                    id: news.id,
                    data: {
                        title: `${news.title} (Edited)`,
                    }
                }, testUser))
            }))
        })

        test('not delete News', async ({ tid, testUser, news }) => {
            await Promise.all(news.map(async news => {
                return isAccessError(del(payload, tid, {
                    collection: 'news',
                    id: news.id
                }, testUser))
            }))
        })
    })
})
