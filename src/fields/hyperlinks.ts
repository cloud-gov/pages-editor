import { BlockFields } from '@payloadcms/richtext-lexical'
import { Block, Field } from 'payload'
import { blocks } from 'payload/shared'

const hyperlinkLabel: Field = {
  name: 'label',
  label: 'The label used for this link',
  type: 'text',
}

export const pageLinkBlock: Block = {
  slug: 'pageLink',
  labels: {
    singular: 'Page Link',
    plural: 'Page Links',
  },
  imageURL: '/assets/images/collection-entry-thumbnail.png',
  fields: [
    hyperlinkLabel,
    {
      name: 'page',
      label: 'Select the single page the menu link will link to',
      type: 'relationship',
      relationTo: 'pages',
    },
  ],
}

export const collectionTypeLinkBlock: Block = {
  slug: 'collectionTypeLink',
  labels: {
    singular: 'Collection Type',
    plural: 'Collection Types',
  },
  imageURL: '/assets/images/collection-type-thumbnail.png',
  fields: [
    hyperlinkLabel,
    {
      name: 'collectionType',
      label: 'Select the content collection the menu link will link to',
      type: 'relationship',
      relationTo: 'collection-types',
    },
  ],
}

export const collectionEntryBlock: Block = {
  slug: 'collectionEntryLink',
  labels: {
    singular: 'Collection Entry',
    plural: 'Collection Entries',
  },
  imageURL: '/assets/images/collection-entry-thumbnail.png',
  fields: [
    hyperlinkLabel,
    {
      name: 'collectionEntry',
      label: 'Select the content collection the menu link will link to',
      type: 'relationship',
      relationTo: 'collection-entries',
    },
  ],
}

export const externalLinkBlock: Block = {
  slug: 'externalLink',
  labels: {
    singular: 'External Link',
    plural: 'External Links',
  },
  admin: {
    disableBlockName: true,
  },
  imageURL: '/assets/images/external-link-thumbnail.png',
  fields: [
    hyperlinkLabel,
    {
      name: 'url',
      label: 'Url',
      type: 'text',
    },
  ],
}

export const linkBlock: Block = {
  slug: 'link',
  labels: {
    singular: 'Site Link',
    plural: 'Site Links',
  },
  admin: {
    disableBlockName: true,
  },
  imageURL: '/assets/images/link-thumbnail.png',
  fields: [
    hyperlinkLabel,
    {
      name: 'url',
      label: 'Url',
      type: 'text',
    },
  ],
}

export const dropdownBlock: Block = {
  slug: 'dropdown',
  labels: {
    singular: 'Dropdown',
    plural: 'Dropdowns',
  },
  imageURL: '/assets/images/dropdown-nav-thumbnail.png',
  fields: [
    {
      name: 'label',
      label: 'The name used on your dropdown link label',
      type: 'text',
    },
    {
      name: 'links',
      type: 'blocks',
      label: 'Links',
      blocks: [
        linkBlock,
        externalLinkBlock,
        pageLinkBlock,
        collectionTypeLinkBlock,
        collectionEntryBlock,
      ],
    },
  ],
}

export const commonLinkBlocks = [
  linkBlock,
  externalLinkBlock,
  pageLinkBlock,
  collectionTypeLinkBlock,
  collectionEntryBlock,
]