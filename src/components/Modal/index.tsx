'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'
import { FieldWrapper } from '../fields/FieldWrapper'

export type ModalFieldOption = {
  label: string
  value: string
}

export type ModalFieldType =
  | 'text'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'upload'
  | 'relationship'

export type ModalFieldConfig = {
  name: string
  label: string
  type: ModalFieldType
  required?: boolean
  description?: string
  placeholder?: string
  options?: ModalFieldOption[]
  disabled?: boolean
}

type Props = {
  isOpen: boolean
  path: string
  mode: 'create' | 'edit'
  title?: string
  description?: string
  metaText?: string
  fields: ModalFieldConfig[]
  values: Record<string, any>
  error?: string | null
  saving?: boolean
  onChange: (name: string, value: any) => void
  onSubmit: () => void
  onClose: () => void
  children?: React.ReactNode
}

export function Modal({
  isOpen,
  path,
  mode,
  title,
  description,
  metaText,
  fields,
  values,
  error,
  saving,
  onChange,
  onSubmit,
  onClose,
  children,
}: Props) {
  const headingId = useMemo(() => `doc-drawer_${path}__heading`, [path])
  const dialogId = useMemo(() => `doc-drawer_${path}`, [path])

  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const initialFocusRef = useRef<HTMLElement | null>(null)

  const headingText =
    title ?? (mode === 'edit' ? 'Edit item' : 'Create new item')

  const primaryButtonText =
    saving
      ? mode === 'edit'
        ? 'Saving…'
        : 'Creating…'
      : mode === 'edit'
        ? 'Save'
        : 'Create'

  useEffect(() => {
    if (!isOpen) return

    requestAnimationFrame(() => {
      initialFocusRef.current?.focus()
    })
  }, [isOpen])

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

  const renderField = (field: ModalFieldConfig, index: number) => {
    const fieldId = `modal-${path}-${field.name}`
    const value = values[field.name]

    const focusRef =
      index === 0
        ? (node: HTMLElement | null) => {
            initialFocusRef.current = node
          }
        : undefined

    // Checkbox already renders its own label element internally,
    // so skip FieldWrapper's outer label for that one.
    if (field.type === 'checkbox') {
      return (
        <FieldWrapper
          key={field.name}
          id={fieldId}
          description={field.description}
          variant="default"
          type={field.type}
        >
          <div className="usa-checkbox">
            <input
              ref={focusRef as React.Ref<HTMLInputElement>}
              id={fieldId}
              className="usa-checkbox__input"
              type="checkbox"
              checked={Boolean(value)}
              disabled={field.disabled || Boolean(saving)}
              onChange={(e) => onChange(field.name, e.target.checked)}
            />
            <label className="usa-checkbox__label" htmlFor={fieldId}>
              {field.label}
            </label>
          </div>
        </FieldWrapper>
      )
    }

    return (
      <FieldWrapper
        key={field.name}
        id={fieldId}
        label={field.label}
        required={field.required}
        description={field.description}
        variant="default"
        type={field.type}
      >
        {field.type === 'text' && (
          <input
            ref={focusRef as React.Ref<HTMLInputElement>}
            id={fieldId}
            className="usa-input"
            type="text"
            value={value ?? ''}
            placeholder={field.placeholder}
            disabled={field.disabled || Boolean(saving)}
            autoComplete="off"
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            ref={focusRef as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            className="usa-textarea"
            value={value ?? ''}
            placeholder={field.placeholder}
            disabled={field.disabled || Boolean(saving)}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        )}

        {field.type === 'select' && (
          <select
            ref={focusRef as React.Ref<HTMLSelectElement>}
            id={fieldId}
            className="usa-select"
            value={value ?? ''}
            disabled={field.disabled || Boolean(saving)}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="">
              {field.placeholder ?? 'Select a value'}
            </option>

            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {field.type === 'radio' && (
          <fieldset className="usa-fieldset">
            <legend className="usa-sr-only">{field.label}</legend>

            {(field.options ?? []).map((opt, optIndex) => {
              const radioId = `${fieldId}-${opt.value}`
              return (
                <div key={opt.value} className="usa-radio">
                  <input
                    ref={
                      index === 0 && optIndex === 0
                        ? (focusRef as React.Ref<HTMLInputElement>)
                        : undefined
                    }
                    id={radioId}
                    className="usa-radio__input"
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    disabled={field.disabled || Boolean(saving)}
                    onChange={(e) => onChange(field.name, e.target.value)}
                  />
                  <label className="usa-radio__label" htmlFor={radioId}>
                    {opt.label}
                  </label>
                </div>
              )
            })}
          </fieldset>
        )}
      </FieldWrapper>
    )
  }

  return createPortal(
    <div className={styles.modalContainer}>
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
          'payload-rel-drawer',
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

        <div className="drawer__content payload-rel-drawer__content">
          <div className="drawer__blur-bg-content" />

          <div className="gutter drawer__content-children">
            <main className="collection-edit">
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
                  </button>
                </div>

                {description ? (
                  <div className="doc-drawer__after-header">
                    <div className="custom-view-description">{description}</div>
                  </div>
                ) : null}
              </div>

              {/* Controls row */}
              <div className="gutter gutter--left gutter--right doc-controls">
                <div className="doc-controls__wrapper">
                  <div className="doc-controls__content">
                    <ul className="doc-controls__meta">
                      <li className="doc-controls__list-item">
                        <p className="doc-controls__value">
                          {metaText ??
                            (mode === 'edit'
                              ? `Editing ${headingText}`
                              : `Creating ${headingText}`)}
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

              {/* Main body */}
              <div className="collection-edit__main-wrapper">
                <div className="collection-edit__main">
                  <div className="document-fields document-fields--has-sidebar">
                    <div className="document-fields__main">
                      <div className="gutter gutter--left gutter--right document-fields__edit">
                        <div className="render-fields document-fields__fields">
                          {error ? (
                            <div className="usa-alert usa-alert--error" role="alert">
                              <div className="usa-alert__body">
                                <p className="usa-alert__text">{error}</p>
                              </div>
                            </div>
                          ) : null}

                          {children ?? fields.map(renderField)}
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
    document.body,
  )
}
