// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, Config, PayloadRequest } from 'payload'
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
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { getUserSiteIds } from './utilities/idHelper'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const post: Required<Config>["endpoints"][number]["method"] = "post"

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
  },
  endpoints: [{
    path: '/siteSelect',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction }) => {
      if (!req.user) {
        return Response.json({ error: 'forbidden' }, { status: 403 })
      }

      const data = await req.json()

      if (getUserSiteIds(req.user).includes(data.value)) {
        return Response.json({ error: 'forbidden' }, { status: 403 })
      }

      await req.payload.update({
        collection: 'users',
        id: req.user.id,
        data: {
          selectedSiteId: data.value
        }
      })

      return Response.json({ message: 'ok' })
    }
  }]
}

export default buildConfig(config)
export { config }
