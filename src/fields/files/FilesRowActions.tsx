'use client'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from '@payloadcms/ui'
import { ChevronIcon } from '@payloadcms/ui/icons/Chevron'
import { CopyIcon } from '@payloadcms/ui/icons/Copy'
import { EditIcon } from '@payloadcms/ui/icons/Edit'
import { MoreIcon } from '@payloadcms/ui/icons/More'
import { PlusIcon } from '@payloadcms/ui/icons/Plus'
import { XIcon } from '@payloadcms/ui/icons/X'

import './FilesRowActions.scss'

const baseClass = 'files-row-actions'
const arrayActionsClass = 'array-actions'

type FilesRowActionsProps = {
  addRow: (rowIndex: number) => void
  copyRow: (rowIndex: number) => void
  duplicateRow: (rowIndex: number) => void
  hasMaxRows?: boolean
  index: number
  isSortable?: boolean
  moveRow: (from: number, to: number) => void
  pasteRow: (rowIndex: number) => void
  removeRow: (rowIndex: number) => void
  rowCount: number
}

/**
 * Custom replacement for Payload's `ArrayAction`.
 *
 * Payload's `ArrayAction` relies on the `Popup` element, which positions the
 * menu by imperatively writing `style.top` / `style.left` / `--caret-left`.
 * This implementation positions the menu purely via the stylesheet and manages
 * open/close state locally, so no inline `style` attributes are produced.
 *
 * It reuses Payload's existing popup classNames (`popup__content`,
 * `popup-button-list`, `array-actions`) so it visually matches the stock
 * array-row action menu.
 */
export const FilesRowActions: React.FC<FilesRowActionsProps> = ({
  addRow,
  copyRow,
  duplicateRow,
  hasMaxRows = false,
  index,
  isSortable,
  moveRow,
  pasteRow,
  removeRow,
  rowCount,
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

  const canMoveUp = Boolean(isSortable) && index !== 0
  const canMoveDown = Boolean(isSortable) && index < rowCount - 1

  const actionClass = `popup-button-list__button ${arrayActionsClass}__action`

  return (
    <div className={`${baseClass} ${arrayActionsClass}`} ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t('general:editLabel', { label: '' })}
        className={`${baseClass}__trigger ${arrayActionsClass}__button`}
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
              {canMoveUp && (
                <button
                  className={`${actionClass} ${arrayActionsClass}__move-up`}
                  onClick={() => {
                    moveRow(index, index - 1)
                    close()
                  }}
                  role="menuitem"
                  type="button"
                >
                  <span className={`${arrayActionsClass}__action-chevron`}>
                    <ChevronIcon direction="up" />
                  </span>
                  {t('general:moveUp')}
                </button>
              )}
              {canMoveDown && (
                <button
                  className={`${actionClass} ${arrayActionsClass}__move-down`}
                  onClick={() => {
                    moveRow(index, index + 1)
                    close()
                  }}
                  role="menuitem"
                  type="button"
                >
                  <span className={`${arrayActionsClass}__action-chevron`}>
                    <ChevronIcon />
                  </span>
                  {t('general:moveDown')}
                </button>
              )}
              {!hasMaxRows && (
                <Fragment>
                  <button
                    className={`${actionClass} ${arrayActionsClass}__add`}
                    onClick={() => {
                      addRow(index + 1)
                      close()
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <PlusIcon />
                    {t('general:addBelow')}
                  </button>
                  <button
                    className={`${actionClass} ${arrayActionsClass}__duplicate`}
                    onClick={() => {
                      duplicateRow(index)
                      close()
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <CopyIcon />
                    {t('general:duplicate')}
                  </button>
                </Fragment>
              )}
              <button
                className={`${actionClass} ${arrayActionsClass}__copy`}
                onClick={() => {
                  copyRow(index)
                  close()
                }}
                role="menuitem"
                type="button"
              >
                <CopyIcon />
                {t('general:copyRow')}
              </button>
              <button
                className={`${actionClass} ${arrayActionsClass}__paste`}
                onClick={() => {
                  pasteRow(index)
                  close()
                }}
                role="menuitem"
                type="button"
              >
                <EditIcon />
                {t('general:pasteRow')}
              </button>
              <button
                className={`${actionClass} ${arrayActionsClass}__remove`}
                onClick={() => {
                  removeRow(index)
                  close()
                }}
                role="menuitem"
                type="button"
              >
                <XIcon />
                {t('general:remove')}
              </button>
            </div>
          </div>
          <div className="popup__caret" />
        </div>
      )}
    </div>
  )
}
