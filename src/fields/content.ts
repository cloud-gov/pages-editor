import { editor } from '@/utilities/editor'
import { validateTextRequired } from '@/utilities/validators/text'
import { BlocksField, CollectionSlug } from 'payload'
import { descriptionField, titleField } from './commonFields'
import { isFormsEnabled } from '@/utilities/featureFlags'

export const richTextField = {
  name: 'content',
  type: 'richText',
  label: 'Page Content',
  editor,
  admin: {
    description: 'Main content body',
  },
}

export const contentField: BlocksField = {
  name: 'content',
  type: 'blocks',
  label: 'Page Content',
  // The formBlock is always registered (so its tables stay in the schema and
  // toggling the feature never produces a migration). When the Forms feature is
  // disabled, hide it from the editor's block picker via `filterOptions`.
  // Returning `true` allows every block; returning an explicit slug list omits
  // `formBlock`.
  filterOptions: () =>
    isFormsEnabled() ? true : ['hero', 'richText', 'cardGrid', 'textBlock'],
  blocks: [
    {
      slug: 'hero',
      labels: {
        singular: 'Hero Section',
        plural: 'Hero Sections',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Hero Title',
          required: true,
          defaultValue: 'Welcome to Our Site',
          admin: {
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            }
          }
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Hero Subtitle',
          defaultValue: 'A modern, accessible website built with the best tools',
          admin: {
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            }
          }
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Hero Description',
          defaultValue:
            'This is a description of what your site offers and why visitors should care.',
        },
        {
          name: 'bgImage',
          type: 'upload',
          label: 'Hero Background Image',
          relationTo: 'media',
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Call to Action Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Button Text',
              defaultValue: 'Get Started',
              admin: {
                components: {
                  Field: '@/components/fields/CustomTextField#CustomTextField',
                }
              }
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              defaultValue: '/about',
              admin: {
                components: {
                  Field: '@/components/fields/CustomTextField#CustomTextField',
                }
              }
            },
            {
              name: 'style',
              type: 'select',
              label: 'Button Style',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Outline', value: 'outline' },
              ],
              defaultValue: 'primary',
            },
          ],
        },
      ],
    },
    {
      slug: 'richText',
      labels: {
        singular: 'Rich Text Section',
        plural: 'Rich Text Sections',
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
          editor,
          admin: {
            description: 'Main content body',
          },
        },
      ],
    },
    {
      slug: 'cardGrid',
      labels: {
        singular: 'Card Grid',
        plural: 'Card Grids',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Featured Content',
          admin: {
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            }
          }
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Section Description',
          defaultValue: 'Discover our latest updates and important information.',
        },
        {
          name: 'amountCards',
          label: 'Amount of Cards Per Row',
          type: 'select',
          defaultValue: '3',
          options: [
            {
              label: '3',
              value: '3',
            },
            {
              label: '2',
              value: '2',
            },
            {
              label: '1',
              value: '1',
            },
          ],
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Content Cards',
          minRows: 1,
          maxRows: 90,
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Card Title',
              required: true,
              validate: validateTextRequired,
              admin: {
                components: {
                  Field: '@/components/fields/CustomTextField#CustomTextField',
                }
              }
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Card Description',
            },
            {
              name: 'image',
              type: 'upload',
              label: 'Card Image',
              relationTo: 'media',
            },
            {
              name: 'link',
              type: 'group',
              label: 'Card Link',
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  label: 'Link URL',
                  admin: {
                    components: {
                      Field: '@/components/fields/CustomTextField#CustomTextField',
                    }
                  }
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Link Text',
                  defaultValue: 'Learn More',
                  admin: {
                    components: {
                      Field: '@/components/fields/CustomTextField#CustomTextField',
                    }
                  }
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'textBlock',
      labels: {
        singular: 'Text Block',
        plural: 'Text Blocks',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Block Title',
          admin: {
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            }
          }
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Content',
          editor,
        },
        {
          name: 'bgImage',
          type: 'upload',
          label: 'Background Image',
          relationTo: 'media',
        },
      ],
    },
    // formBlock is always registered so its tables persist in the schema. It is
    // hidden from the block picker via `filterOptions` above when the Forms
    // feature is disabled.
    {
      slug: 'formBlock',
      labels: {
        singular: 'Form',
        plural: 'Forms',
      },
      fields: [
        {
          ...titleField,
          label: 'Section Title',
        },
        {
          ...descriptionField,
          label: 'Section Description',
          admin: {
            description: 'Optional text to display above the form',
          },
        },
        {
          name: 'form',
          type: 'relationship',
          label: 'Form',
          relationTo: 'site-forms' as CollectionSlug,
          required: true,
          admin: {
            description: 'Select a form to display',
          },
        },
      ],
    },
  ],
}
