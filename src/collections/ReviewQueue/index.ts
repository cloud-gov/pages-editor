import type { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { admin } from '@/access/admin'
import { siteField } from '@/fields/relationships'

// The review-queue collection stores one row per content item that has been
// marked "Ready for Review". Rows are owned and kept in sync by the
// `syncReviewQueue` hooks that run on the source collections/globals — they
// should not be edited by hand. Only managers (per site) may read the queue;
// only admins/system may write to it.
export const ReviewQueue: CollectionConfig = {
  slug: 'review-queue',
  labels: {
    singular: 'Review Item',
    plural: 'Ready for Review',
  },
  admin: {
    group: 'Site Management',
    description: 'Content that has been marked "Ready for Review" across the site.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'contentType', 'lastModified'],
    // Surfaced through the dedicated `/admin/ready-for-review` view.
    hidden: true,
    hideAPIURL: true,
  },
  access: {
    read: getAdminOrSiteUser('review-queue', ['manager']),
    create: admin,
    update: admin,
    delete: admin,
  },
  defaultSort: '-lastModified',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      // Human-readable content type shown in the table, e.g. "Page", "Alert",
      // "Footer", or the specific collection type name for collection entries.
      name: 'contentType',
      type: 'text',
      required: true,
    },
    {
      // Slug of the source collection the item lives in (e.g. "pages",
      // "footer-site-collection"). Combined with `sourceId` this uniquely
      // identifies the queue row for upsert/removal.
      name: 'sourceCollection',
      type: 'text',
      required: true,
      index: true,
    },
    {
      // The id of the source document.
      name: 'sourceId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      // Admin edit URL where the manager reviews and publishes the item.
      name: 'editUrl',
      type: 'text',
      required: true,
    },
    {
      name: 'lastModified',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    siteField,
  ],
}
