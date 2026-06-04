import { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
      components: {
        Field: '@/components/fields/CustomTextField#CustomTextField',
      },
    },
  },
  {
    name: 'meta',
    label: 'Meta',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        admin: {
          components: {
            Field: '@/components/fields/CustomTextField#CustomTextField',
          },
        }
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
        admin: {
          components: {
            Field: '@/components/fields/CustomTextField#CustomTextField',
          },
        }
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: 'Tags',
    name: 'tags',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
        admin: {
          components: {
            Field: '@/components/fields/CustomTextField#CustomTextField',
          },
        }
      },
      {
        name: 'id',
        type: 'text',
        admin: {
          components: {
            Field: '@/components/fields/CustomTextField#CustomTextField',
          },
        }
      },
      {
        name: 'title',
        type: 'text',
        admin: {
          components: {
            Field: '@/components/fields/CustomTextField#CustomTextField',
          },
        }
      },
    ],
  },
]
