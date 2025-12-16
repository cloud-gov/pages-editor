import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Block } from "payload";

export const AccordionBlock: Block = {
  slug: 'accordion',
  labels: { singular: 'Accordion', plural: 'Accordions' },
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
            description: 'Heading text',
          }
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
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
