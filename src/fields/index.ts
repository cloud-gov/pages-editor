import type { DateField, TextField, UploadField } from 'payload'

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

export const descriptionField: TextField = {
  name: 'description',
  label: 'A description to be used as a summary',
  maxLength: 300,
  type: 'text',
}

export const imageField: UploadField = {
  name: 'image',
  label: 'This featured image will be used as a thumbnail and cover image',
  type: 'upload',
  relationTo: 'media',
}
