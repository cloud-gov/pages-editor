import { editor } from '@/utilities/editor'
import { validateTextRequired } from '@/utilities/validators/text'
import { BlocksField } from 'payload'

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
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Hero Subtitle',
          defaultValue: 'A modern, accessible website built with the best tools',
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
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              defaultValue: '/about',
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
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Section Description',
          defaultValue: 'Discover our latest updates and important information.',
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
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Link Text',
                  defaultValue: 'Learn More',
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
  ],
}
