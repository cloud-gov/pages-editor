import { getPayload, buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres'
import { config } from '@payload-config'
import { v4 as uuid } from 'uuid';
import { afterSchemaInit } from '@/utilities/cascade';

const initOptions = {
    secret: uuid(),
    db: postgresAdapter({
        pool: {
            connectionString: process.env.TEST_DATABASE_URI || 'http://localhost:5432/pages_editor_test',
        },
        // TODO: remove once this is resolved
        // https://github.com/payloadcms/payload/issues/11177
        afterSchemaInit
      }),
}

// TODO: this runs per import, it would be nice to bring it down to once per
// test suite someday

const builtConfig = await buildConfig({ ...config, ...initOptions })
global.payload = await getPayload({ config: builtConfig })
