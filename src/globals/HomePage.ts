import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { readyForReviewField } from '@/fields'
import { contentField } from '@/fields/content'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Single Pages',
    description: 'A customizable homepage composed of flexible content blocks.',
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
    contentField,
    readyForReviewField,
  ],
}
