import type { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Information',
  },
  fields: [
    {
      name: 'font',
      type: 'text',
    },
    {
      name: 'agencyName',
      type: 'text',
      required: true,
      defaultValue: 'Agency Name',
    },
  ],
}
