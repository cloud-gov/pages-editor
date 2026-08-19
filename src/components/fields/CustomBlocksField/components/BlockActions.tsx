'use client'

import React from 'react'

type BlockActionsProps = {
  blockLabel?: string
  index: number
  readOnly?: boolean
  validation?: {
    hasError: boolean
    errorCount: number
  }
  onRemove: () => void
}

const removeButtonClassName = [
  'btn',
  'LexicalEditorTheme__block__removeButton',
  'btn--icon',
  'btn--icon-style-without-border',
  'btn--icon-only',
  'btn--size-medium',
  'btn--icon-position-right',
  'btn--has-tooltip',
  'btn--withoutPopup',
  'btn--style-icon-label',
  'btn--round',
].join(' ')

export const BlockActions = ({
  blockLabel,
  index,
  readOnly,
  validation,
  onRemove,
}: BlockActionsProps) => {
  const rowNumber = String(index + 1).padStart(2, '0')

  if (readOnly && !validation?.hasError) {
    return null
  }

  return (
    <div className="collapsible__actions-wrap width-full padding-right-1 flex-column flex-align-end">
      <div className="collapsible__actions">
        {validation?.hasError ? (
          <span
            className="custom-blocks-field__warning"
            aria-label={`${validation.errorCount} required field${
              validation.errorCount === 1 ? '' : 's'
            } missing`}
          >
            {validation.errorCount}
          </span>
        ) : null}

        {!readOnly ? (
          <div className="LexicalEditorTheme__block__block-actions">
            <button
              type="button"
              aria-label={`Remove block ${rowNumber}${
                blockLabel ? `, ${blockLabel}` : ''
              }`}
              className={removeButtonClassName}
              onClick={(event) => {
                event.stopPropagation()
                onRemove()
              }}
            >
              <aside
                aria-hidden="true"
                className="tooltip btn__tooltip tooltip--caret-center tooltip--position-top opacity-0"
              >
                <div className="tooltip-content">Remove Block</div>
              </aside>

              <aside
                className="tooltip btn__tooltip tooltip--caret-center tooltip--position-bottom"
                title="Remove Block"
              >
                <div className="tooltip-content">Remove Block</div>
              </aside>

              <span className="btn__content">
                <span className="btn__icon">
                  <svg
                    className="icon icon--x"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke"
                      d="M14 6L6 14M6 6L14 14"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
