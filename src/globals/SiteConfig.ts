import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Information'
  },
  fields: [
    {
        name: 'font',
        type: 'text'
    }
  ],
}
