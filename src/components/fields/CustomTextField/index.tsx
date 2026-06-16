'use client'

import React from 'react'
import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'
import { FieldWrapper } from '../FieldWrapper'
import { resolveStaticText } from '@/components/utilities'

export const CustomTextField: TextFieldClientComponent = ({ field, path }) => {
  const {
    value,
    setValue,
    showError,
    errorMessage,
  } = useField<string>({ path })

  const id = `field-${path}`

  const label = resolveStaticText(field.label, field.name)
  const description = resolveStaticText(field.admin?.description)

  return (
    <FieldWrapper
      id={id}
      label={label}
      required={field.required}
      description={description}
      error={showError ? errorMessage : undefined}
      type="text"
    >
      <input
        id={id}
        className="usa-input"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        type="text"
      />
    </FieldWrapper>
  )
}
