'use client'

import React from 'react'

import { InlineRichTextField } from '@/components/fields/InlineRichTextField'

export type AccordionItemData = {
  id: string
  heading: string
  content: unknown
}

const DragHandle = ({
  canDrag,
}: {
  canDrag: boolean
}) => {
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

type Props = {
  item: AccordionItemData
  index: number
  itemCount: number
  isOpen: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onToggleOpen: () => void
  onHeadingChange: (
    itemId: string,
    heading: string,
  ) => void
  onContentChange: (
    itemId: string,
    content: unknown,
  ) => void
  onRemove: (
    itemId: string,
  ) => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function AccordionItem({
  item,
  index,
  itemCount,
  isOpen,
  canMoveUp,
  canMoveDown,
  onToggleOpen,
  onHeadingChange,
  onContentChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const itemLabel =
    item.heading ||
    `Item ${index + 1}`

  const panelId =
    `accordion-item-${item.id}-fields`

    const rowNumber = String(index + 1).padStart(2, '0')
  return (
    <>
    <div
      id={`content-row-${rowNumber}`}
      className="blocks-field__row-wrap"
    >
      <div className="custom-accordion-card">
        <div className="custom-blocks-field__card">
          <div className="custom-blocks-field__card-header collapsible__toggle-wrap">
            <DragHandle canDrag={true} />
            <button
            type="button"
            className="collapsible__toggle custom-blocks-field__toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={onToggleOpen}
          >
            <span className="visually-hidden">
                Toggle block {rowNumber}
              </span>

            <span
                className={[
                  'collapsible__header-wrap',
                  'collapsible__header-wrap--has-drag-handle',
                  'padding-left-4',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="blocks-field__block-header">
                  <span className="custom-blocks-field__item-index blocks-field__block-number">
                    {rowNumber}
                  </span>

                  <span className="custom-blocks-field__card-text pill pill--style-white pill--size-small blocks-field__block-pill">
                    <span className="custom-blocks-field__card-title pill__label">
                      {itemLabel}
                    </span>
                  </span>

                  <span className="custom-blocks-field__card-subtitle section-title">
                    
                  </span>
                </span>
              </span>

              <span className="collapsible__indicator" aria-hidden="true">
                <svg
                  className={[
                    'icon',
                    'icon--chevron',
                    isOpen && 'expanded-icon',
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
          </div>
        </div>
      </div>

    </div>
    <article className="custom-blocks-field__accordion-item">
      

      {isOpen ? (
        <div
          id={panelId}
          className="custom-blocks-field__accordion-item-fields collapsible__content render-fields"
        >
          <div className="usa-form-group field-type text">
            <label
              htmlFor={`accordion-heading-${item.id}`}
              className="field-label"
            >
              Heading
            </label>

            <input
              id={`accordion-heading-${item.id}`}
              className="usa-input"
              type="text"
              value={item.heading}
              onChange={(event) =>
                onHeadingChange(
                  item.id,
                  event.target.value,
                )
              }
            />
          </div>

          <div className="custom-blocks-field__accordion-item-content">
            <label className="field-label">
              Content
            </label>

            <InlineRichTextField
              value={item.content}
              onChange={(content) =>
                onContentChange(
                  item.id,
                  content,
                )
              }
              showBlocksMenu={false}
            />
          </div>
        </div>
      ) : null}
    </article>
    </>
  )
}
