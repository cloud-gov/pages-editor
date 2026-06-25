'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from '@payloadcms/ui'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { EditIcon } from '@payloadcms/ui/icons/Edit'
import { MoreIcon } from '@payloadcms/ui/icons/More'

import './index.scss'

const baseClass = 'files-field-actions'
const arrayActionsClass = 'array-actions'

type FilesFieldActionsProps = {
  allowCopy?: boolean
  allowPaste?: boolean
  copyField: () => void
  disabled?: boolean
  pasteField: () => void
}

export const FilesFieldActions: React.FC<FilesFieldActionsProps> = ({
  allowCopy = true,
  allowPaste = true,
  copyField,
  disabled,
  pasteField,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])

  if (!allowCopy && !allowPaste) {
    return null
  }

  const actionClass = `popup-button-list__button ${arrayActionsClass}__action`

  return (
    <div className={`${baseClass} ${arrayActionsClass}`} ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t('general:editLabel', { label: '' })}
        className={`${baseClass}__trigger ${arrayActionsClass}__button`}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <MoreIcon />
      </button>
      {isOpen && (
        <div className={`${baseClass}__content popup__content popup--size-medium popup--v-bottom`}>
          <div className="popup__scroll-container">
            <div
              className="popup-button-list popup-button-list__text-align--left popup-button-list__button-size--small"
              role="menu"
            >
              <button
                className={`${actionClass} ${arrayActionsClass}__copy`}
                disabled={!allowCopy}
                onClick={() => {
                  copyField()
                  close()
                }}
                role="menuitem"
                type="button"
              >
                <CopyIcon />
                {t('general:copyField')}
              </button>
              <button
                className={`${actionClass} ${arrayActionsClass}__paste`}
                disabled={!allowPaste}
                onClick={() => {
                  pasteField()
                  close()
                }}
                role="menuitem"
                type="button"
              >
                <EditIcon />
                {t('general:pasteField')}
              </button>
            </div>
          </div>
          <div className="popup__caret" />
        </div>
      )}
    </div>
  )
}
