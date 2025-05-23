import type { GlobalConfig } from 'payload'
import { editor } from '@/utilities/editor'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

export const Contact: GlobalConfig = {
  slug: 'contact',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Single Pages',
  },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      editor,
    },
  ],
}
