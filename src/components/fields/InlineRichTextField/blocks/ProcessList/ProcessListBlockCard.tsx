'use client'

import React, { useState } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { $getNodeByKey, type NodeKey } from 'lexical'

import {
  $isInlinePayloadBlockNode,
} from '../../InlinePayloadBlockNode'

import {
  ProcessListItem,
  type ProcessListItemData,
} from './ProcessListItem'
import { createDefaultRichText } from '../../defaultRichText'

import {
  useSortableCollection
} from '@/hooks/useSortableCollection'

import { useExpandableCollection } from '@/hooks/useExpandableCollection'

type ProcessListHeadingLevel =
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'

type ProcessListFields = {
  id: string
  blockName?: string
  blockType: 'processList'
  headingLevel?: ProcessListHeadingLevel
  items?: ProcessListItemData[]
}

type Props = {
  nodeKey: NodeKey
  fields: ProcessListFields
}

export function ProcessListBlockCard({
  nodeKey,
  fields,
}: Props) {
  const [editor] = useLexicalComposerContext()

  const items = fields.items ?? []

  const {
    isExpanded: isItemExpanded,
    toggleExpanded: toggleItemExpanded,
    expand: expandItem,
    expandAll: expandAllItems,
    collapseAll: collapseAllItems,
    removeExpandedId: removeExpandedItemId,
  } = useExpandableCollection({
    ids: items.map((item) => item.id)
  })

  const updateFields = (
    updater: (
      currentFields: ProcessListFields,
    ) => ProcessListFields,
  ) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)

      if (!$isInlinePayloadBlockNode(node)) {
        return
      }

      const nextFields = updater(
        structuredClone(
          node.getFields(),
        ) as ProcessListFields,
      )

      node.setFields(nextFields)
    })
  }

  const addItem = () => {
    const id = crypto.randomUUID()

    updateFields((current) => ({
      ...current,
      items: [
        ...(current.items ?? []),
        {
          id,
          heading: 'Process List item',
          content: createDefaultRichText(),
        },
      ],
    }))

    expandItem(id)
  }

  const removeItem = (itemId: string) => {
    updateFields((current) => ({
      ...current,
      items: (current.items ?? []).filter(
        (item) => item.id !== itemId,
      ),
    }))

    removeExpandedItemId(itemId)
  }

  const updateHeading = (
    itemId: string,
    heading: string,
  ) => {
    updateFields((current) => ({
      ...current,
      items: (current.items ?? []).map((item) =>
        item.id === itemId
          ? {
            ...item,
            heading,
          }
          : item,
      ),
    }))
  }

  const updateHeadingLevel = (
    headingLevel: ProcessListHeadingLevel,
  ) => {
    updateFields((current) => ({
      ...current,
      headingLevel,
    }))
  }

  const updateItemContent = (
    itemId: string,
    content: unknown,
  ) => {
    updateFields((current) => ({
      ...current,
      items: (current.items ?? []).map((item) =>
        item.id === itemId
          ? {
            ...item,
            content,
          }
          : item,
      ),
    }))
  }

  const moveItem = (
    fromIndex: number,
    toIndex: number,
  ) => {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || toIndex < 0) return
    if (fromIndex >= items.length) return
    if (toIndex >= items.length) return

    updateFields((current) => {
      const nextItems = [
        ...(current.items ?? []),
      ]

      const [movedItem] =
        nextItems.splice(fromIndex, 1)

      if (!movedItem) {
        return current
      }

      nextItems.splice(
        toIndex,
        0,
        movedItem,
      )

      return {
        ...current,
        items: nextItems,
      }
    })
  }

  const removeProcessList = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)

      if ($isInlinePayloadBlockNode(node)) {
        node.remove()
      }
    })
  }

  const {
    draggingId,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useSortableCollection({
    ids: items.map((item) => item.id),
    onMove: moveItem,
  })

  return (
    <section className="custom-blocks-field__process_list">
      <header className="custom-blocks-field__process_list-header">
        <div className="custom-blocks-field__process_list-header-content">
          <div className="collapsible__toggle-wrap">
            <div className="collapsible__header-wrap">
              <div className="LexicalEditorTheme__block__block-header">
                <div className="LexicalEditorTheme__block__block-label">
                  <span className="custom-blocks-field__card-text pill pill--style-white pill--size-small blocks-field__block-pill">
                    <span className="custom-blocks-field__card-title pill__label">
                      <strong>Process List</strong>
                    </span>
                  </span>
                </div>
                <div className="LexicalEditorTheme__block__block-actions">
                  <button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={removeProcessList}
                  >
                    <aside aria-hidden="true" className="tooltip btn__tooltip tooltip--caret-center tooltip--position-top opacity-0">
                      <div className="tooltip-content">Remove Block</div>
                    </aside>
                    <aside className="tooltip btn__tooltip tooltip--caret-center tooltip--position-bottom" title="Remove Block">
                      <div className="tooltip-content">Remove Block</div>
                    </aside>
                    <span className="btn__content">
                      <span className="btn__icon">
                        <svg className="icon icon--x" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path className="stroke" d="M14 6L6 14M6 6L14 14" strokeLinecap="square"></path></svg>
                      </span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="collapsible__content">
            <div className="render-fields">
              <div className="field-type select" id="field-headingLevel">
                <label
                  htmlFor={`process_list-heading-level-${nodeKey}`}
                  className="field-label"
                >
                  Heading Level
                </label>
                <div className="field-type__wrap">
                  <div className="react-select">
                    <select
                      id={`process_list-heading-level-${nodeKey}`}
                      className="usa-select process_list-heading-level rs_control"
                      value={fields.headingLevel ?? 'h4'}
                      onChange={(event) =>
                        updateHeadingLevel(
                          event.target
                            .value as ProcessListHeadingLevel,
                        )
                      }
                    >
                      <option value="h2">
                        Heading 2
                      </option>

                      <option value="h3">
                        Heading 3
                      </option>

                      <option value="h4">
                        Heading 4
                      </option>

                      <option value="h5">
                        Heading 5
                      </option>

                      <option value="h6">
                        Heading 6
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field-type array-field" id="field-item">
                <div className="array-field__header-wrap">
                  <div className="array-field__header-content">
                    <h3 className="array-field__title">
                      <div className="field-label">
                        Items
                      </div>
                    </h3>
                  </div>
                  <div className="array-field__header-actions">
                    <ul className="array-field__header-actions">
                      <li>
                        <button
                          type="button"
                          className="array-field__header-action"
                          disabled={items.length === 0}
                          onClick={collapseAllItems}
                        >
                          Collapse All
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="array-field__header-action"
                          disabled={items.length === 0}
                          onClick={expandAllItems}
                        >
                          Show All
                        </button>
                      </li>
                      <li></li>
                    </ul>
                  </div>
                </div>
              </div>  
            </div>

{items.length > 0 ? (
        <div className="margin-top-1">
          <div className="custom-blocks-field__process_list-items array-field__draggable-rows">
            {items.map((item, index) => {
              const isOpen =
                isItemExpanded(item.id)

              const isDragging =
                draggingId === item.id

              const isDragOver =
                dragOverId === item.id &&
                draggingId !== item.id

              return (
                <div
                  key={item.id}
                  className={[
                    'custom-blocks-field__process_list-item-wrap custom-blocks-field__item',
                    isDragging &&
                    'custom-blocks-field__process_list-item-wrap--dragging',
                    isDragOver &&
                    'custom-blocks-field__process_list-item-wrap--drag-over',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  draggable={items.length > 1}
                  onDragStart={(event) =>
                    handleDragStart(
                      event,
                      item.id,
                    )
                  }
                  onDragOver={(event) =>
                    handleDragOver(
                      event,
                      item.id,
                    )
                  }
                  onDrop={(event) =>
                    handleDrop(
                      event,
                      item.id,
                    )
                  }
                  onDragEnd={handleDragEnd}
                >
                  <ProcessListItem
                    item={item}
                    index={index}
                    itemCount={items.length}
                    isOpen={isOpen}
                    canMoveUp={index > 0}
                    canMoveDown={
                      index < items.length - 1
                    }
                    onToggleOpen={() =>
                      toggleItemExpanded(item.id)
                    }
                    onHeadingChange={updateHeading}
                    onContentChange={updateItemContent}
                    onRemove={removeItem}
                    onMoveUp={() =>
                      moveItem(
                        index,
                        index - 1,
                      )
                    }
                    onMoveDown={() =>
                      moveItem(
                        index,
                        index + 1,
                      )
                    }
                  />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="custom-blocks-field__process_list-empty">
          No process list items added yet.
        </div>
      )}

      <div className="custom-blocks-field__process_list-actions margin-top-1">

        <button type="button" onClick={addItem} className="btn array-field__add-row btn--icon btn--icon-style-with-border btn--size-medium btn--icon-position-left btn--withoutPopup btn--style-icon-label btn--withoutPopup">
          <span className="btn__content">
            <span className="btn__label">Add Item</span>
            <span className="btn__icon">
              <svg className="icon icon--plus" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path className="stroke" d="M5.33333 9.99998H14.6667M9.99999 5.33331V14.6666" strokeLinecap="square"></path>
              </svg>
            </span>
          </span>
        </button>
      </div>
          </div>
          <div className="custom-blocks-field__header-actions">

            <div className="custom-blocks-field__process_list-meta">

            </div>
            
          </div>

        </div>
        
      </header>

      
    </section>
  )
}
