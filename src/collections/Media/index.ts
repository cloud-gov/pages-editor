import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { afterOperationBucketSync, validateFileFields } from './hooks'
import { addSite } from '@/hooks/addSite'
import { siteField } from '@/fields/relationships'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  admin: {
    group: 'Global Assets',
    description: 'Images, documents, and media files',
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
      name: 'altText',
      label: 'Alt Text to describe the media and improve accessibility',
      type: 'text',
    },
    siteField,
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
