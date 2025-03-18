import { getPayload, buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres'
import { config } from '@payload-config'
import { v4 as uuid } from 'uuid';
import { create } from './localHelpers';
import type { TestProject } from 'vitest/node';

const initOptions = {
    secret: uuid(),
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || 'http://localhost:5432/pages_editor_test',
        }
      }),
}

const builtConfig = await buildConfig({ ...config, ...initOptions })
const payload = await getPayload({ config: builtConfig })

async function createSites(payload, tid, names: string[]) {
    return Promise.all(names.map(async name => {
        return create(payload, tid, {
            collection: 'sites',
            data: {
                name
            },
        })
    }))
}

async function createPost(payload, tid, site, title) {
    return create(payload, tid, {
        collection: 'posts',
        data: {
            title,
            site
        }
    })
}

export default async function setup(project: TestProject) {
    const seedTransactionId = await payload.db.beginTransaction()
    if (!seedTransactionId) throw new Error('could not create seed transaction')

    try {
        const existing = await payload.find({
            collection: 'sites'
        })
        if (existing.docs.length === 0) {
            const seedSiteNames = [
                'ants.gov',
                'bears.gov',
                'chickens.gov',
                'ducks.gov',
                'elephants.gov'
            ]
            const sites = await createSites(payload, seedTransactionId, seedSiteNames)
            await Promise.all(sites.map(async site => {
                return createPost(payload, seedTransactionId, site, `${site.name} first post`)
            }))
        }
        await payload.db.commitTransaction(seedTransactionId)
    } catch (e) {
        await payload.db.rollbackTransaction(seedTransactionId)
    }
}
