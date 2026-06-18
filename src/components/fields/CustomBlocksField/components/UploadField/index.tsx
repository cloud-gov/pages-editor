'use client'

import React, { useEffect, useState } from 'react'

import {
  MediaPickerModal,
  type MediaPickerValues,
} from './MediaPickerModal'
import { formatFileSize } from '@/utilities/formatFileSize'
import { CreateMediaModal } from './CreateMediaModal'

type UploadFieldProps = {
  label: string
  value: string | null
  relationTo?: string
  required?: boolean
  disabled?: boolean
  onChange: (value: number | null) => void
}

export const UploadField = ({
  label,
  value,
  relationTo,
  required,
  disabled,
  onChange,
}: UploadFieldProps) => {
  const [isMediaPickerOpen, setIsMediaPickerOpen] =
    useState(false)

  const [pickerValues, setPickerValues] =
    useState<MediaPickerValues>({
      mediaId:
        value !== null
          ? String(value)
          : null,
    })

  const [mediaDetails, setMediaDetails] = useState<any | null>(null)
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [isCreateMediaOpen, setIsCreateMediaOpen] = useState(false)

  useEffect(() => {
    if (!value) {
      setMediaDetails(null)
      return
    }

    const loadMedia = async () => {
      setLoadingMedia(true)

      try {
        const response = await fetch(
          `/api/media/${value}`,
        )

        const media = await response.json()

        setMediaDetails(media)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingMedia(false)
      }
    }

    void loadMedia()
  }, [value])

  const openMediaPicker = () => {
    setPickerValues({
      mediaId:
        typeof value === 'number'
          ? value
          : null,
    })

    setIsMediaPickerOpen(true)
  }

  const handleRemove = () => {
    setMediaDetails(null)

    onChange(null)
  }

  const handleCreateNew = () => {

    setIsCreateMediaOpen(true)
  }

  return (
    <>
      <div className="field-type upload">
        <label className="field-label">
          {label}
        </label>

        <div className="upload__wrap">
          {value ? (
            <div className="upload__fileDetails">
              {mediaDetails && (
                <div className="upload__dropzoneAndUpload">
                  <div className="upload-field-card upload upload--has-one upload-field-card--size-medium">
                    <div className="upload-relationship-details">
                      <div className="upload-relationship-details__imageAndDetails">
                        <div className="thumbnail thumbnail--size-small upload-relationship-details__thumbnail">
                          <img alt={mediaDetails.altText} src={mediaDetails.url} />
                        </div>
                        <div className="upload-relationship-details__details">
                          <p className="upload-relationship-details__filename">
                            <a href={mediaDetails.url} target="_blank">{mediaDetails.filename}</a>
                          </p>
                          <p className="upload-relationship-details__meta">{formatFileSize(mediaDetails.filesize)} — {mediaDetails.width}x{mediaDetails.height} — {mediaDetails.mimeType}</p>
                        </div>
                      </div>
                      <div className="upload-relationship-details__actions">
                        <button 
                          type="button" 
                          className="btn upload-relationship-details__edit btn--icon btn--icon-style-none btn--icon-only btn--size-medium btn--icon-position-right btn--withoutPopup btn--style-icon-label btn--withoutPopup"
                          onClick={openMediaPicker}
                        >
                          <span className="btn__content">
                            <span className="btn__icon">
                              <svg className="icon icon--edit" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path className="stroke" d="M9.68531 4.62938H5.2634C4.92833 4.62938 4.60698 4.76248 4.37004 4.99942C4.13311 5.23635 4 5.5577 4 5.89278V14.7366C4 15.0717 4.13311 15.393 4.37004 15.63C4.60698 15.8669 4.92833 16 5.2634 16H14.1072C14.4423 16 14.7636 15.8669 15.0006 15.63C15.2375 15.393 15.3706 15.0717 15.3706 14.7366V10.3147M13.7124 4.39249C13.9637 4.14118 14.3046 4 14.66 4C15.0154 4 15.3562 4.14118 15.6075 4.39249C15.8588 4.6438 16 4.98464 16 5.34004C16 5.69544 15.8588 6.03629 15.6075 6.28759L9.91399 11.9817C9.76399 12.1316 9.57868 12.2413 9.37515 12.3008L7.56027 12.8314C7.50591 12.8472 7.44829 12.8482 7.39344 12.8341C7.33859 12.8201 7.28853 12.7915 7.24849 12.7515C7.20845 12.7115 7.17991 12.6614 7.16586 12.6066C7.15181 12.5517 7.15276 12.4941 7.16861 12.4397L7.69924 10.6249C7.75896 10.4215 7.86888 10.2364 8.01888 10.0866L13.7124 4.39249Z" strokeLinecap="square"></path>
                              </svg>
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="btn upload-relationship-details__remove btn--icon btn--icon-style-none btn--icon-only btn--size-medium btn--icon-position-right btn--withoutPopup btn--style-icon-label btn--withoutPopup"
                          onClick={handleRemove}
                        >
                          <span className="btn__content">
                            <span className="btn__icon">
                              <svg className="icon icon--x" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                <path className="stroke" d="M14 6L6 14M6 6L14 14" strokeLinecap="square"></path>
                              </svg>
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          ) : (
            <div className="upload__dropzoneAndUpload">
              <div className="dropzone dropzoneStyle--default">
                <div className="upload__dropzoneContent">
                  <div className="upload__dropzoneContent__buttons">
                    <button
                      type="button"
                      className="btn upload__createNewToggler btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill"
                      onClick={handleCreateNew}
                      disabled={disabled}
                    >
                      <span className="btn__content">
                        <span className="btn__label">
                          Create New
                        </span>
                      </span>
                    </button>

                    <span className="upload__dropzoneContent__orText">
                      Or
                    </span>

                    <button
                      type="button"
                      className="btn upload__listToggler btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill"
                      onClick={openMediaPicker}
                    >
                      Choose from existing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        values={pickerValues}
        onChange={(name, nextValue) => {

          setPickerValues((current) => {
            const updated = {
              ...current,
              [name]: nextValue,
            }

            return updated
          })
        }}
        onSave={() => {

          onChange(
            pickerValues.mediaId
              ? Number(pickerValues.mediaId)
              : null,
          )

          setIsMediaPickerOpen(false)
        }}
        onClose={() => {
          setIsMediaPickerOpen(false)
        }}
      />
      <CreateMediaModal
        isOpen={isCreateMediaOpen}
        relationTo={relationTo ?? 'media'}
        onCreated={(mediaId) => {

          onChange(mediaId)
        }}
        onClose={() => {
          setIsCreateMediaOpen(false)
        }}
      />
    </>
  )
}
