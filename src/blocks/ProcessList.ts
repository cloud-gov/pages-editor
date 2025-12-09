import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { Block } from "payload";

export const ProcessListBlock: Block = {
  slug: 'processList',
  labels: { singular: 'Process List', plural: 'Process Lists' },
  fields: [
    {
      name: 'items',
      type: 'array',
      admin: { initCollapsed: false },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'body',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
            ]
          })
        }
      ]
    }
  ]
}
