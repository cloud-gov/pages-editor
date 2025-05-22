import type { RelationshipField } from 'payload'
import { adminField } from '@/access/admin'

export const siteField: RelationshipField = {
  name: 'site',
  type: 'relationship',
  relationTo: 'sites',
  required: true,
  defaultValue: ({ req }) => {
    return req.user?.selectedSiteId
  },
  access: {
    create: adminField,
    update: adminField,
    read: () => true,
  },
  admin: {
    disabled: true,
  }
}

export const categoriesField: RelationshipField = {
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  required: false,
}
