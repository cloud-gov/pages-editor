// payload/globals/Menu.ts
import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { commonLinkBlocks, dropdownBlock } from '@/fields/hyperlinks'

export const Menu: GlobalConfig = {
  slug: 'menu',
  label: 'Main Navigation',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    // group: 'Site Configuration',
    description: 'Build and organize primary site navigation for pages and content sections.',
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
      name: 'items',
      type: 'blocks',
      label: 'Navigation Links',
      blocks: [...commonLinkBlocks, dropdownBlock],
    },
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
