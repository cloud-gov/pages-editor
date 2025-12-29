import type { FieldHook } from 'payload'

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const generateRandomSlug = (length: number = 12): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const getFieldChange = (original, updated, fields: string[]): string | undefined => {
  return fields.find((field) => {
    return original[field] !== updated[field]
  })
}

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (operation === 'update' && data?.[fallback]) {
      const changedField = getFieldChange(data, originalDoc, [fallback, 'slug'])
      if (changedField === fallback && data && data.slugLock === false) {
        return data[fallback] ? formatSlug(data[fallback]) : generateRandomSlug()
      }

      if (changedField === 'slug') {
        return value ? formatSlug(value) : generateRandomSlug()
      }
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }

      return generateRandomSlug()
    }

    return value || generateRandomSlug()
  }
