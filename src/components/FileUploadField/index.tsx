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

  // add id to field label and aria- attributes
  
  useEffect(() => {
    const uploadFields = document.querySelectorAll<HTMLElement>(
      '.field-type.upload[id]',
    )

    uploadFields.forEach((uploadField) => {
      const uploadId = uploadField.id
      if (!uploadId) return

      const label = uploadField.querySelector<HTMLLabelElement>('.field-label')
      const dropzone = uploadField.querySelector<HTMLElement>(
        '.dropzone.dropzoneStyle--default',
      )

      if (!label || !dropzone) return

      const labelId = `${uploadId}-label`

      // Add ID to label
      label.id = labelId

      // Extract label text without HTML markup
      const labelText =
        label.childNodes[0]?.textContent?.trim() ??
        label.textContent?.trim() ??
        'File'

      // Associate dropzone with label
      dropzone.setAttribute('aria-labelledby', labelId)
      dropzone.setAttribute('aria-label', `${labelText} Upload`)
    })
  }, [])

  useEffect(() => {
    const applyDrawerFixes = () => {
      const drawerModal = document.querySelector(
        '.payload__modal-container'
      )

      if (!(drawerModal instanceof HTMLElement)) {
        return
      }

      const drawerDialog = document.querySelector(
        '.payload__modal-container dialog'
      )

      const emptyButton = document.querySelector(
        '.drawer__close'
      )

      const dragDesc = document.querySelector(
        '.drawer__content-children main.collection-edit ~ div'
      )

      const dropZone = document.querySelector(
        '.file-field__upload .dropzone'
      )
      
      drawerDialog?.setAttribute('aria-label', 'Upload file')
      emptyButton?.remove()
      dragDesc?.setAttribute('id', 'drag-description')
      dropZone?.setAttribute('aria-describedby', 'drag-description')
    }

    const observer = new MutationObserver(() => {
      applyDrawerFixes()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    applyDrawerFixes()

    return () => observer.disconnect()
  }, [])

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
    <div ref={wrapperRef} className="field-type upload">
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
