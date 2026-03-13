import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import buildSite from '@/hooks/buildSite'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'
import {
  contentField,
  contentDateField,
  descriptionField,
  imageField,
  publishedAtField,
  readyForReviewField,
  relatedItems,
  siteField,
  slugField,
  tagsField,
  titleField,
  updatedByField,
} from '@/fields'
import { completeReview } from '@/hooks/completeReview'
import { getAdminCollectionPreview, getPagePreviewUrl } from '@/utilities/previews'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  admin: {
    group: 'Single Pages',
    description: 'Individual pages like About or Contact that aren’t part of a content collection.',
    defaultColumns: ['title', 'slug', 'reviewReady', 'updatedAt'],
    livePreview: {
      url: getPagePreviewUrl,
    },
    preview: getAdminCollectionPreview('pages', false),
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  access: {
    create: getAdminOrSiteUser('pages'),
    delete: getAdminOrSiteUser('pages'),
    read: getAdminOrSiteUser('pages', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('pages'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: '-reviewReady',
  fields: [
    // Unseen by users, but used to link entry to its collection type and for filtering in the admin
    siteField,

    // Sidebar fields
    ...slugField(),
    tagsField,
    publishedAtField,
    contentDateField,

    // Main container fields
    titleField,
    descriptionField,
    imageField,
    contentField,
    relatedItems,
    updatedByField,
    readyForReviewField,
  ],
  hooks: {
    afterChange: [buildSite.afterChange],
    afterDelete: [buildSite.afterDelete],
    beforeChange: [addSite, completeReview, populateUpdatedBy],
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
