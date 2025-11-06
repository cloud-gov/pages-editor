import type { CollectionConfig, CollectionSlug } from 'payload'
import { siteField } from '@/fields/relationships'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'

const alertsCollectionName: CollectionSlug = 'alerts' as CollectionSlug;

export const Alerts: CollectionConfig = {
  slug: alertsCollectionName,
  access: {
    create: getAdminOrSiteUser(alertsCollectionName),
    delete: getAdminOrSiteUser(alertsCollectionName),
    read: getAdminOrSiteUser(alertsCollectionName, ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser(alertsCollectionName),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content Collection',
    description:
      'Site wide alerts to display informational banners regarding a deadline, outage, new release, etc.',
    defaultColumns: [
      'title',
      'type',
      'isActive',
      'publishDate',
      '_status',
    ],
    livePreview: {
      url: getGlobalPreviewUrl,
    },
    preview: () => {
      return `${process.env.PREVIEW_URL}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  defaultSort: ['-isActive', '-publishDate'],
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Description',
      required: true,
      editor: lexicalEditor({
        features: [
          LinkFeature({
            enabledCollections: [], // No internal links to collections
          }),
        ],
      }),
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type',
      options: [
        { label: 'Information', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Success', value: 'success' },
        { label: 'Error', value: 'error' },
        { label: 'Emergency', value: 'emergency' },
      ],
      defaultValue: 'info',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: false,
      required: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      label: 'Publish date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: "MMM d, yyyy h:mm a",
        },
      },
    },
    siteField,
  ],
  hooks: {
    afterChange: [publish],
    beforeChange: [addSite],
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
