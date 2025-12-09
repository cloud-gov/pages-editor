import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Block } from "payload";

export const ProcessListBlock: Block = {
  slug: 'processList',
  labels: { singular: 'Process List', plural: 'Process Lists' },
  fields: [
    {
      name: 'headingLevel',
      type: 'select',
      defaultValue: 'h4',
      options: [
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' },
      ],
      admin: {
        description:
          'Pick the heading level that\'s one step down from your last heading (H4 is selected by default).',
      },
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: false },
      fields: [
       { 
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            width: '75%',
            description: 'Heading text',
          }
        },
        {
          name: 'body',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
            ]
          })
        },
      ]
    }
  ]
}
