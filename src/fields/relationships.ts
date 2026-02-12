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
  },
}

export const tagsField: RelationshipField = {
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true,
  required: false,
  label: 'Tags',
}

export const sideNavigationField: RelationshipField = {
  name: 'sideNavigation',
  type: 'relationship',
  relationTo: 'side-navigation',
  label: 'Side Navigation',
  admin: {
    description: 'Select a side navigation menu to display in the sidebar for this page',
    position: 'sidebar',
  },
}

export const collectionTypeField: RelationshipField = {
  name: 'collectionType',
  label: 'Collection Type',
  type: 'relationship',
  relationTo: 'collection-types',
  required: true,
  admin: {
    description: 'Select which collection type this page belongs to',
  },
}

export const collectionEntryField: RelationshipField = {
  name: 'collectionEntry',
  label: 'Collection Entry',
  type: 'relationship',
  relationTo: 'collection-entries',
  required: false,
  admin: {
    description: 'Select which collection entry this page belongs to, if any',
  },
}

export const pageField: RelationshipField = {
  name: 'page',
  type: 'relationship',
  relationTo: 'pages',
  label: 'Page',
  required: true,
}


export const updatedByField: RelationshipField = {
  name: 'updatedBy',
  type: 'relationship',
  relationTo: 'users',
  admin: {
    readOnly: true,
    components: {
      Cell: 'src/components/UpdatedByCellData/',
    },
  },
}