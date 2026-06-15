'use client'
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import './index.scss'

const baseClass = 'files-draggable'

type DragEndArgs = { moveFromIndex: number; moveToIndex: number }

type DragDropContextValue = {
  activeId: string | null
  ids: string[]
  registerItem: (id: string, node: HTMLElement | null) => void
  startDrag: (id: string, event: ReactPointerEvent) => void
}

const DragDropContext = createContext<DragDropContextValue | null>(null)

const useDragDropContext = () => {
  const context = useContext(DragDropContext)
  if (!context) {
    throw new Error('DragDropCustomItem must be used within a DragDropCustomList')
  }
  return context
}

const EASING = 'cubic-bezier(0, 0.2, 0.2, 1)'
const DURATION = 200

export type DragDropCustomItemRenderProps = {
  attributes: { 'aria-grabbed'?: boolean }
  isDragging: boolean
  listeners: {
    onPointerDown: (event: ReactPointerEvent) => void
  }
}

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
  const [activeId, setActiveId] = useState<string | null>(null)

  const idsRef = useRef(ids)
  idsRef.current = ids

  const itemNodes = useRef(new Map<string, HTMLElement>())
  const previousRects = useRef(new Map<string, DOMRect>())
  const currentShift = useRef(new Map<string, number>())
  const shouldAnimate = useRef(false)
  const orderKey = ids.join('|')

  const dragState = useRef<{
    draggedId: string
    height: number
    maxDelta: number
    minDelta: number
    pointerClientY: number
    restingCenters: { id: string; center: number }[]
    scrollContainer: HTMLElement | Window
    startPageY: number
    targetIndex: number
  } | null>(null)

  const rafId = useRef<number | null>(null)

  React.useEffect(
    () => () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    },
    [],
  )

  const registerItem = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      itemNodes.current.set(id, node)
    } else {
      itemNodes.current.delete(id)
    }
  }, [])

  const captureRects = useCallback(() => {
    const rects = new Map<string, DOMRect>()
    itemNodes.current.forEach((node, id) => {
      rects.set(id, node.getBoundingClientRect())
    })
    return rects
  }, [])

  const getGap = useCallback(() => {
    const first = itemNodes.current.values().next().value as HTMLElement | undefined
    const parent = first?.parentElement
    if (!parent) {
      return 0
    }
    const gap = parseFloat(getComputedStyle(parent).rowGap || '0')
    return Number.isNaN(gap) ? 0 : gap
  }, [])

  const animateShiftTo = useCallback((id: string, target: number) => {
    const node = itemNodes.current.get(id)
    if (!node) {
      return
    }
    const from = currentShift.current.get(id) ?? 0
    if (from === target) {
      return
    }
    currentShift.current.set(id, target)
    const animation = node.animate(
      [{ transform: `translateY(${from}px)` }, { transform: `translateY(${target}px)` }],
      { duration: DURATION, easing: EASING, fill: 'forwards' },
    )
    if (target === 0) {
      animation.onfinish = () => {
        animation.cancel()
        currentShift.current.delete(id)
      }
    }
  }, [])

  const applyShifts = useCallback(
    (draggedId: string, targetIndex: number, rowHeight: number) => {
      const ids = idsRef.current
      const draggedIndex = ids.findIndex((id) => id === draggedId)
      if (draggedIndex === -1) {
        return
      }
      ids.forEach((id, index) => {
        if (id === draggedId) {
          return
        }
        let shift = 0
        if (draggedIndex < targetIndex && index > draggedIndex && index <= targetIndex) {
          shift = -rowHeight
        } else if (draggedIndex > targetIndex && index >= targetIndex && index < draggedIndex) {
          shift = rowHeight
        }
        animateShiftTo(id, shift)
      })
    },
    [animateShiftTo],
  )

  const clearShifts = useCallback(() => {
    Array.from(currentShift.current.keys()).forEach((id) => animateShiftTo(id, 0))
  }, [animateShiftTo])

  // FLIP settle after a committed reorder.
  useLayoutEffect(() => {
    if (!shouldAnimate.current) {
      return
    }
    shouldAnimate.current = false
    const previous = previousRects.current
    itemNodes.current.forEach((node, id) => {
      const oldRect = previous.get(id)
      if (!oldRect) {
        return
      }
      const newRect = node.getBoundingClientRect()
      const deltaY = oldRect.top - newRect.top
      if (deltaY) {
        node.animate(
          [{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }],
          { duration: DURATION, easing: EASING },
        )
      }
    })
  }, [orderKey])

  const startDrag = useCallback(
    (id: string, event: ReactPointerEvent) => {
      const node = itemNodes.current.get(id)
      if (!node) {
        return
      }
      const rect = node.getBoundingClientRect()
      const draggedIndex = idsRef.current.findIndex((rowId) => rowId === id)
      const pageY = event.clientY + window.scrollY
      const restingCenters = idsRef.current.map((rowId) => {
        const rowNode = itemNodes.current.get(rowId)
        const r = rowNode?.getBoundingClientRect()
        return { id: rowId, center: r ? r.top + window.scrollY + r.height / 2 : 0 }
      })

      const findScrollContainer = (el: HTMLElement | null): HTMLElement | Window => {
        let current = el?.parentElement ?? null
        while (current) {
          const style = getComputedStyle(current)
          const overflowY = style.overflowY
          if (
            (overflowY === 'auto' || overflowY === 'scroll') &&
            current.scrollHeight > current.clientHeight
          ) {
            return current
          }
          current = current.parentElement
        }
        return window
      }

      dragState.current = {
        draggedId: id,
        height: rect.height + getGap(),
        ...(() => {
          const listEl = node.parentElement
          if (listEl) {
            const listRect = listEl.getBoundingClientRect()
            const listTop = listRect.top + window.scrollY
            const listBottom = listRect.bottom + window.scrollY
            const rowTop = rect.top + window.scrollY
            const rowBottom = rect.bottom + window.scrollY
            return {
              maxDelta: listBottom - rowBottom,
              minDelta: listTop - rowTop,
            }
          }
          return { maxDelta: Infinity, minDelta: -Infinity }
        })(),
        pointerClientY: event.clientY,
        restingCenters,
        scrollContainer: findScrollContainer(node),
        startPageY: pageY,
        targetIndex: draggedIndex,
      }
      setActiveId(id)

      const update = () => {
        const state = dragState.current
        if (!state) {
          return
        }
        const pointerPageY = state.pointerClientY + window.scrollY

        const draggedNode = itemNodes.current.get(state.draggedId)
        if (draggedNode) {
          const rawDelta = pointerPageY - state.startPageY
          const deltaY = Math.max(state.minDelta, Math.min(state.maxDelta, rawDelta))
          draggedNode.animate([{ transform: `translateY(${deltaY}px)` }], {
            duration: 0,
            fill: 'forwards',
          })
        }

        const rawDelta = pointerPageY - state.startPageY
        const clampedDelta = Math.max(state.minDelta, Math.min(state.maxDelta, rawDelta))

        const draggedTop = state.startPageY + clampedDelta
        const draggedBottom = draggedTop + state.height

        let computed = 0
        state.restingCenters.forEach(({ id: rowId, center }) => {
          if (rowId === state.draggedId) {
            return
          }
          if (center < state.startPageY) {
            if (draggedTop >= center) {
              computed += 1
            }
          } else {
            if (draggedBottom > center) {
              computed += 1
            }
          }
        })
        const ids = idsRef.current
        computed = Math.max(0, Math.min(computed, ids.length - 1))
        if (computed !== state.targetIndex) {
          state.targetIndex = computed
          applyShifts(state.draggedId, computed, state.height)
        }
      }

      const EDGE = 60
      const MAX_SPEED = 18
      const autoScrollStep = () => {
        const state = dragState.current
        if (!state) {
          rafId.current = null
          return
        }
        const container = state.scrollContainer
        let top: number
        let bottom: number
        if (container === window) {
          top = 0
          bottom = window.innerHeight
        } else {
          const r = (container as HTMLElement).getBoundingClientRect()
          top = r.top
          bottom = r.bottom
        }
        const y = state.pointerClientY
        let delta = 0
        if (y < top + EDGE) {
          delta = -MAX_SPEED * ((top + EDGE - y) / EDGE)
        } else if (y > bottom - EDGE) {
          delta = MAX_SPEED * ((y - (bottom - EDGE)) / EDGE)
        }
        if (delta !== 0) {
          if (container === window) {
            window.scrollBy(0, delta)
          } else {
            ;(container as HTMLElement).scrollTop += delta
          }
          update()
        }
        rafId.current = requestAnimationFrame(autoScrollStep)
      }

      const handleScroll = () => {
        update()
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = dragState.current
        if (!state) {
          return
        }
        state.pointerClientY = moveEvent.clientY
        update()
      }

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
        window.removeEventListener('scroll', handleScroll, true)
        if (rafId.current !== null) {
          cancelAnimationFrame(rafId.current)
          rafId.current = null
        }

        const state = dragState.current
        dragState.current = null

        const draggedNode = state ? itemNodes.current.get(state.draggedId) : undefined
        draggedNode?.getAnimations().forEach((animation) => animation.cancel())

        if (state) {
          const ids = idsRef.current
          const moveFromIndex = ids.findIndex((rowId) => rowId === state.draggedId)
          const moveToIndex = state.targetIndex
          if (moveFromIndex !== -1 && moveToIndex !== moveFromIndex) {
            itemNodes.current.forEach((rowNode) => {
              rowNode.getAnimations().forEach((animation) => animation.cancel())
            })
            currentShift.current.clear()
            previousRects.current = captureRects()
            shouldAnimate.current = true
            onDragEnd({ moveFromIndex, moveToIndex })
          } else {
            clearShifts()
          }
        }
        setActiveId(null)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      window.addEventListener('scroll', handleScroll, true)
      rafId.current = requestAnimationFrame(autoScrollStep)
    },
    [applyShifts, captureRects, clearShifts, getGap, onDragEnd],
  )

  const contextValue = useMemo<DragDropContextValue>(
    () => ({
      activeId,
      ids,
      registerItem,
      startDrag,
    }),
    [activeId, ids, registerItem, startDrag],
  )

  return (
    <DragDropContext.Provider value={contextValue}>
      <div className={[baseClass, className].filter(Boolean).join(' ')}>{children}</div>
    </DragDropContext.Provider>
  )
}

type DragDropCustomItemProps = {
  children: (props: DragDropCustomItemRenderProps) => React.ReactNode
  className?: string
  disabled?: boolean
  id: string
}

export const DragDropCustomItem: React.FC<DragDropCustomItemProps> = ({
  children,
  disabled,
  id,
}) => {
  const { activeId, registerItem, startDrag } = useDragDropContext()

  const setItemRef = useCallback(
    (node: HTMLElement | null) => {
      registerItem(id, node)
    },
    [id, registerItem],
  )

  const isDragging = activeId === id

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (disabled || event.button !== 0) {
        return
      }
      event.preventDefault()
      startDrag(id, event)
    },
    [disabled, id, startDrag],
  )

  return (
    <div
      className={[`${baseClass}__item`, isDragging ? `${baseClass}__item--is-dragging` : '']
        .filter(Boolean)
        .join(' ')}
      ref={setItemRef}
    >
      {children({
        attributes: { 'aria-grabbed': isDragging || undefined },
        isDragging,
        listeners: {
          onPointerDown: handlePointerDown,
        },
      })}
    </div>
  )
}
