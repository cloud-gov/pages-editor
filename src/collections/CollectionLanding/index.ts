import { CollectionConfig } from 'payload'

export const CollectionLandingPages: CollectionConfig = {
  slug: 'collection-landing-pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
  ],
}
