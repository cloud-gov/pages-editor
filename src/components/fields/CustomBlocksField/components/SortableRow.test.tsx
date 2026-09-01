import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SortableRow, SortableRowProps } from './SortableRow'

const rowProps: SortableRowProps = {
  label: '',
  id: '',
  index: 2,
  subtitle: '',
  canDrag: true,
  draggingId: '',
  dragOverId: '',
  isExpanded: false,
  onDragOver: vi.fn(),
  onToggle: vi.fn(),
  onRemove: vi.fn(),
  onDragStart: vi.fn(),
  onDragEnd: vi.fn(),
  onDrop: vi.fn()
}
const { rerender } = render(
  <SortableRow {...rowProps}>
    <input aria-label="Title" />
  </SortableRow>,
)

describe('SortableRow', () => {
  it('focuses the first input when expanded', () => {

    rerender(
      <SortableRow {...rowProps} isExpanded>
        <input aria-label="Title" />
      </SortableRow>,
    )

    expect(screen.getByLabelText('Title')).toHaveFocus()
  })

  it('does not focus when initially rendered expanded', () => {
    render(
      <SortableRow {...rowProps} isExpanded>
        <input aria-label="Title" />
      </SortableRow>,
    )

    expect(screen.getByLabelText('Title')).not.toHaveFocus()
  })
})
