'use client'

import React, { useRef, useState } from 'react'

import { Modal } from '@/components/Modal'
import { formatFileSize } from '@/utilities/formatFileSize'

type Props = {
  isOpen: boolean
  relationTo: string
  onCreated: (mediaId: number) => void
  onClose: () => void
}

type UploadResponse = {
  doc: {
    id: number
    filename: string
    url?: string
  }
}

async function uploadFile(
  file: File,
  altText: string,
): Promise<number> {
  const formData = new FormData()

  formData.append(
    '_payload',
    JSON.stringify({
      prefix: '_uploads',
      altText,
    }),
  )

  formData.append('file', file)

  const response = await fetch(
    '/api/media?depth=0&fallback-locale=null',
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error(
      `Upload failed (${response.status})`,
    )
  }

  const data =
    (await response.json()) as UploadResponse

  return data.doc.id
}

export const CreateMediaModal: React.FC<Props> = ({
  isOpen,
  relationTo,
  onCreated,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [altText, setAltText] = useState('')

  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = (
    file: File | null,
  ) => {
    if (!file) {
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file.')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const mediaId =
        await uploadFile(selectedFile, altText)

      onCreated(mediaId)

      onClose()
    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDragOver = (
    event: React.DragEvent,
  ) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (
    event: React.DragEvent,
  ) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (
    event: React.DragEvent,
  ) => {
    event.preventDefault()

    setIsDragging(false)

    const file =
      event.dataTransfer.files?.[0] ?? null

    handleFileSelected(file)
  }

  return (
    <Modal
      isOpen={isOpen}
      path="create-media"
      mode="create"
      title="Create New Media"
      description="Site-wide images, videos, and files used across pages and content."
      metaText={`Creating ${relationTo}`}
      fields={[]}
      values={{}}
      error={error}
      saving={saving}
      onChange={() => {}}
      onSubmit={handleUpload}
      onClose={onClose}
    >
      <div className="media-create">
        <div className="media-create__form">
          <div className="media-create__input">
            <div
              className={[
                'media-create__dropzone',
                isDragging
                  ? 'media-create__dropzone--dragging'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="gutter gutter--left gutter--right document-fields__edit">
                <div className="field-type file-field">
                  <div className="file-field__upload">
                    <div className="dropzone dropzoneStyle--default">
                      <div className="file-field__dropzoneContent">
                        <div className="file-field__dropzoneButtons">
                          <button
                            type="button"
                            className="btn btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
                            onClick={openFilePicker}
                          >
                            <span className="btn__content">
                              <span className="btn__label">Select a file</span>
                            </span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            aria-hidden="true"
                            className="file-field__hidden-input"
                            onChange={(event) => {
                              handleFileSelected(
                                event.target.files?.[0] ?? null,
                              )
                            }}
                          />
                        </div>
                        <p className="file-field__dragAndDropText">Or Drag and drop a file</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="render-fields document-fields__fields">
                  <div className="usa-form-group payload-field field-type text">
                    <label htmlFor="field-altText" className="field-label">Alt Text to describe the media and improve accessibility</label>
                    <div className="field-type__wrap">
                      <input
                        type="text"
                        className="usa-input"
                        placeholder="Describe the image"
                        value={altText}
                        onChange={(event) => {
                          setAltText(event.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedFile && (
          <>
            <div className="media-create__details">
              <p>
                <strong>Selected:</strong>{' '}
                {selectedFile.name}
              </p>

              <p>
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
