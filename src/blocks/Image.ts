import { Block } from "payload";

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Select an image to display',
      },
    },
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Image description for accessibility',
      },
    },
    {
      name: 'width',
      type: 'select',
      label: 'Image Width',
      defaultValue: 'tablet',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Desktop (1024px)', value: 'desktop' },
        { label: 'Tablet (640px)', value: 'tablet' },
        { label: 'Mobile (480px)', value: 'mobile' },
        { label: 'Mobile Small (320px)', value: 'mobile-sm' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Select the maximum width for this image',
      },
    },
    {
      name: 'customWidth',
      type: 'text',
      label: 'Custom Width',
      admin: {
        condition: (data, siblingData) => siblingData?.width === 'custom' || data?.width === 'custom',
        description: 'Enter a custom width (e.g., "600px", "50%", "40rem")',
      },
    },
    {
      name: 'align',
      type: 'select',
      label: 'Alignment',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Align the image horizontally',
      },
    },
  ],
}
