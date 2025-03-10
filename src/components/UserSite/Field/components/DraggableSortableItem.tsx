'use client'
import type { UseDraggableArguments } from '@dnd-kit/core'
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import type { UseDraggableSortableReturn } from './useDraggableSortableTypes.js'

import React, { Fragment } from 'react'

export type DragHandleProps = {
    attributes: UseDraggableArguments['attributes']
    listeners: SyntheticListenerMap
  } & UseDraggableArguments

  export type ChildFunction = (args: UseDraggableSortableReturn) => React.ReactNode

  export type Props = {
    children: ChildFunction
  } & UseDraggableArguments
import { useDraggableSortable } from './useDraggableSortable'

export const DraggableSortableItem: React.FC<
  {
    children: ChildFunction
  } & UseDraggableArguments
> = (props) => {
  const { id, children, disabled } = props

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } =
    useDraggableSortable({
      id,
      disabled,
    })

  return (
    <Fragment>
      {children({
        attributes: {
          ...attributes,
          style: {
            cursor: isDragging ? 'grabbing' : 'grab',
          },
        },
        isDragging,
        listeners,
        setNodeRef,
        transform,
        transition,
      })}
    </Fragment>
  )
}
