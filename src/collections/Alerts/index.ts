import type { CollectionConfig, CollectionSlug } from 'payload'
import { siteField } from '@/fields/relationships'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { completeReview } from '@/hooks/completeReview'
import { publishedAtField } from '@/fields'
import { editor } from '@/utilities/editor'

const alertsCollectionName: CollectionSlug = 'alerts' as CollectionSlug

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
    group: 'Global Assets',
    description:
      'Site-wide informational banners for announcements such as deadlines, outages, and new releases.',
    defaultColumns: ['title', 'type', 'isActive', 'publishDate', '_status'],
    livePreview: {
      url: getGlobalPreviewUrl,
    },
    preview: async({ req }) => {
      return getGlobalPreviewUrl({ req })
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
    },
    {
      name: 'content',
      label: 'Description',
      type: 'richText',
      editor,
      required: true,
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
      type: 'collapsible',
      label: 'Display options',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'slim',
          type: 'checkbox',
          label: 'Slim alert',
          defaultValue: false,
          required: true,
        },
        {
          name: 'icon',
          type: 'checkbox',
          label: 'Alert with icon',
          defaultValue: true,
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'alignment',
              type: 'radio',
              label: 'Text alignment',
              required: true,
              options: [
                {
                  label: 'Left',
                  value: 'left',
                },
                {
                  label: 'Center',
                  value: 'center',
                },
              ],
              admin: {
                layout: 'horizontal',
                width: '100%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Alert trigger',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active',
          defaultValue: false,
          required: true,
        },
      ],
    },
    siteField,
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
    publishedAtField,
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
