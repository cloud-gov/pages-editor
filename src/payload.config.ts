// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Sites } from './collections/Sites'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import endpoints from './endpoints'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from '@/utilities/getURL'

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
  }),
  collections: [Pages, Posts, Media, Categories, Users, Sites],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
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
          'sub', 'selectedSiteId',
        ]
        return jsonSchema
      },
    ]
  },
  endpoints
}

export default buildConfig(config)
export { config }
