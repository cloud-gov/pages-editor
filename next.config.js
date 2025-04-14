import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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
  productionBrowserSourceMaps: process.env.APP_ENV === 'dev',
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL
  }
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
