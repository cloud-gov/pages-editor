import type { CollectionConfig } from 'payload'
import { categoriesField, siteField } from '@/fields/relationships'
import { slugField } from '@/fields/slug'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import { publish } from '@/hooks/publish'
import { completeReview } from '@/hooks/completeReview'
import { editor } from '@/utilities/editor'
import { getAdminCollectionPreview, getCollectionPreviewUrl } from '@/utilities/previews'
import { descriptionField, imageField } from '@/fields'

export const Events: CollectionConfig<'events'> = {
  slug: 'events',
  admin: {
    group: 'Content Collection',
    description:
      'Details for upcoming or past events, including dates, locations, and descriptions.',
    defaultColumns: ['title', 'slug', 'startDate', 'endDate', '_status'],
    livePreview: {
      url: getCollectionPreviewUrl('events'),
    },
    preview: getAdminCollectionPreview('events'),
    useAsTitle: 'title',
    hideAPIURL: true,
  },
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
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description:
          'Details for upcoming or past events, including dates, locations, and descriptions.',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'registrationUrl',
      label: 'Registration URL',
      type: 'text',
    },
    descriptionField,
    imageField,
    siteField,
    ...slugField(),
    {
      name: 'content',
      type: 'richText',
      editor,
    },
    {
      name: 'attachments',
      label: 'Attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'pointOfContact',
      label: 'Point of Contact',
      type: 'text',
    },
    {
      name: 'pointOfContactEmail',
      label: 'Contact Email',
      type: 'email',
    },
    {
      name: 'pointOfContactPhone',
      label: 'Contact Phone',
      type: 'text',
    },
    categoriesField,
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
      name: 'format',
      label: 'Event format',
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
      name: 'eventType',
      label: 'Event type',
      type: 'radio',
      required: true,
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'onetime',
      options: [
        { label: 'One Time', value: 'onetime' },
        { label: 'Series', value: 'series' },
      ],
    },
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'showInPageNav',
      label: 'Show In-Page Navigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Display the in-page navigation sidebar on this event',
      },
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
