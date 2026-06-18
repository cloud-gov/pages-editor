'use client'

import React, { useEffect, useState } from 'react'

import {
  Modal,
  type ModalFieldConfig,
} from '@/components/Modal'

export type MediaPickerValues = {
  mediaId: number | string | null
}

type MediaOption = {
  id: number
  filename: string
  thumbnailURL?: string
}

type Props = {
  isOpen: boolean
  values: MediaPickerValues
  saving?: boolean
  error?: string | null
  onChange: (
    name: keyof MediaPickerValues,
    value: string | null,
  ) => void
  onSave: () => void
  onClose: () => void
}

const MEDIA_FIELDS: ModalFieldConfig[] = [
  {
    name: 'mediaId',
    label: 'Media ID',
    type: 'text',
    required: false,
    description:
      'Temporary field used while building the media picker.',
  },
]

export const MediaPickerModal: React.FC<Props> = ({
  isOpen,
  values,
  saving = false,
  error = null,
  onChange,
  onSave,
  onClose,
}) => {


  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const loadMedia = async () => {
      setLoading(true)

      try {
        const response = await fetch('/api/media')
        const data = await response.json()

        setMedia(data.docs ?? [])
      } finally {
        setLoading(false)
      }
    }

    void loadMedia()
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      path="hero-media-picker"
      mode="edit"
      title="Choose Image"
      description="Select an image from the media collection."
      fields={[]}
      values={{}}
      onChange={() => {}}
      onSubmit={onSave}
      onClose={onClose}
    >
      <div className="collection-list__tables">
        <div className="table-wrap">
          <div className="table">
            <table cellPadding="0" cellSpacing="0">
              <tbody>
                {media.map((item) => (
                  <tr key={item.id}>
                    <td className="cell-filename">
                  <button
                    type="button"
                    className={
                      Number(values.mediaId) === item.id
                        ? 'default-cell__first-cell media-picker__item media-picker__item--selected'
                        : 'default-cell__first-cell media-picker__item'
                    }
                    onClick={() =>
                      onChange('mediaId', String(item.id))
                    }
                  >
                    <div className="file">
                    <div className="thumbnail thumbnail--size-small file__thumbnail">
                    <img
                      src={item.thumbnailURL || item.url}
                      alt={item.filename}
                    />
                    </div>
                    <span className="file__filename">{item.filename}</span>
                    </div>
                  </button>
                   </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="media-picker-selection">
        Current selection: {values.mediaId ?? 'None'}
      </div>
    </Modal>
  )
}
