import type { Field } from 'payload'

export const MyRadioField: Field = {
  name: 'Example Custom Field',
  type: 'radio',
  options: ['radio', 'television', 'podcast', 'video']
}

export const customFields: Array<Field> = [MyRadioField];
