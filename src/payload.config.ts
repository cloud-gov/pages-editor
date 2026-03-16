// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { AdminViewConfig, buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Pages } from './collections/Pages'
import { Sites } from './collections/Sites'
import { SideNavigation } from './collections/SideNavigation'
import { Menu as MenuConfig } from './globals/Menu'
import { PreFooter as PreFooterConfig } from './globals/PreFooter'
import { Footer as FooterConfig } from './globals/Footer'
import { SiteConfig as SiteConfigConfig } from './globals/SiteConfig'
import { HomePage as HomePageConfig } from './globals/HomePage'
import { NotFoundPage as NotFoundPageConfig } from './globals/NotFoundPage'
import { SearchAnalyticsPage as SearchAnalyticsPageConfig } from './globals/SearchAnalyticsPage'
import { plugins } from './plugins'
import endpoints from './endpoints'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { createSiteGlobal } from './utilities/siteGlobal'
import { afterSchemaInit } from './utilities/cascade'
import { migrations } from './migrations'
import { Alerts } from './collections/Alerts'
import { CollectionTypes } from './collections/CollectionTypes'
import { CollectionEntries } from './collections/CollectionEntries'

// Any site global fields must use the `createSiteGlobal` function
const [SiteConfig, SiteConfigCollection] = createSiteGlobal(SiteConfigConfig)
const [Menu, MenuCollection] = createSiteGlobal(MenuConfig)
const [HomePage, HomePageCollection] = createSiteGlobal(HomePageConfig)
const [Footer, FooterCollection] = createSiteGlobal(FooterConfig)
const [PreFooter, PreFooterCollection] = createSiteGlobal(PreFooterConfig)
const [NotFoundPage, NotFoundPageCollection] = createSiteGlobal(NotFoundPageConfig)
const [SearchAnalyticsPage, SearchAnalyticsPageCollection] =
  createSiteGlobal(SearchAnalyticsPageConfig)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Predeclare the roles and permissions page component to conform views values with AdminViewConfig
const UserRolesAndPermissionsView: AdminViewConfig = {
  Component: '@/components/UserRolesAndPermissions',
  path: '/sites-roles-and-permissions',
  meta: {
    title: 'Payload - Sites Roles and Permissions',
  },
}

const SiteComplianceView: AdminViewConfig = {
  Component: '@/components/SiteCompliance',
  path: '/site-compliance',
  meta: {
    title: 'Payload - Sites Compliance',
  },
}

const config = {
  admin: {
    theme: 'light' as const,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      graphics: {
        // TODO custom logo
        // whitelabeling example: https://github.com/payloadcms/payload/blob/main/examples/whitelabel/src/payload.config.ts
        Logo: '/graphics/Logo/index.tsx#Logo',
        Icon: '/graphics/Icon/index.tsx#Icon',
      },
      Nav: '@/components/CustomDashboard/Nav',
      views: {
        dashboard: {
          Component: '@/components/CustomDashboard',
        },
        userRolesAndPermissions: UserRolesAndPermissionsView,
        siteCompliance: SiteComplianceView,
      },
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
    meta: {
      titleSuffix: ' | Cloud.gov Publisher',
      icons: [
        {
          type: 'image/png',
          rel: 'icon',
          url: '/assets/favicon.ico',
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
    CollectionTypes,
    CollectionEntries,
    // Standalone Pages group
    Pages,
    // Global Assets group
    Media,
    Tags,
    // User Management group
    Users,
    // Site Configuration group
    Sites,
    SideNavigation,
    MenuCollection,
    SiteConfigCollection,
    HomePageCollection,
    FooterCollection,
    PreFooterCollection,
    NotFoundPageCollection,
    SearchAnalyticsPageCollection,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteConfig, Menu, HomePage, Footer, PreFooter, NotFoundPage, SearchAnalyticsPage],
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
