import type {
  ArrayField,
  CheckboxField,
  DateField,
  SelectField,
  TextField,
  UploadField,
} from 'payload'
import { hyperlinkLabel } from './hyperlinks'

export { relatedItems } from './relatedItems'
export * from './content'
export * from './relationships'
export * from './slug'

export const contentDateField: DateField = {
  name: 'contentDate',
  label: 'Content Date',
  type: 'date',
  admin: {
    position: 'sidebar',
    description: 'Optional date associated with this content',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
}

export const colorOptions = ({
  name = 'color',
  label = 'Select the color family',
  defaultValue = 'blue-warm-vivid',
  useDefaultValue = true,
}: {
  name: string
  label: string
  defaultValue?: string
  useDefaultValue?: boolean
}): SelectField => {
  return {
    name,
    label,
    type: 'select',
    options: [
      {
        label: 'Blue Cool',
        value: 'blue-cool',
      },
      {
        label: 'Blue Cool Vivid',
        value: 'blue-cool-vivid',
      },
      {
        label: 'Blue',
        value: 'blue',
      },
      {
        label: 'Blue Vivid',
        value: 'blue-vivid',
      },
      {
        label: 'Blue Warm',
        value: 'blue-warm',
      },
      {
        label: 'Blue Warm Vivd',
        value: 'blue-warm-vivid',
      },
      {
        label: 'Cyan',
        value: 'cyan',
      },
      {
        label: 'Cyan Vivid',
        value: 'cyan-vivid',
      },
      {
        label: 'Gold',
        value: 'gold',
      },
      {
        label: 'Gold Vivid',
        value: 'gold-vivid',
      },
      {
        label: 'Gray Cool',
        value: 'gray-cool',
      },
      {
        label: 'Gray',
        value: 'gray',
      },
      {
        label: 'Gray Warm',
        value: 'gray-warm',
      },
      {
        label: 'Green Cool',
        value: 'green-cool',
      },
      {
        label: 'Green Cool Vivid',
        value: 'green-cool-vivid',
      },
      {
        label: 'Geen',
        value: 'green',
      },
      {
        label: 'Green Vivid',
        value: 'green-vivid',
      },
      {
        label: 'Green Warm',
        value: 'green-warm',
      },
      {
        label: 'Green Warm Vivd',
        value: 'green-warm-vivid',
      },
      {
        label: 'Indigo Cool',
        value: 'indigo-cool',
      },
      {
        label: 'Indigo Cool Vivid',
        value: 'indigo-cool-vivid',
      },
      {
        label: 'Indigo',
        value: 'indigo',
      },
      {
        label: 'Indigo Vivid',
        value: 'indigo-vivid',
      },
      {
        label: 'Indigo Warm',
        value: 'indigo-warm',
      },
      {
        label: 'Indigo Warm Vivd',
        value: 'indigo-warm-vivid',
      },
      {
        label: 'Magenta',
        value: 'magenta',
      },
      {
        label: 'Magenta Vivid',
        value: 'magenta-vivid',
      },
      {
        label: 'Mint Cool',
        value: 'mint-cool',
      },
      {
        label: 'Mint Cool Vivid',
        value: 'mint-cool-vivid',
      },
      {
        label: 'Mint',
        value: 'mint',
      },
      {
        label: 'Mint Vivid',
        value: 'mint-vivid',
      },
      {
        label: 'Orange',
        value: 'orange',
      },
      {
        label: 'Orange Vivid',
        value: 'orange-vivid',
      },
      {
        label: 'Orange Warm',
        value: 'orange-warm',
      },
      {
        label: 'Orange Warm Vivid',
        value: 'orange-warm-vivid',
      },
      {
        label: 'Red Cool',
        value: 'red-cool',
      },
      {
        label: 'Red Cool Vivid',
        value: 'red-cool-vivid',
      },
      {
        label: 'Red',
        value: 'red',
      },
      {
        label: 'Red Vivid',
        value: 'red-vivid',
      },
      {
        label: 'Red Warm',
        value: 'red-warm',
      },
      {
        label: 'Red Warm Vivd',
        value: 'red-warm-vivid',
      },
      {
        label: 'Violet',
        value: 'violet',
      },
      {
        label: 'Violet Vivid',
        value: 'violet-vivid',
      },
      {
        label: 'Violet Warm',
        value: 'violet-warm',
      },
      {
        label: 'Violet Warm Vivd',
        value: 'violet-warm-vivid',
      },
      {
        label: 'Yellow',
        value: 'yellow',
      },
      {
        label: 'Yellow Vivid',
        value: 'yellow-vivid',
      },
    ],
    ...(useDefaultValue && { defaultValue }),
  }
}

export const descriptionField: TextField = {
  name: 'description',
  label: 'Description',
  type: 'text',
  admin: {
    description: 'A description to be used as a summary',
  },
}

export const filesField: ArrayField = {
  name: 'files',
  label: 'Files',
  type: 'array',
  admin: {
    description: 'Add downloadable files or attachments',
  },
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Optional label for the file (e.g., "Download PDF")',
      },
    },
  ],
}

export const imageField: UploadField = {
  name: 'image',
  label: 'Featured image',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'This featured image will be used as a thumbnail and cover image',
  },
}

export const publishedAtField: DateField = {
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        if (siblingData._status === 'published' && !value) {
          return new Date()
        }
        return value
      },
    ],
  },
}

export const readyForReviewField: CheckboxField = {
  name: 'reviewReady',
  label: 'Ready for Review',
  type: 'checkbox',
  defaultValue: false,
}

export const titleField: TextField = {
  name: 'title',
  type: 'text',
  required: true,
  admin: {
    description: 'The title of the entry',
  },
}

export const externalLink: any = {
  name: 'externalLink',
  label: 'External Link',
  type: 'group',
  fields: [
    hyperlinkLabel,
    {
      name: 'url',
      type: 'text',
    }
  ],
  maxRows: 1,
  admin: {
    description: 'Add an external link URL if the source of the information is on another website.',
  }
}

