'use client'

import { useState } from 'react'

type Options = {
  ids: string[]
  onMove: (
    fromIndex: number,
    toIndex: number,
  ) => void
}

export function useSortableCollection({
  ids,
  onMove,
}: Options) {
  const [draggingId, setDraggingId] =
    useState<string | null>(null)

  const [dragOverId, setDragOverId] =
    useState<string | null>(null)

  const handleDragStart = (
    event: React.DragEvent,
    id: string,
  ) => {
    setDraggingId(id)

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (
    event: React.DragEvent,
    id: string,
  ) => {
    event.preventDefault()

    event.dataTransfer.dropEffect = 'move'

    if (dragOverId !== id) {
      setDragOverId(id)
    }
  }

  const handleDrop = (
    event: React.DragEvent,
    targetId: string,
  ) => {
    event.preventDefault()

    const sourceId =
      draggingId ||
      event.dataTransfer.getData('text/plain')

    if (!sourceId || sourceId === targetId) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }

    const fromIndex =
      ids.indexOf(sourceId)

    const toIndex =
      ids.indexOf(targetId)

    if (
      fromIndex !== -1 &&
      toIndex !== -1
    ) {
      onMove(fromIndex, toIndex)
    }

    setDraggingId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverId(null)
  }

  return {
    draggingId,
    dragOverId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  }
}
