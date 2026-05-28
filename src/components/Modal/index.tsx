/* TODO: move to components for reusability */

'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import styles from './Modal.module.scss'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  path: string
  mode: 'create' | 'edit'
  description?: string
  titleValue: string
  error?: string | null
  saving?: boolean
  onTitleChange: (next: string) => void
  onSubmit: () => void
  onClose: () => void
  // Optional: show a meta line like "Creating new Tag" to mirror doc-controls
  metaText?: string
}

export function Modal({
  isOpen,
  path,
  mode,
  description,
  titleValue,
  error,
  saving,
  onTitleChange,
  onSubmit,
  onClose,
  metaText,
}: Props) {
  const headingId = useMemo(() => `doc-drawer_${path}__heading`, [path])
  const dialogId = useMemo(() => `doc-drawer_${path}`, [path])
  const inputId = useMemo(() => `create-${path}-title`, [path])

  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const initialFocusRef = useRef<HTMLInputElement | null>(null)

  // Basic focus management: focus title input on open
  useEffect(() => {
    if (!isOpen) return
    // If <dialog> is supported, ensure it is "open" and focus input.
    // We intentionally avoid showModal() to keep markup simple and avoid UA-added inline styles.
    // (USWDS modal wrapper/backdrop provides the overlay behavior.)
    requestAnimationFrame(() => {
      initialFocusRef.current?.focus()
    })
  }, [isOpen])

  // Escape closes
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const headingText = mode === 'edit' ? 'Edit Tag' : 'Create new Tag'
  const primaryButtonText =
    saving ? (mode === 'edit' ? 'Saving…' : 'Creating…') : (mode === 'edit' ? 'Save' : 'Create')

  return createPortal(
    <div className={styles.modalContainer}>
      {/* Drawer-style dialog shell (no inline z-index; set via CSS class) */}
      <dialog
        ref={dialogRef}
        id={dialogId}
        className={[
          'payload__modal-item',
          `payload__modal-item--slug-${dialogId}`,
          'doc-drawer',
          'drawer',
          'drawer--is-open',
          'payload__modal-item--appearDone',
          'payload__modal-item--enterDone',
          'payload-rel-drawer', // <-- hook class to override styles without inline attrs
        ].join(' ')}
        open
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className="drawer__blur-bg" />

        <button
          aria-label="Close"
          className="drawer__close"
          type="button"
          onClick={onClose}
        />

        {/* Content wrapper (Payload sets width inline; do it via CSS class) */}
        <div className="drawer__content payload-rel-drawer__content">
          <div className="drawer__blur-bg-content" />

          <div className="gutter drawer__content-children">
            <main className="collection-edit collection-edit--tags">
              {/* Header */}
              <div className="gutter gutter--left gutter--right doc-drawer__header">
                <div className="doc-drawer__header-content">
                  <h2 className="doc-drawer__header-text" id={headingId}>
                    <span className="render-title" title={headingText}>
                      {headingText}
                    </span>
                  </h2>

                  <button
                    aria-label="Close"
                    className="doc-drawer__header-close"
                    type="button"
                    onClick={onClose}
                  >
                    <svg className="icon icon--x" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path className="stroke" d="M14 6L6 14M6 6L14 14" stroke-linecap="square"></path>
                    </svg>
                  </button>
                </div>

                {description && (
                  <div className="doc-drawer__after-header">
                    <div className="custom-view-description">{description}</div>
                  </div>
                )}
              </div>

              {/* Controls row (Save button area) */}
              <div className="gutter gutter--left gutter--right doc-controls">
                <div className="doc-controls__wrapper">
                  <div className="doc-controls__content">
                    <ul className="doc-controls__meta">
                      <li className="doc-controls__list-item">
                        <p className="doc-controls__value">
                          {metaText ?? (mode === 'edit' ? 'Editing Tag' : 'Creating new Tag')}
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="doc-controls__controls-wrapper">
                    <div className="doc-controls__controls">
                      <div className="form-submit">
                        <button
                          type="button"
                          className="btn btn--size-medium btn--style-primary"
                          onClick={onSubmit}
                          disabled={Boolean(saving)}
                        >
                          <span className="btn__content">
                            <span className="btn__label">{primaryButtonText}</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          className="btn btn--size-medium btn--style-none"
                          onClick={onClose}
                          disabled={Boolean(saving)}
                        >
                          <span className="btn__content">
                            <span className="btn__label">Cancel</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="doc-controls__divider" />
              </div>

              {/* Main body (fields) */}
              <div className="collection-edit__main-wrapper">
                <div className="collection-edit__main">
                  <div className="document-fields document-fields--has-sidebar">
                    <div className="document-fields__main">
                      <div className="gutter gutter--left gutter--right document-fields__edit">
                        <div className="render-fields document-fields__fields">
                          {error && (
                            <div className="usa-alert usa-alert--error" role="alert">
                              <div className="usa-alert__body">
                                <p className="usa-alert__text">{error}</p>
                              </div>
                            </div>
                          )}

                          <div className="field-type text payload-rel-drawer__field">
                            <label className="field-label" htmlFor={inputId}>
                              Title<span className="required">*</span>
                            </label>
                            <div className="field-type__wrap">
                              <input
                                ref={initialFocusRef}
                                id={inputId}
                                type="text"
                                value={titleValue}
                                name="title"
                                onChange={(e) => onTitleChange(e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="document-fields__sidebar-wrap">
                      <div className="document-fields__sidebar">
                        <div className="document-fields__sidebar-fields" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </dialog>
    </div>,
    document.body
  )
}
