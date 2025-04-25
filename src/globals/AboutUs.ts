import type { GlobalConfig } from 'payload'
import { editor } from '@/utilities/editor'

export const AboutUs: GlobalConfig = {
  slug: 'about-us',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Single Pages'
  },
  fields: [
    {
        name: 'subtitle',
        type: 'text'
    },
    {
      name: 'content',
      type: 'richText',
      editor
    }
  ],
}
