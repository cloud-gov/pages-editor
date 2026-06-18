import type { ClientBlock } from 'payload'
import type { ModalFieldConfig, ModalFieldType } from '@/components/Modal'

type GenericField = Record<string, any>

export type ArrayFieldConfig = {
  name: string
  label: string
  type: 'array'
  required?: boolean
  description?: string
  disabled?: boolean
  fields?: GenericField[]
  minRows?: number
  maxRows?: number
  sourceField: GenericField
}

export type InlineBlockFieldType = 
  ModalFieldType
  | 'richText'
  | 'relationship'
  | 'array'

export type InlineBlockFieldConfig =
  | (ModalFieldConfig & {
      sourceField: GenericField
      type: ModalFieldType
    })
  | {
      name: string
      label: string
      type: 'richText'
      required?: boolean
      description?: string
      disabled?: boolean
      sourceField: GenericField
    }
  | ArrayFieldConfig

const SIMPLE_TYPES = new Set([
  'text',
  'textarea',
  'checkbox',
  'radio',
  'select',
  'upload',
  'relationship',
])

const INLINE_SUPPORTED_TYPES = new Set([
  'text',
  'textarea',
  'checkbox',
  'radio',
  'select',
  'richText',
  'upload',
  'relationship',
  'array',
])

const isSystemOrHiddenField = (field: GenericField) => {
  return (
    field.name === 'id' ||
    field.name === '_id' ||
    field.name === 'blockType' ||
    field.admin?.hidden
  )
}

function isInlineSupportedField(field: GenericField): boolean {
  if (INLINE_SUPPORTED_TYPES.has(field.type)) return true

  if (field.type === 'group') {
    return Array.isArray(field.fields)
      ? field.fields.every(isInlineSupportedField)
      : true
  }

  return false
}

function hasUnsupportedRequiredField(field: GenericField): boolean {
  if (isSystemOrHiddenField(field)) return false

  if (INLINE_SUPPORTED_TYPES.has(field.type)) return false

  if (field.type === 'group') {
    return Array.isArray(field.fields)
      ? field.fields.some(hasUnsupportedRequiredField)
      : false
  }

  if (field.required) return true

  if (
    field.type === 'array' &&
    typeof field.minRows === 'number' &&
    field.minRows > 0
  ) {
    return true
  }

  return false
}

export function isBlockSupportedInMinimalEditor(block: ClientBlock): boolean {
  if (!Array.isArray(block.fields)) return true

  return block.fields.every((field) => {
    if (isSystemOrHiddenField(field)) return true
    if (isInlineSupportedField(field)) return true
    return !hasUnsupportedRequiredField(field)
  })
}

const toOptions = (field: GenericField) => {
  if (!Array.isArray(field.options)) return undefined

  return field.options.map((opt: any) =>
    typeof opt === 'string'
      ? { label: opt, value: opt }
      : { label: opt.label, value: opt.value },
  )
}

const fieldPath = (parentPath: string | null, name: string) => {
  return parentPath ? `${parentPath}.${name}` : name
}

export function blockToInlineFields(block: ClientBlock): InlineBlockFieldConfig[] {
  const result: InlineBlockFieldConfig[] = []

  const walk = (fields: GenericField[], parentPath: string | null = null) => {
    for (const field of fields) {
      if (!field?.name) continue
      if (isSystemOrHiddenField(field)) continue

      const name = fieldPath(parentPath, field.name)
      const label = typeof field.label === 'string' ? field.label : field.name

      if (field.type === 'group') {
        if (Array.isArray(field.fields)) {
          walk(field.fields, name)
        }
        continue
      }

      if (field.type === 'richText') {
        result.push({
          name,
          label,
          type: 'richText',
          required: Boolean(field.required),
          description: field.admin?.description,
          disabled: Boolean(field.admin?.readOnly),
          sourceField: field,
        })

        continue
      }

      if (field.type === 'relationship') {
        result.push({
          name,
          label,
          type: 'relationship',
          required: Boolean(field.required),
          description: field.admin?.description,
          disabled: Boolean(field.admin?.readOnly),
          sourceField: field,
        } as any)

        continue
      }

      if (field.type === 'array') {
        result.push({
          name,
          label,
          type: 'array',
          required: Boolean(field.required),
          description: field.admin?.description,
          disabled: Boolean(field.admin?.readOnly),
          fields: field.fields,
          minRows: field.minRows,
          maxRows: field.maxRows,
          sourceField: field,
        } as any)

        continue
      }

      if (!SIMPLE_TYPES.has(field.type)) {
        continue
      }

      result.push({
        name,
        label,
        type: field.type,
        required: Boolean(field.required),
        description: field.admin?.description,
        placeholder:
          field.type === 'select'
            ? field.placeholder ?? 'Select a value'
            : field.placeholder,
        options: toOptions(field),
        disabled: Boolean(field.admin?.readOnly),
        sourceField: field,
      })
    }
  }

  walk(block.fields ?? [])

  return result
}
