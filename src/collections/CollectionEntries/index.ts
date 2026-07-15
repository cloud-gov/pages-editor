import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import buildSite from '@/hooks/buildSite'
import { completeReview } from '@/hooks/completeReview'
import { syncReviewQueueAfterChange, syncReviewQueueAfterDelete } from '@/hooks/syncReviewQueue'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'
import {
  collectionTypeField,
  sideNavigationField,
  siteField,
  tagsField,
  updatedByField,
} from '@/fields/relationships'
import { contentField } from '@/fields/content'
import {
  contentDateField,
  descriptionField,
  filesField,
  imageField,
  publishedAtField,
  readyForReviewField,
  titleField,
  externalLink,
} from '@/fields/commonFields'
import { relatedItems } from '@/fields/relatedItems'
import { slugField } from '@/fields/slug'
import { getCustomCollectionLivePreview, getCustomCollectionPreview } from '@/utilities/previews'

export const CollectionEntries: CollectionConfig = {
  slug: 'collection-entries',
  labels: {
    singular: 'Collection Entry',
    plural: 'Collection Entries',
  },
  admin: {
    group: 'Your Site Content Collections',
    description:
      'Add content page entries to your collections types. All fields are available for maximum flexibility.',
    defaultColumns: ['title', 'collectionType', 'slug', 'updatedAt', 'updatedBy', '_status'],
    useAsTitle: 'title',
    hideAPIURL: true,
    livePreview: {
      url: getCustomCollectionLivePreview,
    },
    preview: getCustomCollectionPreview,
  },
  access: {
    create: getAdminOrSiteUser('collection-entries'),
    delete: getAdminOrSiteUser('collection-entries'),
    read: getAdminOrSiteUser('collection-entries', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('collection-entries'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
    collectionConfig: true,
  },
  fields: [
    // Unseen by users, but used to link entry to its collection type and for filtering in the admin
    siteField,

    // Sidebar fields
    ...slugField(),
    tagsField,
    publishedAtField,
    contentDateField,
    sideNavigationField,


    // Main container fields
    collectionTypeField,
    titleField,
    descriptionField,
    imageField,
    filesField,
    externalLink,
    contentField,
    relatedItems,
    updatedByField,
    readyForReviewField,
  ],
  hooks: {
    afterChange: [buildSite.afterChange, syncReviewQueueAfterChange],
    afterDelete: [buildSite.afterDelete, syncReviewQueueAfterDelete],
    beforeChange: [addSite, completeReview, populateUpdatedBy],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
