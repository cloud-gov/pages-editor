import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const isDev = process.env.APP_ENV === 'dev'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  sassOptions: {
    includePaths: [
      './node_modules/@uswds/uswds/packages/',
      './node_modules/@uswds/uswds',
      './node_modules/@uswds/uswds/src/stylesheets',
      ],
  },
  productionBrowserSourceMaps: isDev,
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL
  },
  webpack: (config, { isServer }) => {
    if (isServer && isDev) {
      config.devtool = 'source-map'
    }
    return config
  }
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
