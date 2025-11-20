// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Events } from './collections/Events'
import { Leadership } from './collections/Leadership'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Reports } from './collections/Reports'
import { Resources } from './collections/Resources'
import { Pages } from './collections/Pages'
import { Policies } from './collections/Policies'
import { Sites } from './collections/Sites'
import { PageMenus } from './collections/PageMenus'
import { Menu as MenuConfig } from './globals/Menu'
import { PreFooter as PreFooterConfig } from './globals/PreFooter'
import { Footer as FooterConfig } from './globals/Footer'
import { SiteConfig as SiteConfigConfig } from './globals/SiteConfig'
import { HomePage as HomePageConfig } from './globals/HomePage'
import { SideNavigation as SideNavigationConfig } from './globals/SideNavigation'
import { plugins } from './plugins'
import endpoints from './endpoints'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { createSiteGlobal } from './utilities/siteGlobal'
import { afterSchemaInit } from './utilities/cascade'
import { migrations } from './migrations'
import { Alerts } from './collections/Alerts'

// Any site global fields must use the `createSiteGlobal` function
const [SiteConfig, SiteConfigCollection] = createSiteGlobal(SiteConfigConfig)
const [Menu, MenuCollection] = createSiteGlobal(MenuConfig)
const [HomePage, HomePageCollection] = createSiteGlobal(HomePageConfig)
const [Footer, FooterCollection] = createSiteGlobal(FooterConfig)
const [PreFooter, PreFooterCollection] = createSiteGlobal(PreFooterConfig)
const [SideNavigation, SideNavigationCollection] = createSiteGlobal(SideNavigationConfig)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = {
  admin: {
    theme: 'light' as const,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      // graphics: { // TODO custom logo
      // whitelabeling example: https://github.com/payloadcms/payload/blob/main/examples/whitelabel/src/payload.config.ts
      //   Icon: '/graphics/Icon/index.tsx#Icon',
      //   Logo: '/graphics/Logo/index.tsx#Logo',
      // },
      views: {
        dashboard: {
          Component: '@/components/CustomDashboard',
        },
      },
    },
    groups: [
      {
        label: 'Content Collection',
        admin: {
          description: 'Content collections',
        },
      },
      {
        label: 'Single Pages',
        admin: {
          description: 'Standalone pages and policies',
        },
      },
      {
        label: 'Global Assets',
        admin: {
          description: 'Media and categories',
        },
      },
      {
        label: 'Analytics',
        admin: {
          description: 'Analytics and reporting',
        },
      },
      {
        label: 'User Management',
        admin: {
          description: 'Team members and permissions',
        },
      },
      {
        label: 'Site Configuration',
        admin: {
          description: 'Site settings and configuration',
        },
      },
    ],
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
    // Collections group
    Alerts,
    Posts,
    Events,
    News,
    Reports,
    Resources,
    Leadership,
    // Standalone Pages group
    Pages,
    Policies,
    // Global Assets group
    Media,
    Categories,
    // User Management group
    Users,
    // Site Configuration group
    Sites,
    PageMenus,
    MenuCollection,
    SiteConfigCollection,
    HomePageCollection,
    FooterCollection,
    PreFooterCollection,
    SideNavigationCollection,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteConfig, Menu, HomePage, Footer, PreFooter, SideNavigation],
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
