import type { RelationshipField } from 'payload'
import { adminField } from '@/access/admin'

const DEFAULT_RELATIONSHIP_FIELD =
  '@/components/fields/RelationshipField#RelationshipField'

// ----------------------------
// System / hidden fields
// ----------------------------

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
    disabled: true, // leave default UI
  },
}


// ----------------------------
// Audit field
// ----------------------------

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

// ----------------------------
// Tag Types
// ----------------------------

export const tagTypeField: RelationshipField = {
  name: 'tagTypes',
  label: 'Tag Type',
  type: 'relationship',
  relationTo: 'tag-types',
  admin: {
    description: 'Select which tag type this content belongs to',
    components: {
      Field: DEFAULT_RELATIONSHIP_FIELD,
    },
    custom: {
      singularLabel: 'Tag Type',
      pluralLabel: 'Tag Types',
      labelField: 'title',
      createTitleField: 'title',
      createLabel: 'Create new Tag Type',
      placeholder: 'Select a tag type',
      allowInlineEdit: false,
      allowCreate: true,
      siteScoped: false,
    },
  },
}

// ----------------------------
// Tags
// ----------------------------

export const tagsField: RelationshipField = {
  name: 'tags',
  type: 'relationship',
  relationTo: 'tags',
  hasMany: true,
  label: 'Tags',
  admin: {
    position: 'sidebar',
    description: 'Select one or more tags to associate with this content',
    components: {
      Field: DEFAULT_RELATIONSHIP_FIELD,
    },
    custom: {
      singularLabel: 'Tag',
      pluralLabel: 'Tags',
      labelField: 'title',
      createTitleField: 'title',
      createLabel: 'Create new Tag',
      createModalDescription:
        'Tags are used to organize and filter content across the site.',
      placeholder: 'Select one or more tags',
      minChars: 2,
      maxResults: 10,
      allowInlineEdit: true,
      allowCreate: true,
      siteScoped: true,
      modalFields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          required: false,
        },
      ]
    },
  },
}

// ----------------------------
// Collection Type 
// ----------------------------

export const collectionTypeField: RelationshipField = {
  name: 'collectionType',
  label: 'Collection Type',
  type: 'relationship',
  relationTo: 'collection-types',
  hasMany: false,
  required: true,
  admin: {
    description: 'Select which collection type this page belongs to',
    components: {
      Field: DEFAULT_RELATIONSHIP_FIELD,
    },
    custom: {
      singularLabel: 'Collection Type',
      pluralLabel: 'Collection Types',
      labelField: 'title',
      createTitleField: 'title',
      createLabel: 'Create new Collection Type',
      createModalDescription:
        'Collection types are used to group and organize pages.',
      placeholder: 'Select a collection type',
      minChars: 0, // loads immediately on focus
      maxResults: 20,
      allowInlineEdit: true,
      allowCreate: true,
      siteScoped: false,
      modalFields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          admin: {
            description:
              'The display name for this collection type (e.g., "Articles", "Resources", "Blog Posts")',
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          admin: {
            description: "The collection type's description or summary",
          },
        },
        {
          name: 'layoutType',
          label: 'Layout: Are the collection items displayed in a list or card grid?',
          type: 'radio',
          defaultValue: 'list',
          options: [
            { label: 'List', value: 'list' },
            { label: 'Card Grid', value: 'grid' },
          ],
          admin: {
            layout: 'vertical',
          },
        },
      ]
    },
  },
}

// ----------------------------
// Collection Entry
// ----------------------------

export const collectionEntryField: RelationshipField = {
  name: 'collectionEntry',
  label: 'Collection Entry',
  type: 'relationship',
  relationTo: 'collection-entries',
  admin: {
    description:
      'Select which collection entry this page belongs to, if any',
    components: {
      Field: DEFAULT_RELATIONSHIP_FIELD,
    },
    custom: {
      singularLabel: 'Collection Entry',
      pluralLabel: 'Collection Entries',
      labelField: 'title',
      createTitleField: 'title',
      createLabel: 'Create new Collection Entry',
      placeholder: 'Select a collection entry',
      minChars: 2,
      maxResults: 10,
      allowInlineEdit: false,
      allowCreate: true,
      siteScoped: true,
    },
  },
}

// ----------------------------
// Side Navigation
// ----------------------------

export const sideNavigationField: RelationshipField = {
  name: 'sideNavigation',
  label: 'Side Navigation',
  type: 'relationship',
  relationTo: 'side-navigation',
  admin: {
    position: 'sidebar',
    description:
      'Select a side navigation menu to display in the sidebar for this page',
    components: {
      Field: DEFAULT_RELATIONSHIP_FIELD,
    },
    custom: {
      singularLabel: 'Navigation',
      pluralLabel: 'Navigation Items',
      labelField: 'title',
      createTitleField: 'title',
      createLabel: 'Create new Navigation',
      placeholder: 'Select navigation',
      allowInlineEdit: false,
      allowCreate: true,
      siteScoped: true,
      modalFields: [
        {
          name: 'name',
          label: 'Menu Name',
          type: 'text',
          required: true,
          admin: {
            description:
              'Internal name for this side navigation (e.g., "About Us Navigation")',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Menu Title',
          defaultValue: 'Page Navigation',
          admin: {
            description: 'The title that appears above the side navigation',
          },
        },
      ]
    },
  },
}

// ----------------------------
// Page (optional override)
// ----------------------------

export const pageField: RelationshipField = {
  name: 'page',
  label: 'Page',
  type: 'relationship',
  relationTo: 'pages',
  required: true,
  admin: {
    // optional: only override if dataset is large
    components: {
      Field: DEFAULT_RELATIONSHIP_FIELD,
    },
    custom: {
      singularLabel: 'Page',
      pluralLabel: 'Pages',
      labelField: 'title',
      placeholder: 'Select a page',
      allowInlineEdit: false,
      allowCreate: false, // typically correct for pages
      siteScoped: true,
    },
  },
}
