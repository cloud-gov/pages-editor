import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { editor } from '@/utilities/editor'
import { getGlobalPreviewUrl } from '@/utilities/previews'

export const NotFoundPage: GlobalConfig = {
  slug: 'not-found-page',
  label: 'Not Found 404 Page',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Global Assets',
    description: 'Customizable 404 error page.',
    livePreview: {
      url: getGlobalPreviewUrl,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Page Title',
      required: true,
      defaultValue: 'Page Not Found',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: '404 - Page Not Found',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor,
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Show Search Box',
      defaultValue: true,
    },
  ],
}
