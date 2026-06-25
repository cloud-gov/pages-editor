'use client'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import type { UploadFieldClientComponent } from 'payload'
import { useConfig, useField, UploadInput } from '@payloadcms/ui'

export const FileUploadField: UploadFieldClientComponent = (props) => {
  const {
    field,
    field: {
      admin: { allowCreate, className, description, isSortable } = {},
      hasMany,
      label,
      localized,
      maxRows,
      relationTo: relationToFromProps,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const { config } = useConfig()
  const displayPreview = (field as { displayPreview?: boolean }).displayPreview

  const memoizedValidate = useCallback(
    (value: unknown, options: Record<string, unknown>) => {
      if (typeof validate === 'function') {
        return validate(value as never, { ...options, required } as never)
      }
    },
    [validate, required],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    filterOptions,
    path,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate as never,
  })

  const isPolymorphic = Array.isArray(relationToFromProps)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = wrapperRef.current
    if (!root) {
      return
    }

    const sanitize = () => {
      const svgs = root.querySelectorAll<SVGElement>(
        '.thumbnail > svg[viewBox="0 0 150 150"][style]',
      )
      svgs.forEach((svg) => {
        svg.removeAttribute('style')
        svg.setAttribute('data-file-placeholder', 'true')
      })
    }

    sanitize()
    const observer = new MutationObserver(sanitize)
    observer.observe(root, { attributeFilter: ['style'], childList: true, subtree: true })
    return () => observer.disconnect()
  })

  const memoizedValue = useMemo(() => {
    if (hasMany === true) {
      return Array.isArray(value)
        ? value.map((val) =>
            isPolymorphic
              ? val
              : {
                  relationTo: Array.isArray(relationToFromProps)
                    ? relationToFromProps[0]
                    : relationToFromProps,
                  value: val,
                },
          )
        : value
    }
    return value
  }, [hasMany, value, isPolymorphic, relationToFromProps])

  return (
    <div ref={wrapperRef}>
      <UploadInput
        AfterInput={AfterInput}
        allowCreate={allowCreate !== false}
        api={config.routes.api}
        BeforeInput={BeforeInput}
        className={className}
        Description={Description}
        description={description}
        displayPreview={displayPreview}
        Error={Error}
        filterOptions={filterOptions}
        hasMany={hasMany}
        isSortable={isSortable}
        label={label}
        Label={Label}
        localized={localized}
        maxRows={maxRows}
        onChange={setValue}
        path={path}
        readOnly={readOnly || disabled}
        relationTo={relationToFromProps}
        required={required}
        serverURL={config.serverURL}
        showError={showError}
        value={memoizedValue as never}
      />
    </div>
  )
}
