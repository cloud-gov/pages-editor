'use client'
import React, { useCallback, useEffect, useId, useRef } from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import type { DraggableAttributes } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

import './index.scss'

const baseClass = 'files-draggable'

type DragEndArgs = { moveFromIndex: number; moveToIndex: number }

type DragDropCustomListProps = {
  children: React.ReactNode
  className?: string
  ids: string[]
  onDragEnd: (args: DragEndArgs) => void
}


export const DragDropCustomList: React.FC<DragDropCustomListProps> = ({
  children,
  className,
  ids,
  onDragEnd,
}) => {
  const dndContextID = useId()
  const sortableContextID = useId()

  const { setNodeRef } = useDroppable({ id: dndContextID })

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = useCallback(
    (event: Parameters<NonNullable<React.ComponentProps<typeof DndContext>['onDragEnd']>>[0]) => {
      const { active, over } = event
      event.activatorEvent.stopPropagation()
      if (!active || !over) {
        return
      }
      onDragEnd({
        moveFromIndex: ids.findIndex((id) => id === active.id),
        moveToIndex: ids.findIndex((id) => id === over.id),
      })
    },
    [ids, onDragEnd],
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={dndContextID}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext id={sortableContextID} items={ids}>
        <div className={[baseClass, className].filter(Boolean).join(' ')} ref={setNodeRef}>
          {children}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export type DragDropCustomItemRenderProps = {
  attributes: DraggableAttributes
  isDragging: boolean
  listeners: SyntheticListenerMap | undefined
}

type DragDropCustomItemProps = {
  children: (props: DragDropCustomItemRenderProps) => React.ReactNode
  className?: string
  disabled?: boolean
  id: string
}

export const DragDropCustomItem: React.FC<DragDropCustomItemProps> = ({
  children,
  className,
  disabled,
  id,
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0, 0.2, 0.2, 1)',
    },
  })

  const nodeRef = useRef<HTMLDivElement | null>(null)

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node
      setNodeRef(node)
    },
    [setNodeRef],
  )

  useEffect(() => {
    const node = nodeRef.current
    if (!node) {
      return
    }
    node.style.setProperty(
      '--files-row-transform',
      transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
    )
    node.style.setProperty('--files-row-transition', transition ?? 'none')
  }, [transform, transition])

  return (
    <div
      className={[
        `${baseClass}__item`,
        isDragging ? `${baseClass}__item--is-dragging` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={setRef}
    >
      {children({ attributes, isDragging, listeners })}
    </div>
  )
}
