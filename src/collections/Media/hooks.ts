import { randomBytes } from 'node:crypto'

import type { CollectionBeforeValidateHook } from 'payload'
import type { Media } from '../../payload-types'

export const generateRandomHex = (size: number): string => {
  return randomBytes(size).toString('hex')
}

export const sanitizeFilename = (filename: string): string => {
  const removeAccents = (str: string): string =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const toKebabCase = (str: string): string =>
    str
      .replace(/[^a-zA-Z0-9\s.]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()

  const extensionMatch = filename.match(/\.[^.\s]{1,5}$/)
  const extension = extensionMatch ? extensionMatch[0] : ''
  const nameWithoutExtension = filename.replace(extension, '')

  const sanitized = toKebabCase(removeAccents(nameWithoutExtension))
  const truncated = sanitized.length > 100 ? sanitized.slice(0, 100) : sanitized

  return `${truncated}${extension}`
}

export const validateFileFields: CollectionBeforeValidateHook<Media> = ({ req, data, operation }) => {
  const { user } = req

  if (operation === 'create' && user && !user.isAdmin && user.selectedSiteId && data?.filename) {
    const uid = generateRandomHex(4)
    const sanitized = sanitizeFilename(data.filename)
    const filename = `${uid}-${sanitized}`

    return { ...data, filename, prefix: `uploads/${user?.selectedSiteId}/media` }
  }

  return data
}
