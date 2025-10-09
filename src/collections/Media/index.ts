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
    description: 'Site-wide images, videos, and files used across pages and content.',
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
  },
}
