'use client'

import {
  useEffect,
  useMemo,
  useRef,
} from 'react'

import {
  useField,
  useForm,
} from '@payloadcms/ui'

import { useExpandableCollection } from '@/hooks/useExpandableCollection'

import type { InlineBlockFieldConfig } from '@/components/fields/CustomBlocksField/blockModalUtils'

import { SortableRow } from '../SortableRow'
import { useSortableCollection } from '@/hooks/useSortableCollection'

import { CardGridRowFields } from './CardGridRow'

type CardGridFieldProps = {
  field: InlineBlockFieldConfig
  fieldId: string
  path: string
  disabled?: boolean
  schemaPath?: any
}

export function CardGridField({
  field,
  fieldId,
  path,
  disabled,
}: CardGridFieldProps) {
  const {
    addFieldRow,
    moveFieldRow,
    removeFieldRow,
    setModified,
  } = useForm()

  const arrayFieldState = useField<number>({
    path,
    hasRows: true,
  })

  const currentRows = Array.isArray(arrayFieldState.rows)
    ? arrayFieldState.rows
    : []

  const minimumRows =
    field.type === 'array' && typeof field.minRows === 'number'
      ? field.minRows
      : 0

  const maximumRows =
    field.type === 'array' && 'number'
      ? field.maxRows
      : undefined

  const hasReachedMinimum =
    currentRows.length <= minimumRows

  const hasReachedMaximum =
    maximumRows !== undefined && maximumRows !== null &&
    currentRows.length >= maximumRows

  const initializedPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (disabled) {
      return
    }

    if (currentRows.length > 0) {
      initializedPathRef.current = path
      return
    }

    if (initializedPathRef.current === path) {
      return
    }

    initializedPathRef.current = path

    addFieldRow({
      path,
      rowIndex: 0,
      schemaPath: '',
    })

    setModified(true)
  }, [
    addFieldRow,
    currentRows.length,
    disabled,
    path,
    setModified,
  ])

  const cardIds = useMemo(
    () =>
      currentRows.map((row, index) =>
        String(row?.id ?? `${path}.${index}`),
      ),
    [currentRows, path],
  )

  const {
    isExpanded: isRowExpanded,
    toggleExpanded: toggleRowExpanded,
    expandAll: expandAllRows,
    collapseAll: collapseAllRows,
    removeExpandedId: removeExpandedRowId,
  } = useExpandableCollection({
    ids: cardIds,
  })

  function CardRowSubtitle({
    cardPath,
  }: {
    cardPath: string
  }) {
    const { value } = useField<string>({
      path: `${cardPath}.title`
    })

    return value ?? ''
  }

  const addCard = () => {
    if (disabled || hasReachedMaximum) {
      return
    }

    addFieldRow({
      path,
      rowIndex: currentRows.length,
      schemaPath: '',
    })

    setModified(true)
  }

  const removeCard = (cardIndex: number) => {
    if (disabled || hasReachedMinimum) {
      return
    }

    const row = currentRows[cardIndex]

    if (!row) {
      return
    }

    if (row?.id) {
      removeExpandedRowId(String(row.id))
    }

    removeFieldRow({
      path,
      rowIndex: cardIndex,
    })

    setModified(true)
  }

  const moveCard = (
    fromIndex: number,
    toIndex: number,
  ) => {
    if (
      disabled ||
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentRows.length ||
      toIndex >= currentRows.length
    ) {
      return
    }

    moveFieldRow({
      path,
      moveFromIndex: fromIndex,
      moveToIndex: toIndex,
    })

    setModified(true)
  }

  const moveCardUp = (index: number) => {
    if (index <= 0) {
      return
    }

    moveCard(index, index - 1)
  }

  const moveCardDown = (index: number) => {
    if (index >= currentRows.length - 1) {
      return
    }

    moveCard(index, index + 1)
  }

  const {
    draggingId,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useSortableCollection({
    ids: cardIds,
    onMove: moveCard,
  })

  const getRowNumber = (
    index: number,
  ) => String(index + 1).padStart(2, '0')

  return (
    <div className="array-field">
        <div className="array-field__header-wrap">
          <div className="array-field__header-content">
            <h3 className="array-field__title">
              <div className="field-label">
                {field.label}
              </div>
            </h3>
          </div>
          <ul className="array-field__header-actions">
            <li>
              <button
                type="button"
                className="array-field__header-action"
                disabled={disabled || currentRows.length === 0}
                onClick={collapseAllRows}
              >
                Collapse All
              </button>
            </li>
            <li>
              <button
                type="button"
                className="array-field__header-action"
                disabled={disabled || currentRows.length === 0}
                onClick={expandAllRows}
              >
                Show All
              </button>
            </li>

          </ul>
        </div>

        <div className="array-field__draggable-rows">
          {currentRows.map((row, index) => {
            const cardId = String(
              row?.id ?? `${path}.${index}`,
            )

            const cardPath =
              row?.lastRenderedPath ??
              `${path}.${index}`

            const isExpanded =
              isRowExpanded(cardId)

            return (
              <SortableRow
                key={cardId}
                id={cardId}
                index={index}
                label="Card"
                subtitle={<CardRowSubtitle cardPath={cardPath} />}
                canDrag={false}
                isExpanded={isExpanded}
                draggingId={draggingId}
                dragOverId={dragOverId}
                onToggle={() =>
                  toggleRowExpanded(cardId)
                }
                onRemove={() =>
                  removeCard(index)
                }
                onDragStart={(event) =>
                  handleDragStart(event, cardId)
                }
                onDragOver={(event) =>
                  handleDragOver(event, cardId)
                }
                onDrop={(event) =>
                  handleDrop(event, cardId)
                }
                onDragEnd={handleDragEnd}
                removeControl={
                  <div className="display-flex flex-align-center gap-1">
                    <button
                      type="button"
                      disabled={disabled || index === 0}
                      className="btn LexicalEditorTheme__block__removeButton btn--icon btn--icon-style-without-border btn--icon-only btn--size-medium btn--icon-position-right btn--has-tooltip btn--withoutPopup btn--style-icon-label btn--round"
                      onClick={() => moveCardUp(index)}
                      aria-label={`Move Card ${getRowNumber(index)} Up`}
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        disabled || index === currentRows.length - 1
                      }
                      className="btn LexicalEditorTheme__block__removeButton btn--icon btn--icon-style-without-border btn--icon-only btn--size-medium btn--icon-position-right btn--has-tooltip btn--withoutPopup btn--style-icon-label btn--round"
                      onClick={() => moveCardDown(index)}
                      aria-label={`Move Card ${getRowNumber(index)} Down`}
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      aria-label={`Remove Card ${getRowNumber(index)}`}
                      className="padding-right-1 btn LexicalEditorTheme__block__removeButton btn--icon btn--icon-style-without-border btn--icon-only btn--size-medium btn--icon-position-right btn--has-tooltip btn--withoutPopup btn--style-icon-label btn--round"
                      disabled={disabled || hasReachedMinimum}
                      onClick={() => removeCard(index)}
                    >
                      <span className="btn__content">
                        <span className="btn__icon">
                          <svg
                            className="icon icon--x"
                            height="20"
                            viewBox="0 0 20 20"
                            width="20"
                          >
                            <path
                              className="stroke"
                              d="M14 6L6 14M6 6L14 14"
                              strokeLinecap="square"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                }
              >
                <CardGridRowFields
                  cardPath={cardPath}
                  fieldId={fieldId}
                  index={index}
                  disabled={disabled}
                />
              </SortableRow>
            )
          })}
        </div>
        <button
          type="button"
          aria-disabled={disabled || hasReachedMaximum}
          className="btn array-field__add-row btn--icon btn--icon-style-with-border btn--size-medium btn--icon-position-left btn--style-icon-label btn--withoutPopup"

          disabled={disabled || hasReachedMaximum}
          onClick={addCard}
        >
          <span className="btn__content"><span className="btn__label">Add Card</span>
            <span className="btn__icon">
              <svg className="icon icon--plus" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke" d="M5.33333 9.99998H14.6667M9.99999 5.33331V14.6666" strokeLinecap="square"></path>
              </svg>
            </span>
          </span>
        </button>
      </div>
  )
}
