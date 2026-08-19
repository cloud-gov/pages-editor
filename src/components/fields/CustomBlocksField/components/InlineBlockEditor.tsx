'use client'

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ClientBlock } from 'payload'

import { FieldWrapper } from '@/components/fields/FieldWrapper'
import { InlineRichTextField } from '../../InlineRichTextField'

import {
  blockToInlineFields,
  type InlineBlockFieldConfig,
} from '../blockModalUtils'
import { UploadField } from './UploadField'
import { FormRelationshipField } from './FormRelationshipField'
import { CardGridField } from './CardGridField'

type Props = {
  blockConfig: ClientBlock
  debounceMs?: number
  getFields: () => Record<string, any>
  onSave: (values: Record<string, any>) => void
  readOnly?: boolean
  rowPath: string
}

type AutoSaveStatus = 'idle' | 'dirty' | 'saved'

const getDefaultInlineValue = (field: InlineBlockFieldConfig) => {
  if (field.type === 'checkbox') return false
  return ''
}

const stableStringify = (value: unknown): string => {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

const areValueMapsEqual = (
  left: Record<string, any>,
  right: Record<string, any>,
) => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)

  if (leftKeys.length !== rightKeys.length) return false

  return leftKeys.every((key) => {
    return stableStringify(left[key]) === stableStringify(right[key])
  })
}

const isLocallyManagedInlineField = (
  field: InlineBlockFieldConfig,
) => {
  return (
    field.type !== 'richText' &&
    field.type !== 'array'
  )
}

const readValuesFromFormState = ({
  fields,
  formState,
  rowPath,
}: {
  fields: InlineBlockFieldConfig[]
  formState: Record<string, any>
  rowPath: string
}) => {
  return fields.reduce<Record<string, any>>(
    (acc, field) => {
      if (!isLocallyManagedInlineField(field)) {
        return acc
      }

      const absolutePath =
        `${rowPath}.${field.name}`

      acc[field.name] =
        formState?.[absolutePath]?.value ??
        getDefaultInlineValue(field)

      return acc
    },
    {},
  )
}

export function InlineBlockEditor({
  blockConfig,
  debounceMs = 500,
  getFields,
  onSave,
  readOnly,
  rowPath,
}: Props) {
  
  const fields = useMemo(() => blockToInlineFields(blockConfig), [blockConfig])

  const locallyManagedFields = useMemo(
  () =>
    fields.filter(
      isLocallyManagedInlineField,
    ),
  [fields],
)

const arrayFields = useMemo(
  () =>
    fields.filter(
      (field) => field.type === 'array',
    ),
  [fields],
)

const richTextFields = useMemo(
  () =>
    fields.filter(
      (field) => field.type === 'richText',
    ),
  [fields],
)

  const getFieldsRef = useRef(getFields)
  const onSaveRef = useRef(onSave)
  const readOnlyRef = useRef(readOnly)

  useEffect(() => {
    getFieldsRef.current = getFields
  }, [getFields])

  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    readOnlyRef.current = readOnly
  }, [readOnly])

  const readCurrentFormValues = () =>
    readValuesFromFormState({
      fields,
      formState: getFieldsRef.current(),
      rowPath,
    })

  const [values, setValues] = useState<Record<string, any>>(() =>
    readCurrentFormValues(),
  )

  const [baselineValues, setBaselineValues] = useState<Record<string, any>>(
    () => readCurrentFormValues(),
  )

  const [autoSaveStatus, setAutoSaveStatus] =
    useState<AutoSaveStatus>('idle')

  const valuesRef = useRef(values)
  const baselineValuesRef = useRef(baselineValues)
  const debounceTimerRef = useRef<ReturnType<typeof window.setTimeout> | number | null>(
    null,
  )

  useEffect(() => {
    valuesRef.current = values
  }, [values])

  useEffect(() => {
    baselineValuesRef.current = baselineValues
  }, [baselineValues])

  useEffect(() => {
    const nextValues = readCurrentFormValues()

    setValues(nextValues)
    setBaselineValues(nextValues)
    setAutoSaveStatus('idle')

    valuesRef.current = nextValues
    baselineValuesRef.current = nextValues

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    // Intentionally reset only when switching row/config.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowPath, blockConfig.slug])

  const isDirty = useMemo(() => {
    return !areValueMapsEqual(values, baselineValues)
  }, [values, baselineValues])

  const valuesSignature = useMemo(() => stableStringify(values), [values])

  useEffect(() => {
    if (readOnly) return

    if (!isDirty) return

    setAutoSaveStatus('dirty')

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    debounceTimerRef.current = window.setTimeout(() => {
      const nextValues = valuesRef.current

      onSaveRef.current(nextValues)

      setBaselineValues(nextValues)
      baselineValuesRef.current = nextValues

      setAutoSaveStatus('saved')
      debounceTimerRef.current = null
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [debounceMs, isDirty, readOnly, valuesSignature])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      if (readOnlyRef.current) return

      const latestValues = valuesRef.current
      const latestBaselineValues = baselineValuesRef.current

      if (!areValueMapsEqual(latestValues, latestBaselineValues)) {
        onSaveRef.current(latestValues)
      }
    }
  }, [])

  const handleChange = (name: string, value: any) => {
    setValues((prev) => {
      const next = {
        ...prev,
        [name]: value
      }
      
      return next
    })
  }

  const renderSimpleField = (field: InlineBlockFieldConfig) => {
  
    if (field.type === 'richText' || field.type === 'array') return null

    const fieldId = `inline-block-${rowPath.replace(/\./g, '__')}-${field.name.replace(/\./g, '__')}`
    const value = values[field.name]
    const disabled = Boolean(readOnly || field.disabled)

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
              id={fieldId}
              className="usa-checkbox__input"
              type="checkbox"
              checked={Boolean(value)}
              disabled={disabled}
              onChange={(event) =>
                handleChange(field.name, event.target.checked)
              }
            />
            <label className="usa-checkbox__label" htmlFor={fieldId}>
              {field.label}
            </label>
          </div>
        </FieldWrapper>
      )
    }

    if (field.type === 'upload') {
      const uploadPath = `${rowPath}.${field.name}`
      const value = getFields()?.[uploadPath]?.value ?? null

      return (
        <FieldWrapper
          key={field.name}
          id={fieldId}
          description={field.description}
          variant="default"
          type={field.type}
        >
          <UploadField
            label={field.label ?? field.name}
            value={value}
            relationTo={field.sourceField?.relationTo}
            required={field.required}
            disabled={readOnly || field.disabled}
            onChange={(mediaId) => { // possible TODO: cleanup state-ownership
              onSave({
                [field.name]: mediaId,
              })
            }}
          />
        </FieldWrapper>
      )
    }

    if (field.type === 'relationship') {
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
          <FormRelationshipField
            relationTo={field.sourceField?.relationTo}
            value={value}
            disabled={disabled}
            onChange={(formId) => 
              handleChange(field.name, formId)
            }
          />
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
            id={fieldId}
            className="usa-input"
            type="text"
            value={value ?? ''}
            placeholder={field.placeholder}
            disabled={disabled}
            autoComplete="off"
            onChange={(event) =>
              handleChange(field.name, event.target.value)
            }
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            id={fieldId}
            className="usa-textarea"
            value={value ?? ''}
            placeholder={field.placeholder}
            disabled={disabled}
            onChange={(event) =>
              handleChange(field.name, event.target.value)
            }
          />
        )}

        {field.type === 'select' && (
          <div className="react-select">
            <select
            id={fieldId}
            className="usa-select rs__control"
            value={value ?? ''}
            disabled={disabled}
            onChange={(event) =>
              handleChange(field.name, event.target.value)
            }
          >
            <option value="">
              {field.placeholder ?? 'Select a value'}
            </option>

            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          </div>
        )}

        {field.type === 'radio' && (
          <fieldset className="usa-fieldset">
            <legend className="usa-sr-only">{field.label}</legend>

            {(field.options ?? []).map((option) => {
              const radioId = `${fieldId}-${option.value}`

              return (
                <div key={option.value} className="usa-radio">
                  <input
                    id={radioId}
                    className="usa-radio__input"
                    type="radio"
                    name={fieldId}
                    value={option.value}
                    checked={value === option.value}
                    disabled={disabled}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                  />
                  <label className="usa-radio__label" htmlFor={radioId}>
                    {option.label}
                  </label>
                </div>
              )
            })}
          </fieldset>
        )}
      </FieldWrapper>
    )
  }

  const renderArrayField = (
  field: InlineBlockFieldConfig,
) => {
  if (field.type !== 'array') {
    return null
  }

  const fieldId =
    `inline-block-${rowPath.replace(/\./g, '__')}` +
    `-${field.name.replace(/\./g, '__')}`

  const arrayPath =
    `${rowPath}.${field.name}`

  const disabled = Boolean(
    readOnly || field.disabled,
  )

  return (
    <FieldWrapper
      key={field.name}
      id={fieldId}
      required={field.required}
      description={field.description}
      variant="default"
      type={field.type}
    >
      <CardGridField
        field={field}
        fieldId={fieldId}
        path={arrayPath}
        disabled={disabled}
      />
    </FieldWrapper>
  )
}

  const renderRichTextField = (field: InlineBlockFieldConfig) => {
    if (field.type !== 'richText') return null

    const richTextPath = `${rowPath}.${field.name}`

    const value = getFields()?.[richTextPath]?.value

    return (
      <div
        key={field.name}
        className="custom-blocks-field__inline-rich-text"
      >
        <InlineRichTextField
          path={richTextPath}
          label={field.label}
          description={field.description}
          required={field.required}
          disabled={readOnly || field.disabled}
          value={value}
          onChange={(nextValue) => {
            onSave({
              [field.name]: nextValue,
            })
          }}
        />
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="custom-blocks-field__inline-editor">
        <p className="custom-blocks-field__inline-editor-empty">
          This block does not have fields supported by the inline editor yet.
        </p>
      </div>
    )
  }

  return (
    <div className="custom-blocks-field__inline-editor">
      {locallyManagedFields.length > 0 ? (
        <div className="custom-blocks-field__inline-fields">
          {locallyManagedFields.map(
            renderSimpleField,
          )}
        </div>
      ) : null}

      {arrayFields.length > 0 ? (
        <div className="custom-blocks-field__inline-array-fields">
          {arrayFields.map(renderArrayField)}
        </div>
      ) : null}

      {richTextFields.length > 0 ? (
        <div className="custom-blocks-field__inline-rich-text-fields">
          {richTextFields.map(renderRichTextField)}
        </div>
      ) : null}

      <div className="custom-blocks-field__inline-status" aria-live="polite">
        {autoSaveStatus === 'dirty' ? (
          <span className="custom-blocks-field__dirty-indicator">
            Unsaved changes
          </span>
        ) : null}

        {autoSaveStatus === 'saved' ? (
          <span className="custom-blocks-field__saved-indicator">
            Changes saved to form
          </span>
        ) : null}
      </div>
    </div>
  )
}
