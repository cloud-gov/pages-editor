import { getPayload, buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres'
import { config } from '@payload-config'
import { v4 as uuid } from 'uuid';

const initOptions = {
    secret: uuid(),
    db: postgresAdapter({
        pool: {
            connectionString: process.env.TEST_DATABASE_URI || 'http://localhost:5432/pages_editor_test',
        },
        // TODO: remove once this is resolved
        // https://github.com/payloadcms/payload/issues/11177
        afterSchemaInit: [
            ({ schema }) => {
              const relations = ['relations_users_sites']
              relations.forEach((relation) => {
                const index = Symbol.for(`drizzle:PgInlineForeignKeys`)
                const fkeys = schema.relations[relation].table[index]
                // Loop through the foreign keys and modify them
                fkeys.forEach((foreignKey) => {
                  foreignKey.onDelete = 'CASCADE'
                  foreignKey.onUpdate = 'CASCADE'
                })
              })
              return schema
            },
          ],
      }),
}

// TODO: this runs per import, it would be nice to bring it down to once per
// test suite someday

const builtConfig = await buildConfig({ ...config, ...initOptions })
global.payload = await getPayload({ config: builtConfig })
