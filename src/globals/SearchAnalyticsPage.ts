import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'

export const SearchAnalyticsPage: GlobalConfig = {
  slug: 'search-analytics-page',
  label: 'Search and Digital Analytics',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    // group: 'Site Configuration',
    description: 'Configure site search settings and digital analytics integrations.',
    livePreview: {
      url: getGlobalPreviewUrl,
    },
    components: {
      // Replace the default PublishButton with custom user-aware publish button
      elements: {
        PublishButton: '@/components/CustomPublishButton',
      },
    },
  },
  fields: [
    {
      name: 'Search',
      type: 'group',
      fields: [
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
      ]
    },
    {
      name: 'Analytics',
      type: 'group',
      fields: [
        {
          name: 'dapAgencyCode',
          label: 'DAP Agency Code',
          type: 'text',
        },
        {
          name: 'dapSubAgencyCode',
          label: 'DAP Sub Agency Code',
          type: 'text',
        },
      ]
    },
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
