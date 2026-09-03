'use client'
import React, { Fragment, useCallback, useId, useMemo } from 'react'
import type { ArrayFieldClientComponent } from 'payload'
import {
  Banner,
  Button,
  ErrorPill,
  FieldDescription,
  FieldError,
  FieldLabel,
  NullifyLocaleField,
  RenderCustomComponent,
  useConfig,
  useDocumentInfo,
  useField,
  useForm,
  useFormSubmitted,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { scrollToID } from '@payloadcms/ui/utilities/scrollToID'
import { getTranslation } from '@payloadcms/translations'
import { toast } from 'sonner'

import { DragDropCustomItem, DragDropCustomList } from '../DragDropCustom'
import { FilesFieldActions } from '../FilesFieldActions'
import { FilesRow } from '../FilesRow'
import {
  clipboardCopy,
  clipboardPaste,
  mergeFormStateFromClipboard,
  reduceFormStateByPath,
} from '../utilities/clipboard'
import './index.scss'

const baseClass = 'files-field'

type Row = { collapsed?: boolean; id: string }

const extractRowsAndCollapsedIDs = ({
  collapsed,
  rowID,
  rows,
}: {
  collapsed: boolean
  rowID: string
  rows: Row[]
}) =>
  rows.reduce<{ collapsedIDs: string[]; updatedRows: Row[] }>(
    (acc, row) => {
      const updatedRow = row.id === rowID ? { ...row, collapsed } : row
      if (updatedRow.collapsed) {
        acc.collapsedIDs.push(updatedRow.id)
      }
      acc.updatedRows.push(updatedRow)
      return acc
    },
    { collapsedIDs: [], updatedRows: [] },
  )

const toggleAllRows = ({ collapsed, rows }: { collapsed: boolean; rows: Row[] }) =>
  rows.reduce<{ collapsedIDs: string[]; updatedRows: Row[] }>(
    (acc, row) => {
      const updatedRow = { ...row, collapsed }
      if (collapsed) {
        acc.collapsedIDs.push(updatedRow.id)
      }
      acc.updatedRows.push(updatedRow)
      return acc
    },
    { collapsedIDs: [], updatedRows: [] },
  )

export const FilesField: ArrayFieldClientComponent = (props) => {
  const {
    field,
    field: {
      name,
      admin: { className, description, isSortable = true } = {},
      fields,
      label,
      localized,
      maxRows,
      minRows: minRowsProp,
      required,
    } = {},
    path: pathFromProps,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
    validate,
  } = props

  const schemaPath = schemaPathFromProps ?? name ?? ''
  const minRows = minRowsProp ?? (required ? 1 : 0)

  const { setDocFieldPreferences } = useDocumentInfo()
  const {
    addFieldRow,
    dispatchFields,
    getFields,
    moveFieldRow,
    removeFieldRow,
    replaceState,
    setModified,
  } = useForm()
  const submitted = useFormSubmitted()
  const { code: locale } = useLocale()
  const { i18n, t } = useTranslation()
  const {
    config: { localization },
  } = useConfig()

  const editingDefaultLocale = (() => {
    if (localization && localization.fallback) {
      const defaultLocale = localization.defaultLocale
      return locale === defaultLocale
    }
    return true
  })()

  const labels = useMemo(() => {
    if ('labels' in field && field.labels) {
      return {
        plural: field.labels?.plural,
        singular: field.labels?.singular,
      }
    }
    if ('label' in field && field.label) {
      return { plural: undefined, singular: field.label }
    }
    return { plural: t('general:rows'), singular: t('general:row') }
  }, [field, t])

  const memoizedValidate = useCallback(
    (value: unknown, options: Record<string, unknown>) => {
      if (!editingDefaultLocale && value === null) {
        return true
      }
      if (typeof validate === 'function') {
        return validate(value as never, { ...options, maxRows, minRows, required } as never)
      }
    },
    [maxRows, minRows, required, validate, editingDefaultLocale],
  ) as never

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    errorPaths = [],
    path,
    rows = [],
    showError,
    valid,
    value,
  } = useField<number>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const componentId = useId()
  const scrollIdPrefix = useMemo(() => `scroll-${componentId}`, [componentId])

  const addRow = useCallback(
    (rowIndex: number) => {
      void addFieldRow({ path, rowIndex, schemaPath })
      setTimeout(() => {
        const targetId = `${scrollIdPrefix}-row-${rowIndex}`
        
        const header = document.getElementById(targetId)
        
        if (header instanceof HTMLElement) {
          scrollToID(targetId)
          header.focus({ preventScroll: true })
        }
      }, 0)
      
    },
    [addFieldRow, path, schemaPath, scrollIdPrefix],
  )

  const duplicateRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })
      setModified(true)
      setTimeout(() => {
        scrollToID(`${scrollIdPrefix}-row-${rowIndex + 1}`)
      }, 0)
    },
    [dispatchFields, path, setModified, scrollIdPrefix],
  )

  const removeRow = useCallback(
    (rowIndex: number) => {
      removeFieldRow({ path, rowIndex })
    },
    [removeFieldRow, path],
  )

  const copyRow = useCallback(
    (rowIndex: number) => {
      const formState = { ...getFields() }
      const clipboardResult = clipboardCopy({
        type: 'array',
        fields: fields ?? [],
        getDataToCopy: () => reduceFormStateByPath({ formState, path, rowIndex }),
        path,
        rowIndex,
        t,
      })
      if (typeof clipboardResult === 'string') {
        toast.error(clipboardResult)
      } else {
        toast.success(t('general:copied'))
      }
    },
    [fields, getFields, path, t],
  )

  const pasteRow = useCallback(
    (rowIndex: number) => {
      const formState = { ...getFields() }
      const clipboardResult = clipboardPaste({
        onPaste: (dataFromClipboard) => {
          const newState = mergeFormStateFromClipboard({
            dataFromClipboard,
            formState,
            path,
            rowIndex,
          })
          replaceState(newState as never)
          setModified(true)
        },
        path,
        schemaFields: fields ?? [],
        t,
      })
      if (typeof clipboardResult === 'string') {
        toast.error(clipboardResult)
      }
    },
    [fields, getFields, path, replaceState, setModified, t],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      moveFieldRow({ moveFromIndex, moveToIndex, path })
    },
    [path, moveFieldRow],
  )

  const copyField = useCallback(() => {
    const formState = { ...getFields() }
    const clipboardResult = clipboardCopy({
      type: 'array',
      fields: fields ?? [],
      getDataToCopy: () => reduceFormStateByPath({ formState, path }),
      path,
      t,
    })
    if (typeof clipboardResult === 'string') {
      toast.error(clipboardResult)
    } else {
      toast.success(t('general:copied'))
    }
  }, [fields, getFields, path, t])

  const pasteField = useCallback(() => {
    const formState = { ...getFields() }
    const clipboardResult = clipboardPaste({
      onPaste: (dataFromClipboard) => {
        const newState = mergeFormStateFromClipboard({
          dataFromClipboard,
          formState,
          path,
        })
        replaceState(newState as never)
        setModified(true)
      },
      path,
      schemaFields: fields ?? [],
      t,
    })
    if (typeof clipboardResult === 'string') {
      toast.error(clipboardResult)
    }
  }, [fields, getFields, path, replaceState, setModified, t])

  const setCollapse = useCallback(
    (rowID: string, collapsed: boolean) => {
      const { collapsedIDs, updatedRows } = extractRowsAndCollapsedIDs({
        collapsed,
        rowID,
        rows,
      })
      dispatchFields({
        type: 'SET_ROW_COLLAPSED',
        path,
        updatedRows,
      })
      setDocFieldPreferences(path, { collapsed: collapsedIDs })
    },
    [dispatchFields, path, rows, setDocFieldPreferences],
  )

  const hasMaxRows = Boolean(maxRows && rows.length >= maxRows)
  const toggleCollapseAll = useCallback(
    (collapsed: boolean) => {
      const { collapsedIDs, updatedRows } = toggleAllRows({ collapsed, rows })
      dispatchFields({
        type: 'SET_ALL_ROWS_COLLAPSED',
        path,
        updatedRows,
      })
      setDocFieldPreferences(path, { collapsed: collapsedIDs })
    },
    [dispatchFields, path, rows, setDocFieldPreferences],
  )
  const fieldErrorCount = errorPaths.length
  const fieldHasErrors = submitted && errorPaths.length > 0
  const showRequired = (readOnly || disabled) && rows.length === 0
  const showMinRows = (rows.length && rows.length < minRows) || (required && rows.length === 0)

  return (
    <div
      className={[
        'field-type',
        baseClass,
        className,
        fieldHasErrors ? `${baseClass}--has-error` : `${baseClass}--has-no-error`,
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
    >
      {showError && (
        <RenderCustomComponent
          CustomComponent={Error}
          Fallback={<FieldError path={path} showError={showError} />}
        />
      )}
      <header className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-wrap`}>
          <div className={`${baseClass}__header-content`}>
            <h3 className={`${baseClass}__title`}>
              <RenderCustomComponent
                CustomComponent={Label}
                Fallback={
                  <FieldLabel
                    as="span"
                    label={label}
                    localized={localized}
                    path={path}
                    required={required}
                  />
                }
              />
            </h3>
            {fieldHasErrors && fieldErrorCount > 0 && (
              <ErrorPill count={fieldErrorCount} i18n={i18n} withMessage />
            )}
          </div>
          {rows?.length > 0 && (
            <ul className={`${baseClass}__header-actions`}>
              <li>
                <button
                  className={`${baseClass}__header-action`}
                  onClick={() => toggleCollapseAll(true)}
                  type="button"
                >
                  {t('fields:collapseAll')}
                </button>
              </li>
              <li>
                <button
                  className={`${baseClass}__header-action`}
                  onClick={() => toggleCollapseAll(false)}
                  type="button"
                >
                  {t('fields:showAll')}
                </button>
              </li>
              <li>
                <FilesFieldActions
                  allowCopy={rows?.length > 0}
                  allowPaste={!(readOnly || disabled)}
                  copyField={copyField}
                  disabled={disabled}
                  pasteField={pasteField}
                />
              </li>
            </ul>
          )}
        </div>
        <RenderCustomComponent
          CustomComponent={Description}
          Fallback={<FieldDescription description={description} path={path} />}
        />
      </header>

      <NullifyLocaleField
        fieldValue={value}
        localized={Boolean(localized)}
        path={path}
        readOnly={Boolean(readOnly)}
      />

      {BeforeInput}

      {(rows?.length > 0 || (!valid && (showRequired || showMinRows))) && (
        <DragDropCustomList
          className={`${baseClass}__rows`}
          ids={rows.map((row) => row.id)}
          onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        >
          {rows.map((rowData, i) => {
            const { id: rowID, isLoading } = rowData
            const rowPath = `${path}.${i}`
            const rowErrorCount = errorPaths?.filter((errorPath) =>
              errorPath.startsWith(rowPath + '.'),
            ).length

            return (
              <DragDropCustomItem
                disabled={readOnly || disabled || !isSortable}
                id={rowID}
                key={rowID}
              >
                {({ attributes, isDragging, listeners }) => (
                  <FilesRow
                    addRow={addRow}
                    attributes={attributes}
                    copyRow={copyRow}
                    duplicateRow={duplicateRow}
                    errorCount={rowErrorCount}
                    fields={fields}
                    hasMaxRows={hasMaxRows}
                    isDragging={isDragging}
                    isLoading={isLoading}
                    isSortable={Boolean(isSortable)}
                    labels={labels}
                    listeners={listeners}
                    moveRow={moveRow}
                    parentPath={path}
                    path={rowPath}
                    pasteRow={pasteRow}
                    permissions={permissions}
                    readOnly={readOnly || disabled}
                    removeRow={removeRow}
                    row={rowData}
                    rowCount={rows?.length}
                    rowIndex={i}
                    schemaPath={schemaPath}
                    scrollIdPrefix={scrollIdPrefix}
                    setCollapse={setCollapse}
                  />
                )}
              </DragDropCustomItem>
            )
          })}
          {!valid && (
            <Fragment>
              {showRequired && (
                <Banner>
                  {t('validation:fieldHasNo', {
                    label: getTranslation(labels.plural ?? '', i18n),
                  })}
                </Banner>
              )}
              {showMinRows && (
                <Banner type="error">
                  {t('validation:requiresAtLeast', {
                    count: minRows,
                    label:
                      getTranslation((minRows > 1 ? labels.plural : labels.singular) ?? '', i18n) ||
                      t(minRows > 1 ? 'general:rows' : 'general:row'),
                  })}
                </Banner>
              )}
            </Fragment>
          )}
        </DragDropCustomList>
      )}

      {!hasMaxRows && !readOnly && (
        <Button
          buttonStyle="icon-label"
          className={`${baseClass}__add-row`}
          disabled={disabled}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={() => {
            void addRow(value || 0)
          }}
        >
          {t('fields:addLabel', {
            label: getTranslation(labels.singular ?? '', i18n),
          })}
        </Button>
      )}

      {AfterInput}
    </div>
  )
}
