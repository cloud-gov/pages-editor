import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  access: {
    read: () => true,
  },
  fields: [
    {
        name: 'font',
        type: 'text'
    }
  ],
}
