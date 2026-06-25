import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { FilesRow } from './index'

vi.mock('@payloadcms/ui', () => ({
  ErrorPill: ({ count }: { count: number }) => <span data-testid="error-pill">{count}</span>,
  RenderFields: () => <div data-testid="render-fields" />,
  useFormSubmitted: () => true,
  useTranslation: () => ({ i18n: {}, t: (key: string) => key }),
}))

vi.mock('@payloadcms/ui/hooks/useThrottledValue', () => ({
  useThrottledValue: (v: unknown) => v,
}))

vi.mock('@payloadcms/ui/icons/DragHandle', () => ({
  DragHandleIcon: () => <svg data-testid="drag-handle" />,
}))

vi.mock('@payloadcms/translations', () => ({
  getTranslation: (label: unknown) => (typeof label === 'string' ? label : 'File'),
}))

vi.mock('../icons/Chevron', () => ({
  ChevronIcon: ({ direction }: { direction?: string }) => (
    <svg data-testid="chevron-icon" data-direction={direction ?? 'down'} />
  ),
}))

vi.mock('../FilesRowActions', () => ({
  FilesRowActions: ({ onOpenChange }: { onOpenChange?: (o: boolean) => void }) => (
    <button data-testid="row-actions" onClick={() => onOpenChange?.(true)} type="button">
      actions
    </button>
  ),
}))

const baseProps = {
  addRow: vi.fn(),
  attributes: {},
  copyRow: vi.fn(),
  duplicateRow: vi.fn(),
  isSortable: true,
  labels: { singular: 'File' },
  listeners: { onPointerDown: vi.fn() },
  moveRow: vi.fn(),
  parentPath: 'files',
  path: 'files.1',
  pasteRow: vi.fn(),
  permissions: {},
  removeRow: vi.fn(),
  row: { collapsed: false, id: 'row-1' },
  rowCount: 3,
  rowIndex: 1,
  scrollIdPrefix: 'scroll-1',
  setCollapse: vi.fn(),
}

const setup = (overrides: Partial<React.ComponentProps<typeof FilesRow>> = {}) =>
  render(<FilesRow {...baseProps} {...overrides} />)

describe('FilesRow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the row label padded with the 1-based index', () => {
    setup({ rowIndex: 0 })
    expect(screen.getByText('File 01')).toBeInTheDocument()
  })

  it('renders the drag handle when sortable', () => {
    setup({ isSortable: true })
    expect(screen.getByTestId('drag-handle')).toBeInTheDocument()
  })

  it('hides the drag handle when not sortable', () => {
    setup({ isSortable: false })
    expect(screen.queryByTestId('drag-handle')).toBeNull()
  })

  it('renders RenderFields when not loading', () => {
    setup({ isLoading: false })
    expect(screen.getByTestId('render-fields')).toBeInTheDocument()
  })

  it('shows a shimmer placeholder when loading', () => {
    const { container } = setup({ isLoading: true })
    expect(container.querySelector('.files-field__fields-shimmer')).toBeInTheDocument()
    expect(screen.queryByTestId('render-fields')).toBeNull()
  })

  it('toggles collapse when the indicator button is clicked', () => {
    const setCollapse = vi.fn()
    setup({ setCollapse, row: { collapsed: false, id: 'row-1' } })

    const buttons = screen.getAllByRole('button')
    // the collapse indicator is the last button (chevron); the hidden toggle
    // overlay also calls setCollapse.
    fireEvent.click(buttons[buttons.length - 1])
    expect(setCollapse).toHaveBeenCalledWith('row-1', true)
  })

  it('renders the FilesRowActions when not read-only', () => {
    setup({ readOnly: false })
    expect(screen.getByTestId('row-actions')).toBeInTheDocument()
  })

  it('hides FilesRowActions when read-only', () => {
    setup({ readOnly: true })
    expect(screen.queryByTestId('row-actions')).toBeNull()
  })

  it('applies the popup-open class when the actions menu opens', () => {
    const { container } = setup()
    fireEvent.click(screen.getByTestId('row-actions'))
    expect(container.querySelector('.files-field__row--popup-open')).toBeInTheDocument()
  })

  it('shows an error pill when the row has errors and the form was submitted', () => {
    setup({ errorCount: 2 })
    expect(screen.getByTestId('error-pill')).toHaveTextContent('2')
  })

  it('marks the row dragging via class when isDragging is true', () => {
    const { container } = setup({ isDragging: true })
    expect(container.querySelector('.files-field__row--is-dragging')).toBeInTheDocument()
  })

  it('does not contain inline styles', () => {
    const { container } = setup()
    expect(container.querySelector('[style]')).toBeNull()
  })
})
