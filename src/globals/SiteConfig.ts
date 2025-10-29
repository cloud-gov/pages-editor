import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { colorOptions } from '@/fields'
import { getGlobalPreviewUrl } from '@/utilities/previews'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Site Identity',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Site Configuration',
    description: 'Set global branding details like site name, logo, and typography.',
    livePreview: {
      url: getGlobalPreviewUrl,
    },
  },
  fields: [
    {
      name: 'agencyName',
      type: 'text',
      required: true,
      defaultValue: 'Agency Name',
    },
    {
      name: 'tagline',
      type: 'text',
    },
    colorOptions({
      name: 'primaryColor',
      label: 'The primary color family for the site',
      defaultValue: 'blue-warm-vivid',
    }),
    colorOptions({
      name: 'secondaryColor',
      label: 'The secondary color family for the site',
      defaultValue: 'red-vivid',
    }),
    {
      name: 'primaryFont',
      label: 'The primary font family used for the site',
      type: 'select',
      options: [
        {
          label: 'Georgia (serif)',
          value: 'georgia',
        },
        {
          label: 'Helvetica (sans-serif)',
          value: 'helvetica',
        },
        {
          label: 'Merriweather (serif)',
          value: 'merriweather',
        },
        {
          label: 'Open Sans (sans-serif)',
          value: 'open-sans',
        },
        {
          label: 'Public Sans (sans-serif)',
          value: 'public-sans',
        },
        {
          label: 'Roboto Mono (monospace)',
          value: 'roboto-mono',
        },
        {
          label: 'Source Sans Pro (sans-serif)',
          value: 'source-sans-pro',
        },
        {
          label: 'System (sans-serif)',
          value: 'system',
        },
        {
          label: 'Tahoma (sans-serif)',
          value: 'tahoma',
        },
        {
          label: 'Verdana (sans-serif)',
          value: 'verdana',
        },
      ],
      defaultValue: 'open-sans',
    },
    {
      name: 'favicon',
      label: "This image will be used as the site's favicon",
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logo',
      label: "This image will be used as the site's logo",
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'searchAccessKey',
      label: 'Key obtained from Search.gov admin center',
      type: 'text',
    },
    {
      name: 'searchAffiliate',
      label: 'Search.gov Site Handle',
      type: 'text',
    },
    {
      name: 'dapAgencyCode',
      label: 'DAP Agency Code',
      type: 'text',
    },
    {
      name: 'dapSubAgencyCode',
      label: 'DAP Sub Agency Code',
      type: 'text',
    }
  ],
}
