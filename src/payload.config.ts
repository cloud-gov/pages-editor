// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Reports } from './collections/Reports'
import { Pages } from './collections/Pages'
import { Policies } from './collections/Policies'
import { Sites } from './collections/Sites'
import { SiteConfig as SiteConfigConfig } from './globals/SiteConfig'
import { plugins } from './plugins'
import endpoints from './endpoints'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { createSiteGlobal } from './utilities/siteGlobal'
import { afterSchemaInit } from './utilities/cascade'
import { migrations } from './migrations'

const [SiteConfig, SiteConfigCollection] = createSiteGlobal(SiteConfigConfig)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = {
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
      // graphics: { // TODO custom logo
      // whitelabeling example: https://github.com/payloadcms/payload/blob/main/examples/whitelabel/src/payload.config.ts
      //   Icon: '/graphics/Icon/index.tsx#Icon',
      //   Logo: '/graphics/Logo/index.tsx#Logo',
      // },
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    afterSchemaInit,
    prodMigrations: migrations,
  }),
  collections: [
    Posts,
    Events,
    News,
    Media,
    Reports,
    Pages,
    Policies,
    Categories,
    Users,
    Sites,
    SiteConfigCollection,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteConfig],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
    schema: [
      ({ jsonSchema }) => {
        // we have to override some inferences that are made about our
        // User type. These fields should all be added or required by
        // User hooks on model creation and are required
        jsonSchema.definitions.users.properties.selectedSiteId.type = 'number'
        jsonSchema.definitions.users.properties.sub.type = 'string'
        jsonSchema.definitions.users.properties.sites.items.properties.site.oneOf[0].type = 'number'
        jsonSchema.definitions.users.properties.sites.items.required = [
          ...jsonSchema.definitions.users.properties.sites.items.required,
          'site',
        ]
        jsonSchema.definitions.users.required = [
          ...jsonSchema.definitions.users.required,
          'sub',
          'selectedSiteId',
        ]
        return jsonSchema
      },
    ],
  },
  endpoints,
}

export default buildConfig(config)
export { config }
