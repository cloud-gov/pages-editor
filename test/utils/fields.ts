import { TypedEditorState } from '@payloadcms/richtext-lexical'

export interface UploadFieldProps {
  altText?: string
  filename: string
  mimeType?: string
  filesize?: number
  prefix?: string
  reviewReady?: boolean
  site: number
  _status?: 'draft'
}

export const uploadField = ({
  altText,
  filename,
  filesize = 123,
  mimeType = 'image/jpeg',
  prefix = '_upload',
  reviewReady = false,
  site,
  _status = 'draft',
}: UploadFieldProps): UploadFieldProps => {
  return {
    altText,
    filename,
    filesize,
    mimeType,
    prefix,
    reviewReady,
    site,
    _status,
  }
}
