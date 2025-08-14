import { randomBytes } from 'node:crypto'
import type { CollectionBeforeValidateHook, CollectionAfterOperationHook } from 'payload'
import S3BucketSync from '@/utilities/s3BucketSync'
import type { Media } from '../../payload-types'

const ACCESS_KEY_ID = process.env.BUCKET_MANAGER_AWS_ACCESS_KEY_ID || ''
const SECRET_ACCESS_KEY = process.env.BUCKET_MANAGER_AWS_SECRET_ACCESS_KEY || ''
const REGION = process.env.AWS_REGION || ''
const S3_ENDPOINT = process.env.STORAGE_ENDPOINT_URL || ''
const STORAGE_FORCE_PATH_STYLE = process.env.STORAGE_FORCE_PATH_STYLE ? true : false
const SOURCE_BUCKET = process.env.SITE_METADATA_BUCKET || ''
const BUCKET_SYNC_CREDENTIALS = {
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: REGION,
  endpoint: S3_ENDPOINT,
  forcePathStyle: STORAGE_FORCE_PATH_STYLE,
}

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

export const validateFileFields: CollectionBeforeValidateHook<Media> = ({
  req,
  data,
  operation,
}) => {
  const { user } = req

  if (operation === 'create' && user && !user.isAdmin && user.selectedSiteId && data?.filename) {
    const uid = generateRandomHex(4)
    const sanitized = sanitizeFilename(data.filename)
    const filename = `${uid}-${sanitized}`

    return { ...data, filename, prefix: `uploads/${user?.selectedSiteId}/media` }
  }

  return data
}

export const afterOperationBucketSync: CollectionAfterOperationHook<'media'> = async ({
  req,
  result,
  operation,
}) => {
  const { user } = req

  const siteId = user?.selectedSiteId

  if (!siteId) {
    return result
  }

  if (['create', 'delete', 'deleteByID', 'update', 'updateByID'].includes(operation)) {
    const { bucket } = await req.payload.findByID({
      collection: 'sites',
      id: siteId,
    })

    if (!bucket) {
      throw new Error('Site bucket not found')
    }

    const sync = new S3BucketSync(BUCKET_SYNC_CREDENTIALS, SOURCE_BUCKET, bucket)
    await sync.sync(`uploads/${siteId}/media/`, '~assets/')

    return result
  }

  return result
}
