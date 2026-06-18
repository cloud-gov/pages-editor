'use client'

import React, { useMemo, useState } from 'react'
import type { BlocksFieldClientComponent, ClientBlock } from 'payload'
import {
  Button,
  FieldDescription,
  FieldError,
  FieldLabel,
  useConfig,
  useField,
  useForm,
  useTranslation,
} from '@payloadcms/ui'
import { getTranslation } from '@payloadcms/translations'

import { BlockPickerModal } from './components/BlockPickerModal'
import { BlockRow } from './components/BlockRow'
import { isBlockSupportedInMinimalEditor } from './blockModalUtils'
import {
  useSortableCollection
} from '@/hooks/useSortableCollection'

import { useExpandableCollection } from '@/hooks/useExpandableCollection'

import './index.scss'
import { resolveBlockSummary } from './utils/blockSummary'
import { getBlockValidationState } from './utils/blockValidation'

export type BlockRowState = {
  id: string
  blockType?: string
  isLoading?: boolean
  lastRenderedPath?: string
}

const baseClass = 'blocks-field'

export const CustomBlocksField: BlocksFieldClientComponent = (props) => {

  const {
    addFieldRow,
    removeFieldRow,
    getFields,
    replaceState,
    setModified,
    moveFieldRow,
  } = useForm()

  const formState = getFields()

  const { i18n, t } = useTranslation()

  const {
    field: {
      name,
      label,
      localized,
      blocks,
      admin: { className, description } = {},
      labels: labelsFromProps,
      maxRows,
      required,
    },
    path: pathFromProps,
    readOnly,
    schemaPath: schemaPathFromProps,
  } = props

  const path = pathFromProps ?? name
  const schemaPath = schemaPathFromProps ?? name

  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const { config } = useConfig()

  const fieldState = useField<number>({
    path,
    hasRows: true,
  })

  const {
    showError,
    valid,
    rows,
  } = fieldState as typeof fieldState & {
    rows?: BlockRowState[]
  }

  const labels = {
    plural: t('fields:blocks'),
    singular: t('fields:block'),
    ...labelsFromProps,
  }

  const clientBlocks = useMemo(() => {
    const resolved: ClientBlock[] = []

    for (const blockOrSlug of blocks) {
      const block =
        typeof blockOrSlug === 'string'
          ? config.blocksMap?.[blockOrSlug]
          : blockOrSlug

      if (block) {
        resolved.push(block)
      }
    }

    return resolved
  }, [blocks, config.blocksMap])

  const supportedBlocksForPicker = useMemo(
    () => clientBlocks.filter(isBlockSupportedInMinimalEditor),
    [clientBlocks],
  )

  const currentRows = Array.isArray(rows) ? rows : []

  const {
    isExpanded: isRowExpanded,
    toggleExpanded: toggleRowExpanded,
    expandAll: expandAllRows,
    collapseAll: collapseAllRows,
    removeExpandedId: removeExpandedRowId,
  } = useExpandableCollection({
    ids: currentRows.map((row) => row.id)
  })

  const hasMaxRows =
    typeof maxRows === 'number' && currentRows.length >= maxRows

  const getBlockConfig = (blockType: string) =>
    clientBlocks.find((block) => block.slug === blockType) ?? null

  const getRowPath = (row: BlockRowState, index: number) =>
    row.lastRenderedPath ?? `${path}.${index}`

  const getFieldValueAtPath = (fieldPath: string) =>
    formState?.[fieldPath]?.value

  const addBlock = (blockSlug: string) => {
    addFieldRow({
      blockType: blockSlug,
      path,
      rowIndex: currentRows.length,
      schemaPath,
    })

    setIsPickerOpen(false)
  }

  const removeBlock = (index: number) => {
    const rowId = currentRows[index]?.id

    removeFieldRow({
      path,
      rowIndex: index
    })

    if (rowId) {
      removeExpandedRowId(rowId)
    }
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || toIndex < 0) return
    if (fromIndex >= currentRows.length || toIndex >= currentRows.length) return

    moveFieldRow({
      path,
      moveFromIndex: fromIndex,
      moveToIndex: toIndex,
    })

    setModified(true)
  }

  const writeValueToFormState = ({
    formState,
    path,
    value,
  }: {
    formState: Record<string, any>
    path: string
    value: any
  }) => {
    // Arrays
    if (Array.isArray(value)) {
      formState[path] = {
        ...(formState[path] ?? {}),
        value: value.length,
      }

      value.forEach((item, index) => {
        writeValueToFormState({
          formState,
          path: `${path}.${index}`,
          value: item,
        })
      })

      return
    }

    // Lexical Form State
    const isLexicalEditorState = (value: unknown): boolean => {
      return (
        typeof value === 'object' &&
        value !== null &&
        'root' in (value as Record<string, unknown>)
      )
    }

    if (isLexicalEditorState(value)) {
      formState[path] = {
        ...(formState[path] ?? {}),
        value,
      }

      return
    }

    // Objects
    if (
      value &&
      typeof value === 'object' &&
      !(value instanceof Date)
    ) {
      Object.entries(value).forEach(([key, childValue]) => {
        writeValueToFormState({
          formState,
          path: `${path}.${key}`,
          value: childValue,
        })
      })

      return
    }

    // Scalars
    formState[path] = {
      ...(formState[path] ?? {}),
      value,
    }
  }
  const saveInlineBlockValues = ({
    rowPath,
    values,
  }: {
    rowPath: string
    values: Record<string, any>
  }) => {
    const formState = { ...getFields() }

    Object.entries(values).forEach(([fieldPath, fieldValue]) => {
      const fullPath = `${rowPath}.${fieldPath}`

      writeValueToFormState({
        formState,
        path: fullPath,
        value: fieldValue,
      })
    })

    Object.entries(values).forEach(([fieldPath, fieldValue]) => {
      writeValueToFormState({
        formState,
        path: `${rowPath}.${fieldPath}`,
        value: fieldValue,
      })
    })

    Object.keys(values).forEach((fieldPath) => {
      const fullPath = `${rowPath}.${fieldPath}`
    })

    replaceState(formState)

    setModified(true)
  }

  const {
    draggingId,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useSortableCollection({
    ids: currentRows.map((row) => row.id),
    onMove: moveBlock,
  })

  return (
    <div
      className={[
        'field-type',
        baseClass,
        'custom-blocks-field',
        className,
        showError || valid === false
          ? `${baseClass}--has-error`
          : `${baseClass}--has-no-error`,
      ]
        .filter(Boolean)
        .join(' ')}
      id={`field-${path.replace(/\./g, '__')}`}
    >
      <header className="custom-blocks-field__header blocks-field__header">
        <div className="custom-blocks-field__header-wrap blocks-field__header-wrap">
          <div className="custom-blocks-field__heading blocks-field__heading-with-error">
            <h3 className="custom-blocks-field__title">
              <FieldLabel
                as="span"
                label={label}
                localized={localized}
                path={path}
                required={required}
              />
            </h3>
          </div>
          <div className="custom-blocks-field__header-actions blocks-field__header-actions">
            <ul className="blocks-field__header-actions">
              <li>
                <button
                  type="button"
                  className="custom-blocks-field__header-action blocks-field__header-action"
                  disabled={currentRows.length === 0}
                  onClick={collapseAllRows}
                >
                  Collapse All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="custom-blocks-field__header-action blocks-field__header-action"
                  disabled={currentRows.length === 0}
                  onClick={expandAllRows}
                >
                  Show All
                </button>
              </li>
            </ul>
          </div>
        </div>

        {description ? (
          <FieldDescription description={description} path={path} />
        ) : null}
      </header>

      {showError ? <FieldError path={path} showError={showError} /> : null}

      <div className="custom-blocks-field__body">
        {currentRows.length === 0 ? (
          <div className="custom-blocks-field__empty">No blocks added yet.</div>
        ) : (
          <div className="custom-blocks-field__list blocks-field__rows">
            {currentRows.map((row, index) => {
              if (!row.blockType) {
                return null
              }
              const blockConfig = getBlockConfig(row.blockType || '')
              const rowPath = getRowPath(row, index)

              const summaryText = resolveBlockSummary({
                rowPath,
                row,
                getFieldValue: (p) => formState?.[p]?.value,
              })

              const validation = getBlockValidationState({
                blockConfig,
                rowPath,
                getFieldValue: getFieldValueAtPath,
              })

              return (
                <BlockRow
                  key={row.id}
                  row={row}
                  index={index}
                  rowPath={rowPath}
                  path={path}
                  blockConfig={blockConfig}
                  summaryText={summaryText}
                  validation={validation}
                  readOnly={readOnly}
                  rowCount={currentRows.length}
                  i18n={i18n}
                  draggingId={draggingId}
                  dragOverId={dragOverId}
                  isExpanded={isRowExpanded(row.id)}
                  getFields={getFields}
                  onToggle={() => toggleRowExpanded(row.id)}
                  onRemove={() => removeBlock(index)}
                  onSave={(values) =>
                  {
                    saveInlineBlockValues({
                      rowPath,
                      values,
                    })
                  }
                  }
                  onDragStart={(event) => handleDragStart(event, row.id)}
                  onDragOver={(event) => handleDragOver(event, row.id)}
                  onDrop={(event) => handleDrop(event, row.id)}
                  onDragEnd={handleDragEnd}
                />
              )
            })}
          </div>
        )}

        {!hasMaxRows ? (
          <Button
            buttonStyle="transparent"
            className="custom-blocks-field__add-button"
            disabled={readOnly}
            onClick={() => setIsPickerOpen(true)}
            type="button"
          >
            {t('fields:addLabel', {
              label: getTranslation(labels.singular, i18n),
            })}
          </Button>
        ) : null}
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details className="custom-blocks-field__debug">
          <summary>Debug: Block Support</summary>
          <pre>
            {JSON.stringify(
              {
                allBlocks: clientBlocks.map((block) => ({
                  slug: block.slug,
                  fields: block.fields?.map((field: any) => ({
                    name: field.name,
                    type: field.type,
                    required: field.required,
                    minRows: field.minRows,
                  })),
                })),
                supportedBlocks: supportedBlocksForPicker.map((block) => block.slug),
              },
              null,
              2,
            )}
          </pre>
        </details>
      )}

      <BlockPickerModal
        blocks={supportedBlocksForPicker}
        isOpen={isPickerOpen}
        path={`${path}-block-picker`}
        onClose={() => setIsPickerOpen(false)}
        onSelectBlock={addBlock}
        title={t('fields:addLabel', {
          label: getTranslation(labels.singular, i18n),
        })}
      />
    </div>
  )
}
