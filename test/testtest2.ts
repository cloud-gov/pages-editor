import type { BasePayload } from 'payload'
const payload: BasePayload = global.payload
import { expect, test } from 'vitest'
import type { LocalTestContext } from './context.types';

test<LocalTestContext>('generic starter test',  async (context) => {

    const siteName = 'test-site'

    const site = await payload.create({
        collection: 'sites',
        data: {
            name: siteName
        },
        req: {
            transactionID: context.tid
        }
    })
    expect(site.name).toBe(siteName)

    const email = "testuser@agency.gov"
    const user = await payload.create({
        collection: 'users',
        data: {
            email,
            sites: [
                {
                    site,
                    role: 'user'
                }

            ]
        },
        req: {
            transactionID: context.tid
        }
    })
    expect(user.email).toBe(email)
    expect(user.sites[0]).toHaveProperty('site.name', siteName)
    expect(user.sites[0]).toHaveProperty('role', 'user')

    const failure = await payload.find({
        collection: 'users',
        user: user,
        overrideAccess: true,
        req: {
            transactionID: context.tid
        }
    })

    console.log(failure.docs)
    expect(failure.docs).toHaveLength(2)
})
