'use client'

import type { ClientBlock } from 'payload'
import { getTranslation } from '@payloadcms/translations'

import { InlineBlockEditor } from './InlineBlockEditor'
import { BlockActions } from './BlockActions'
import { SortableRow } from './SortableRow'
import { BlockRowState } from '..'

type BlockValidationState = {
  hasError: boolean
  errorCount: number
}

type BlockRowProps = {
  row: BlockRowState
  index: number
  rowPath: string
  path: string

  blockConfig: ClientBlock | null
  summaryText: string
  validation: BlockValidationState

  readOnly?: boolean
  rowCount: number

  i18n: any

  draggingId: string | null
  dragOverId: string | null
  isExpanded: boolean

  getFields: () => any

  onToggle: () => void
  onRemove: () => void
  onSave: (values: Record<string, any>) => void

  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  onDragEnd: () => void
}

const getSafePathId = (path: string) => path.replace(/\./g, '__')

export const BlockRow = ({
  row,
  index,
  rowPath,
  path,
  blockConfig,
  summaryText,
  validation,
  readOnly,
  rowCount,
  i18n,
  draggingId,
  dragOverId,
  isExpanded,
  getFields,
  onToggle,
  onRemove,
  onSave,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: BlockRowProps) => {
  const editorId = `${getSafePathId(path)}-${row.id}-inline-editor`

  const canDrag =
    !readOnly && rowCount > 1

  const blockLabel = blockConfig
    ? getTranslation(
        blockConfig.labels?.singular ??
          blockConfig.slug,
        i18n,
      )
    : row.blockType

  return (
    <SortableRow
      id={row.id}
      index={index}
      label={blockLabel || ''}
      subtitle={summaryText}
      canDrag={canDrag}
      isExpanded={isExpanded}
      hasError={validation.hasError}
      draggingId={draggingId}
      dragOverId={dragOverId}
      onToggle={onToggle}
      onRemove={onRemove}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      removeControl={
        <BlockActions
          blockLabel={blockLabel}
          index={index}
          readOnly={readOnly}
          validation={validation}
          onRemove={onRemove}
        />
      }
      meta={
        blockConfig?.admin?.group ? (
          <div className="custom-blocks-field__card-meta">
            <span className="custom-blocks-field__card-group">
              {typeof blockConfig.admin.group === 'string'
                ? blockConfig.admin.group
                : getTranslation(
                    blockConfig.admin.group,
                    i18n,
                  )}
            </span>
          </div>
        ) : null
      }
    >
      {blockConfig ? (
        <div
          id={editorId}
          className="custom-blocks-field__inline-editor-wrap"
        >
          <InlineBlockEditor
            blockConfig={blockConfig}
            getFields={getFields}
            readOnly={readOnly}
            rowPath={rowPath}
            onSave={onSave}
          />
        </div>
      ) : null}
    </SortableRow>
  )
}
