import { ClientBlock } from "payload"

export const getBlockValidationState = ({
  blockConfig,
  rowPath,
  getFieldValue,
}: {
  blockConfig: ClientBlock | null
  rowPath: string
  getFieldValue: (path: string) => unknown
}) => {
  if (!blockConfig?.fields) {
    return { hasError: false, errorCount: 0 }
  }

  let errorCount = 0

  const walk = (fields: any[], parentPath?: string) => {
    for (const field of fields) {
      if (!field?.name) continue

      const fieldPath = parentPath
        ? `${parentPath}.${field.name}`
        : `${rowPath}.${field.name}`

      if (field.type === 'group' && Array.isArray(field.fields)) {
        walk(field.fields, fieldPath)
        continue
      }

      if (!field.required) continue

      const value = getFieldValue(fieldPath)

      const isEmpty =
        value == null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

      if (isEmpty) {
        errorCount++
      }
    }
  }
  walk(blockConfig.fields)

  return {
    hasError: errorCount > 0,
    errorCount,
  }
}
