'use client'
import React from 'react'
import type { ClientField } from 'payload'
import { ErrorPill, RenderFields, useFormSubmitted, useTranslation } from '@payloadcms/ui'
import { useThrottledValue } from '@payloadcms/ui/hooks/useThrottledValue'
import { ChevronIcon } from '@payloadcms/ui/icons/Chevron'
import { DragHandleIcon } from '@payloadcms/ui/icons/DragHandle'
import { getTranslation } from '@payloadcms/translations'
import type { HTMLAttributes } from 'react'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

import { FilesRowActions } from '../FilesRowActions'
import './index.scss'

const baseClass = 'files-field'

type FilesRowProps = {
  addRow: (rowIndex: number) => void
  attributes: HTMLAttributes<unknown>
  copyRow: (rowIndex: number) => void
  duplicateRow: (rowIndex: number) => void
  errorCount?: number
  fields?: ClientField[]
  forceRender?: boolean
  hasMaxRows?: boolean
  isDragging?: boolean
  isLoading?: boolean
  isSortable?: boolean
  labels: { plural?: unknown; singular?: unknown }
  listeners?: SyntheticListenerMap
  moveRow: (from: number, to: number) => void
  parentPath: string
  path: string
  pasteRow: (rowIndex: number) => void
  permissions: unknown
  readOnly?: boolean
  removeRow: (rowIndex: number) => void
  row: { collapsed?: boolean; id: string }
  rowCount: number
  rowIndex: number
  schemaPath?: string
  scrollIdPrefix: string
  setCollapse: (rowID: string, collapsed: boolean) => void
}

export const FilesRow: React.FC<FilesRowProps> = ({
  addRow,
  attributes,
  copyRow,
  duplicateRow,
  errorCount,
  fields,
  forceRender = false,
  hasMaxRows = false,
  isLoading: isLoadingFromProps,
  isSortable,
  labels,
  listeners,
  moveRow,
  parentPath,
  path,
  pasteRow,
  permissions,
  readOnly,
  removeRow,
  row,
  rowCount,
  rowIndex,
  schemaPath,
  scrollIdPrefix,
  setCollapse,
}) => {
  const { i18n, t } = useTranslation()
  const hasSubmitted = useFormSubmitted()

  const isLoading = useThrottledValue(isLoadingFromProps, 500)

  const fallbackLabel = `${getTranslation(labels.singular as string, i18n)} ${String(
    rowIndex + 1,
  ).padStart(2, '0')}`

  const fieldHasErrors = (errorCount ?? 0) > 0 && hasSubmitted
  const isCollapsed = Boolean(row.collapsed)

  const classNames = [
    `${baseClass}__row`,
    fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
    isCollapsed ? `${baseClass}__row--collapsed` : `${baseClass}__row--open`,
    fieldHasErrors ? `${baseClass}__row--style-error` : `${baseClass}__row--style-default`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classNames}
      id={`${parentPath.split('.').join('-')}-row-${rowIndex}`}
    >
      <div className={`${baseClass}__row-toggle-wrap`}>
        <button
          aria-expanded={!isCollapsed}
          className={`${baseClass}__row-toggle`}
          onClick={() => setCollapse(row.id, !isCollapsed)}
          type="button"
        >
          <span>{t('fields:toggleBlock')}</span>
        </button>
        {isSortable && (
          <div
            className={`${baseClass}__row-drag`}
            {...attributes}
            {...listeners}
          >
            <DragHandleIcon />
          </div>
        )}
        <div className={`${baseClass}__row-header`} id={`${scrollIdPrefix}-row-${rowIndex}`}>
          {isLoading ? (
            <span className={`${baseClass}__row-shimmer`} />
          ) : (
            <span className={`${baseClass}__row-label`}>{fallbackLabel}</span>
          )}
          {fieldHasErrors && <ErrorPill count={errorCount ?? 0} i18n={i18n} withMessage />}
        </div>
        <div className={`${baseClass}__row-actions-wrap`}>
          {!readOnly && (
            <FilesRowActions
              addRow={addRow}
              copyRow={copyRow}
              duplicateRow={duplicateRow}
              hasMaxRows={hasMaxRows}
              index={rowIndex}
              isSortable={isSortable}
              moveRow={moveRow}
              pasteRow={pasteRow}
              removeRow={removeRow}
              rowCount={rowCount}
            />
          )}
          <button
            aria-expanded={!isCollapsed}
            aria-label={t('fields:toggleBlock')}
            className={`${baseClass}__row-indicator`}
            onClick={() => setCollapse(row.id, !isCollapsed)}
            type="button"
          >
            <ChevronIcon direction={isCollapsed ? undefined : 'up'} />
          </button>
        </div>
      </div>
      <div className={`${baseClass}__row-content-wrap`}>
        <div className={`${baseClass}__row-content`}>
          <div className={`${baseClass}__row-content-inner`}>
            {isLoading ? (
              <span className={`${baseClass}__fields-shimmer`} />
            ) : (
              <RenderFields
                className={`${baseClass}__fields`}
                fields={fields ?? []}
                forceRender={forceRender}
                margins="small"
                parentIndexPath=""
                parentPath={path}
                parentSchemaPath={schemaPath ?? ''}
                permissions={permissions === true ? permissions : (permissions as any)?.fields}
                readOnly={readOnly}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
