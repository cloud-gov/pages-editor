import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { getAdminOrUserField, getAdminOrSiteUser } from '@/access/adminOrSite'
import { afterOperationBucketSync, validateFileFields } from './hooks'
import { addSite } from '@/hooks/addSite'
import { siteField } from '@/fields/relationships'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    hidden: false,
    defaultColumns: ['filename', '_status', 'reviewReady'],
  },
  slug: 'media',
  access: {
    create: getAdminOrSiteUser('media', ['manager', 'user']),
    delete: getAdminOrSiteUser('media'),
    read: getAdminOrSiteUser('media', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('media', ['manager', 'user']),
  },
  defaultSort: '-reviewReady',
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    siteField,
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: '_status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      access: {
        create: getAdminOrUserField(['manager']),
        update: getAdminOrUserField(['manager']),
        read: () => true,
      },
    },
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: true,
      hooks: {
        beforeChange: [
          ({ previousSiblingDoc, siblingData, value }) => {
            if (
              siblingData._status === 'published' &&
              previousSiblingDoc._status === 'draft' &&
              value
            ) {
              return false
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeValidate: [validateFileFields],
    beforeChange: [addSite],
    afterOperation: [afterOperationBucketSync],
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
