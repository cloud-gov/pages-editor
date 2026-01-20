import { Block } from "payload";

// create column number options
const columnOptions = Array.from({ length: 6}, (_, i) => {
  const value = (i + 1).toString();
  return {label: value, value};
});

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Card Grid', plural: 'Card Grids'},
  fields: [
    {
      name: 'numberOfColumns',
      label: 'Number of columns',
      type: 'select',
      defaultValue: 1,
      options: columnOptions,
      admin: {
        description:
          'Select the number of columns in the card grid.'
      }
    },
    {
      name: 'cards',
      type: 'array',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Image',
          relationTo: 'media',
          admin: {
            description: 'Card image',
          }
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 300,
        },
        {
          name: 'link',
          label: 'Link Url',
          type: 'text',
        },
        {
          name: 'linkText',
          label: 'Link Text',
          type: 'text',
        },
        {
          name: 'orientation',
          type: 'select',
          defaultValue: 'vertical',
          options: [
            { label: 'Vertical', value: 'vertical'},
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Horizontal Right', value: 'horizontal-right'}
          ],
          admin: {
            description: 
              'Select vertical, horizontal, or horizontal with image to the right.'
          },
        }
      ]
    }
  ]
}
