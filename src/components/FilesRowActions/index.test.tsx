import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { FilesRowActions } from './index'

vi.mock('@payloadcms/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'general:moveUp': 'Move Up',
        'general:moveDown': 'Move Down',
        'general:addBelow': 'Add Below',
        'general:duplicate': 'Duplicate',
        'general:copyRow': 'Copy Row',
        'general:pasteRow': 'Paste Row',
        'general:remove': 'Remove',
        'general:editLabel': 'Edit',
      }
      return map[key] ?? key
    },
  }),
}))

vi.mock('@payloadcms/ui/icons/Copy', () => ({ CopyIcon: () => <svg data-testid="copy-icon" /> }))
vi.mock('@payloadcms/ui/icons/Edit', () => ({ EditIcon: () => <svg data-testid="edit-icon" /> }))
vi.mock('@payloadcms/ui/icons/More', () => ({ MoreIcon: () => <svg data-testid="more-icon" /> }))
vi.mock('@payloadcms/ui/icons/Plus', () => ({ PlusIcon: () => <svg data-testid="plus-icon" /> }))
vi.mock('@payloadcms/ui/icons/X', () => ({ XIcon: () => <svg data-testid="x-icon" /> }))
vi.mock('../icons/Chevron', () => ({
  ChevronIcon: ({ direction }: { direction?: string }) => (
    <svg data-testid="chevron-icon" data-direction={direction ?? 'down'} />
  ),
}))

const baseProps = {
  addRow: vi.fn(),
  copyRow: vi.fn(),
  duplicateRow: vi.fn(),
  index: 1,
  isSortable: true,
  moveRow: vi.fn(),
  pasteRow: vi.fn(),
  removeRow: vi.fn(),
  rowCount: 3,
}

const setup = (overrides: Partial<React.ComponentProps<typeof FilesRowActions>> = {}) =>
  render(<FilesRowActions {...baseProps} {...overrides} />)

describe('FilesRowActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a closed three-dots trigger', () => {
    setup()
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByTestId('more-icon')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens the menu with all actions for a middle, sortable row', () => {
    setup()
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Move Up')).toBeInTheDocument()
    expect(screen.getByText('Move Down')).toBeInTheDocument()
    expect(screen.getByText('Add Below')).toBeInTheDocument()
    expect(screen.getByText('Duplicate')).toBeInTheDocument()
    expect(screen.getByText('Copy Row')).toBeInTheDocument()
    expect(screen.getByText('Paste Row')).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('hides Move Up for the first row', () => {
    setup({ index: 0 })
    fireEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('Move Up')).toBeNull()
    expect(screen.getByText('Move Down')).toBeInTheDocument()
  })

  it('hides Move Down for the last row', () => {
    setup({ index: 2, rowCount: 3 })
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Move Up')).toBeInTheDocument()
    expect(screen.queryByText('Move Down')).toBeNull()
  })

  it('hides move actions entirely when not sortable', () => {
    setup({ isSortable: false })
    fireEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('Move Up')).toBeNull()
    expect(screen.queryByText('Move Down')).toBeNull()
  })

  it('hides Add Below and Duplicate when hasMaxRows', () => {
    setup({ hasMaxRows: true })
    fireEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('Add Below')).toBeNull()
    expect(screen.queryByText('Duplicate')).toBeNull()
    // Copy / Paste / Remove are still present.
    expect(screen.getByText('Copy Row')).toBeInTheDocument()
  })

  it('calls moveRow up/down with the right indexes', () => {
    const moveRow = vi.fn()
    setup({ moveRow })
    fireEvent.click(screen.getByRole('button'))

    fireEvent.click(screen.getByText('Move Up'))
    expect(moveRow).toHaveBeenCalledWith(1, 0)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Move Down'))
    expect(moveRow).toHaveBeenCalledWith(1, 2)
  })

  it('invokes add/duplicate/copy/paste/remove callbacks', () => {
    const addRow = vi.fn()
    const duplicateRow = vi.fn()
    const copyRow = vi.fn()
    const pasteRow = vi.fn()
    const removeRow = vi.fn()
    setup({ addRow, duplicateRow, copyRow, pasteRow, removeRow })

    const open = () => fireEvent.click(screen.getByRole('button'))

    open()
    fireEvent.click(screen.getByText('Add Below'))
    expect(addRow).toHaveBeenCalledWith(2)

    open()
    fireEvent.click(screen.getByText('Duplicate'))
    expect(duplicateRow).toHaveBeenCalledWith(1)

    open()
    fireEvent.click(screen.getByText('Copy Row'))
    expect(copyRow).toHaveBeenCalledWith(1)

    open()
    fireEvent.click(screen.getByText('Paste Row'))
    expect(pasteRow).toHaveBeenCalledWith(1)

    open()
    fireEvent.click(screen.getByText('Remove'))
    expect(removeRow).toHaveBeenCalledWith(1)
  })

  it('reports open state changes via onOpenChange', () => {
    const onOpenChange = vi.fn()
    setup({ onOpenChange })

    // Called with false on mount.
    expect(onOpenChange).toHaveBeenLastCalledWith(false)

    fireEvent.click(screen.getByRole('button'))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
  })

  it('closes the menu on Escape', () => {
    setup()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('does not contain inline styles', () => {
    const { container } = setup()
    fireEvent.click(screen.getByRole('button'))
    expect(container.querySelector('[style]')).toBeNull()
  })
})
