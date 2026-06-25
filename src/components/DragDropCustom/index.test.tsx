import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

import { DragDropCustomList, DragDropCustomItem } from './index'

const renderList = (ids: string[], onDragEnd = vi.fn()) =>
  render(
    <DragDropCustomList ids={ids} onDragEnd={onDragEnd}>
      {ids.map((id) => (
        <DragDropCustomItem id={id} key={id}>
          {({ attributes, isDragging, listeners }) => (
            <div
              data-dragging={isDragging}
              data-testid={`item-${id}`}
              {...attributes}
              {...listeners}
            >
              {id}
            </div>
          )}
        </DragDropCustomItem>
      ))}
    </DragDropCustomList>,
  )

describe('DragDropCustom', () => {
  it('renders the list wrapper and all items', () => {
    const { container } = renderList(['a', 'b', 'c'])

    expect(container.querySelector('.files-draggable')).toBeInTheDocument()
    expect(screen.getByTestId('item-a')).toHaveTextContent('a')
    expect(screen.getByTestId('item-b')).toHaveTextContent('b')
    expect(screen.getByTestId('item-c')).toHaveTextContent('c')
  })

  it('wraps each child in a draggable item element', () => {
    const { container } = renderList(['a', 'b'])

    const items = container.querySelectorAll('.files-draggable__item')
    expect(items).toHaveLength(2)
  })

  it('exposes a render-prop API with attributes, isDragging and listeners', () => {
    const child = vi.fn((_props: unknown) => <div data-testid="rp">x</div>)

    render(
      <DragDropCustomList ids={['only']} onDragEnd={vi.fn()}>
        <DragDropCustomItem id="only">{child}</DragDropCustomItem>
      </DragDropCustomList>,
    )

    expect(child).toHaveBeenCalled()
    const args = child.mock.calls[0]![0] as {
      attributes: Record<string, unknown>
      isDragging: boolean
      listeners: { onPointerDown?: unknown }
    }
    expect(args).toHaveProperty('attributes')
    expect(args.isDragging).toBe(false)
    expect(typeof args.listeners.onPointerDown).toBe('function')
  })

  it('starts each item in a non-dragging state', () => {
    renderList(['a', 'b'])
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-dragging', 'false')
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-dragging', 'false')
  })

  it('renders a list wrapper for an empty set of ids', () => {
    const { container } = render(
      <DragDropCustomList ids={[]} onDragEnd={vi.fn()}>
        {null}
      </DragDropCustomList>,
    )
    const list = container.querySelector('.files-draggable')
    expect(list).toBeInTheDocument()
    expect(within(list as HTMLElement).queryByTestId(/item-/)).toBeNull()
  })
})
