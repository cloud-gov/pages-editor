'use client'
import React from 'react'
import type { ClientField } from 'payload'
import {
  Collapsible,
  ErrorPill,
  RenderFields,
  useFormSubmitted,
  useTranslation,
} from '@payloadcms/ui'
import { useThrottledValue } from '@payloadcms/ui/hooks/useThrottledValue'
import { ArrayAction } from '@payloadcms/ui/elements/ArrayAction'
import { getTranslation } from '@payloadcms/translations'
import type { HTMLAttributes } from 'react'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

const baseClass = 'files-field'

type FilesRowProps = {
  addRow: (rowIndex: number) => void
  attributes: HTMLAttributes<unknown>
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
  permissions: unknown
  readOnly?: boolean
  removeRow: (rowIndex: number) => void
  row: { collapsed?: boolean; id: string }
  rowCount: number
  rowIndex: number
  schemaPath?: string
  scrollIdPrefix: string
  setCollapse: (rowID: string, collapsed: boolean) => void
  setNodeRef?: (node: HTMLElement | null) => void
  transform?: string
  transition?: string
}

export const FilesRow: React.FC<FilesRowProps> = ({
  addRow,
  attributes,
  duplicateRow,
  errorCount,
  fields,
  forceRender = false,
  hasMaxRows = false,
  isDragging,
  isLoading: isLoadingFromProps,
  isSortable,
  labels,
  listeners,
  moveRow,
  parentPath,
  path,
  permissions,
  readOnly,
  removeRow,
  row,
  rowCount,
  rowIndex,
  schemaPath,
  scrollIdPrefix,
  setCollapse,
  setNodeRef,
  transform,
  transition,
}) => {
  const { i18n } = useTranslation()
  const hasSubmitted = useFormSubmitted()

  const isLoading = useThrottledValue(isLoadingFromProps, 500)

  const fallbackLabel = `${getTranslation(labels.singular as string, i18n)} ${String(
    rowIndex + 1,
  ).padStart(2, '0')}`

  const fieldHasErrors = (errorCount ?? 0) > 0 && hasSubmitted

  const classNames = [
    `${baseClass}__row`,
    fieldHasErrors ? `${baseClass}__row--has-errors` : `${baseClass}__row--no-errors`,
    isDragging ? `${baseClass}__row--is-dragging` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`${baseClass}__draggable-row`}
      id={`${parentPath.split('.').join('-')}-row-${rowIndex}`}
      ref={setNodeRef}
      style={{ transform, transition, zIndex: isDragging ? 1 : undefined }}
    >
      <Collapsible
        actions={
          !readOnly ? (
            <ArrayAction
              addRow={addRow}
              copyRow={() => {}}
              duplicateRow={duplicateRow}
              hasMaxRows={hasMaxRows}
              index={rowIndex}
              isSortable={isSortable}
              moveRow={moveRow}
              pasteRow={() => {}}
              removeRow={removeRow}
              rowCount={rowCount}
            />
          ) : undefined
        }
        className={classNames}
        collapsibleStyle={fieldHasErrors ? 'error' : 'default'}
        dragHandleProps={
          isSortable
            ? ({
                id: row.id,
                attributes,
                listeners,
              } as never)
            : undefined
        }
        header={
          <div className={`${baseClass}__row-header`} id={`${scrollIdPrefix}-row-${rowIndex}`}>
            {isLoading ? (
              <span className={`${baseClass}__row-shimmer`} />
            ) : (
              <span className={`${baseClass}__row-label`}>{fallbackLabel}</span>
            )}
            {fieldHasErrors && <ErrorPill count={errorCount ?? 0} i18n={i18n} withMessage />}
          </div>
        }
        isCollapsed={row.collapsed}
        onToggle={(collapsed) => setCollapse(row.id, collapsed)}
      >
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
      </Collapsible>
    </div>
  )
}
