import { TypedEditorState } from '@payloadcms/richtext-lexical'

export interface UploadFieldProps {
  alt?: string
  caption?: TypedEditorState
  filename: string
  mimeType?: string
  filesize?: number
  prefix?: string
  reviewReady?: boolean
  site: number
  _status?: 'draft'
}

export const uploadField = ({
  alt,
  caption,
  filename,
  filesize = 123,
  mimeType = 'image/jpeg',
  prefix = '_upload',
  reviewReady = false,
  site,
  _status = 'draft',
}: UploadFieldProps): UploadFieldProps => {
  return {
    alt,
    caption,
    filename,
    filesize,
    mimeType,
    prefix,
    reviewReady,
    site,
    _status,
  }
}
