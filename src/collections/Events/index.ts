import type { CollectionConfig } from 'payload'

import { previewWebhook } from '@/utilities/previews'
import { siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { completeReview } from '@/hooks/completeReview'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  access: {
    create: getAdminOrSiteUser('events'),
    delete: getAdminOrSiteUser('events'),
    read: getAdminOrSiteUser('events', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('events'),
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  defaultSort: '-reviewReady',
  admin: {
    defaultColumns: ['title', 'reviewReady', 'updatedAt'],
    livePreview: {
      url: async ({ data, req }) => {
        // site isn't fetched at the necessary depth in `data`
        const site = await req.payload.findByID({
          collection: 'sites',
          id: data.site,
        })
        return `${process.env.PREVIEW_ROOT}-${site.name}.app.cloud.gov/events/${data.slug}`
      },
    },
    preview: (data) => {
      // TODO: fix per above
      return `${process.env.PREVIEW_URL}/events/${data.slug}`
    },
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    siteField,
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'format',
      type: 'radio',
      required: true,
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'inperson',
      options: [
        { label: 'In-Person', value: 'inperson' },
        { label: 'Virtual', value: 'virtual' },
      ],
    },
    {
      name: 'registrationUrl',
      label: 'Registration URL',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [previewWebhook, publish],
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
