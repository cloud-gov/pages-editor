import type { BlocksField, CollectionSlug } from 'payload'

type RelatedItems = (collectionName: string) => BlocksField

export const relatedItems: RelatedItems = (collectionName: string) => {
  return {
    name: 'relatedItems',
    label: 'Related Items',
    type: 'blocks',
    admin: {
      description: 'Add related items to display at the bottom of this page. Can include internal items or external links.',
    },
    blocks: [
      {
        slug: 'internalItem',
        labels: {
          singular: 'Internal Item',
          plural: 'Internal Items',
        },
        fields: [
          {
            name: 'item',
            type: 'relationship',
            relationTo: collectionName as CollectionSlug,
            required: true,
            admin: {
              description: `Select a related ${collectionName} item`,
            },
            filterOptions: ({ id }) => {
              return {
                id: {
                  not_equals: id,
                },
              };
            },
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Description (optional)',
            admin: {
              description: 'Optional custom description for this related item',
            },
          },
        ],
      },
      {
        slug: 'externalLink',
        labels: {
          singular: 'External Link',
          plural: 'External Links',
        },
        fields: [
          {
            name: 'title',
            type: 'text',
            label: 'Title',
            required: true,
          },
          {
            name: 'url',
            type: 'text',
            label: 'URL',
            required: true,
            admin: {
              placeholder: 'https://example.com',
            },
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Description (optional)',
            admin: {
              description: 'Brief description of the external resource',
            },
          },
        ],
      },
    ],
  }
}
