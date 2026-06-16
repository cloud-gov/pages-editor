
'use client'

import React from 'react'

type FieldWrapperProps = {
  id: string
  label?: string
  required?: boolean
  description?: string
  error?: string
  children: React.ReactNode
  variant?: 'default' | 'sidebar' | 'compact'
  type?: string
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  id,
  label,
  required,
  description,
  error,
  children,
  type,
  variant = 'default',
}) => {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const describedBy = [
    description ? hintId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={[
        'usa-form-group',
        'payload-field',
        'field-type',
        type,
        variant === 'sidebar' && 'payload-field--sidebar',
        variant === 'compact' && 'payload-field--compact',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="usa-label--required required" aria-hidden="true"> *</span>}
        </label>
      )}

      {error && (
        <span className="usa-error-message" id={errorId} role="alert">
          {error}
        </span>
      )}

      <div aria-describedby={describedBy} className="field-type__wrap">
        {children}
      </div>

      {description && (
        <div className="field-description" id={hintId}>
          {description}
        </div>
      )}
    </div>
  )
}
