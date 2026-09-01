'use client'

import React, { DragEvent, useEffect, useId, useRef } from 'react'

export type SortableRowProps = {
  id: string
  index: number
  label: string
  subtitle?: React.ReactNode
  isExpanded: boolean
  canDrag: boolean
  readOnly?: boolean
  draggingId: string | null
  dragOverId: string | null
  hasError?: boolean
  onToggle: () => void
  onRemove: () => void
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => void
  onDragOver: (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => void
  onDrop: (
    event: React.DragEvent<HTMLDivElement>,
    id: string
  ) => void
  onDragEnd: () => void
  removeControl?: React.ReactNode
  meta?: React.ReactNode
  children?: React.ReactNode
}

type DragHandleProps = {
  canDrag: boolean
  onMouseDown?: () => void
  onMouseUp?: () => void
  onMouseLeave?: () => void
  draggable?: true
  onDragStart?: any
  onDragEnd?: any
}

const getRowNumber = (index: number) =>
  String(index + 1).padStart(2, '0')

export const DragHandle = ({
  canDrag,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  draggable,
  onDragStart,
  onDragEnd,
}: DragHandleProps) => {
  if (!canDrag) {
    return (
      <div
        aria-hidden="true"
        className="custom-blocks-field__drag-handle collapsible__drag"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="custom-blocks-field__drag-handle collapsible__drag"
      title="Drag to reorder"
      draggable={canDrag && draggable ? true : undefined}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <svg
        className="icon icon--drag-handle"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill"
          d="M7.99999 10.6667C8.36818 10.6667 8.66666 10.3682 8.66666 9.99999C8.66666 9.6318 8.36818 9.33332 7.99999 9.33332C7.63181 9.33332 7.33333 9.6318 7.33333 9.99999C7.33333 10.3682 7.63181 10.6667 7.99999 10.6667Z"
          strokeLinecap="square"
        />
        <path
          className="fill"
          d="M7.99999 5.99999C8.36818 5.99999 8.66666 5.70151 8.66666 5.33332C8.66666 4.96513 8.36818 4.66666 7.99999 4.66666C7.63181 4.66666 7.33333 4.96513 7.33333 5.33332C7.33333 5.70151 7.63181 5.99999 7.99999 5.99999Z"
          strokeLinecap="square"
        />
        <path
          className="fill"
          d="M7.99999 15.3333C8.36818 15.3333 8.66666 15.0348 8.66666 14.6667C8.66666 14.2985 8.36818 14 7.99999 14C7.63181 14 7.33333 14.2985 7.33333 14.6667C7.33333 15.0348 7.63181 15.3333 7.99999 15.3333Z"
          strokeLinecap="square"
        />
        <path
          className="fill"
          d="M12 10.6667C12.3682 10.6667 12.6667 10.3682 12.6667 9.99999C12.6667 9.6318 12.3682 9.33332 12 9.33332C11.6318 9.33332 11.3333 9.6318 11.3333 9.99999C11.3333 10.3682 11.6318 10.6667 12 10.6667Z"
          strokeLinecap="square"
        />
        <path
          className="fill"
          d="M12 5.99999C12.3682 5.99999 12.6667 5.70151 12.6667 5.33332C12.6667 4.96513 12.3682 4.66666 12 4.66666C11.6318 4.66666 11.3333 4.96513 11.3333 5.33332C11.3333 5.70151 11.6318 5.99999 12 5.99999Z"
          strokeLinecap="square"
        />
        <path
          className="fill"
          d="M12 15.3333C12.3682 15.3333 12.6667 15.0348 12.6667 14.6667C12.6667 14.2985 12.3682 14 12 14C11.6318 14 11.3333 14.2985 11.3333 14.6667C11.3333 15.0348 11.6318 15.3333 12 15.3333Z"
          strokeLinecap="square"
        />
      </svg>
    </div>
  )
}

export function SortableRow({
  id,
  index,
  label,
  subtitle,
  isExpanded,
  canDrag,
  draggingId,
  dragOverId,
  hasError,
  onToggle,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  removeControl,
  meta,
  children,
}: SortableRowProps) {
  const dragHandlePressed = useRef(false)

  const rowNumber = getRowNumber(index)

  const handleDragHandleMouseDown = () => {
    dragHandlePressed.current = true
  }

  const handleDragHandleMouseUp = () => {
    dragHandlePressed.current = false
  }

  const handleDragHandleMouseLeave = () => {
    dragHandlePressed.current = false
  }

  const handleRowDragStart = (
    e: DragEvent<HTMLDivElement>,
  ) => {
    if (!dragHandlePressed.current) {
      e.preventDefault()
      return
    }

    onDragStart(e, id)
  }

  const contentRef = useRef<HTMLDivElement>(null)
  const contentId = useId()
  const wasExpanded = useRef(isExpanded)

  useEffect(() => {
    const justExpanded = !wasExpanded.current && isExpanded

    if (justExpanded) {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        `
        input:not([disabled]),
        textarea:not([disabled]),
        select:not([disabled]),
        button:not([disabled]),
        [contenteditable="true"]
        `
      )

      firstFocusable?.focus()
    }

    wasExpanded.current = isExpanded
  }, [isExpanded])

  return (
    <div
      id={`content-row-${rowNumber}`}
      className="blocks-field__row-wrap"
    >
      <div
        className={[
          'custom-blocks-field__item',

          draggingId === id &&
          'custom-blocks-field__item--dragging',

          dragOverId === id &&
          draggingId !== id &&
          'custom-blocks-field__item--drag-over',

          'collapsible',
          'blocks-field__row',

          hasError
            ? 'blocks-field__row--has-errors'
            : 'blocks-field__row--no-errors',

          canDrag &&
          'collapsible--has-drag-handle',

          'collapsible--style-default',

          isExpanded &&
          'collapsible--open',
        ]
          .filter(Boolean)
          .join(' ')}
        draggable={canDrag}
        onDragStart={handleRowDragStart}
        onDragOver={(e) => onDragOver(e, id)}
        onDrop={(e) => onDrop(e, id)}
        onDragEnd={() => {
          dragHandlePressed.current = false
          onDragEnd()
        }}
      >
        <div
          className={[
            'custom-blocks-field__card',

            hasError &&
            'custom-blocks-field__card--error',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="custom-blocks-field__card-header collapsible__toggle-wrap">
            <DragHandle
              canDrag={canDrag}
              onMouseDown={
                handleDragHandleMouseDown
              }
              onMouseUp={
                handleDragHandleMouseUp
              }
              onMouseLeave={
                handleDragHandleMouseLeave
              }
            />

            <button
              type="button"
              className="collapsible__toggle custom-blocks-field__toggle"
              aria-expanded={isExpanded}
              onClick={onToggle}
              aria-label={id}
            >
              <span className="visually-hidden">
                Toggle row {rowNumber}
              </span>

              <span
                className={[
                  'collapsible__header-wrap',

                  canDrag &&
                  'collapsible__header-wrap--has-drag-handle',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="blocks-field__block-header">
                  <span className="custom-blocks-field__item-index blocks-field__block-number padding-left-4">
                    {rowNumber}
                  </span>

                  <span className="custom-blocks-field__card-text pill pill--style-white pill--size-small blocks-field__block-pill">
                    <span className="custom-blocks-field__card-title pill__label">
                      {label}
                    </span>
                  </span>

                  {subtitle ? (
                    <span className="custom-blocks-field__card-subtitle section-title">
                      {subtitle}
                    </span>
                  ) : null}
                </span>
              </span>

              <span
                className="collapsible__indicator"
                aria-hidden="true"
              >
                <svg
                  className={[
                    'icon',
                    'icon--chevron',

                    isExpanded &&
                    'expanded-icon',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  height="100%"
                  viewBox="0 0 20 20"
                  width="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="stroke"
                    d="M14 8L10 12L6 8"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </button>

            {removeControl ?? (
              <button
                type="button"
                onClick={onRemove}
              >
                Remove
              </button>
            )}
          </div>

          {meta}

          {isExpanded ? (
            <div className="collapsible__content">
              <div role="region" aria-labelledby={id} ref={contentRef} id={contentId}>
                {children}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
