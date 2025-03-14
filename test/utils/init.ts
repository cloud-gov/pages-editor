import { getPayload, buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres'
import { config } from '@payload-config'
import { v4 as uuid } from 'uuid';
import { beforeEach, afterEach } from 'vitest'
import type { LocalTestContext } from './context.types';

const initOptions = {
    secret: uuid(),
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || 'http://localhost:5432/pages_editor_test',
        }
      }),
}
const builtConfig = await buildConfig({ ...config, ...initOptions })

if (!global.payload) {
    global.payload = await getPayload({ config: builtConfig })
}

// payload.init()

beforeEach<LocalTestContext>(async (context) => {
    const tid = await global.payload.db.beginTransaction()
    // if we truly don't get a transaction back, we've broken
    // the isolation model anyway, just use 1
    context.tid = tid ?? 1
})

afterEach<LocalTestContext>(async ({ tid }) => {
    if (tid) {
        await global.payload.db.rollbackTransaction(tid)
    }
})
