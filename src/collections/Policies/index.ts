import type { CollectionConfig } from 'payload'
import { getAdminCollectionPreview, getCollectionPreviewUrl } from '@/utilities/previews'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser, getAdmin } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { editor } from '@/utilities/editor'
import { publish } from '@/hooks/publish'
import { completeReview } from '@/hooks/completeReview'
import { siteField } from '@/fields/relationships'

export const Policies: CollectionConfig<'policies'> = {
  slug: 'policies',
  admin: {
    // group: 'Single Pages',
    description: 'Legal or informational pages such as privacy, terms of use, and accessibility.',
    defaultColumns: ['title', 'slug', 'reviewReady', 'updatedAt'],
    livePreview: {
      url: getCollectionPreviewUrl('policies'),
    },
    preview: getAdminCollectionPreview('policies'),
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('policies'),
    delete: getAdminOrSiteUser('policies'),
    read: getAdminOrSiteUser('policies', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('policies'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: '-reviewReady',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      name: 'content',
      type: 'richText',
      editor,
    },
    siteField,
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [publish],
    beforeChange: [addSite, completeReview],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
