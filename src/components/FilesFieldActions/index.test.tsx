import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { FilesFieldActions } from './index'

vi.mock('@payloadcms/ui', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'general:copyField': 'Copy Field',
        'general:pasteField': 'Paste Field',
        'general:editLabel': 'Edit',
      }
      return map[key] ?? key
    },
  }),
}))

vi.mock('@payloadcms/ui/icons/Copy', () => ({ CopyIcon: () => <svg data-testid="copy-icon" /> }))
vi.mock('@payloadcms/ui/icons/Edit', () => ({ EditIcon: () => <svg data-testid="edit-icon" /> }))
vi.mock('@payloadcms/ui/icons/More', () => ({ MoreIcon: () => <svg data-testid="more-icon" /> }))

const setup = (overrides: Partial<React.ComponentProps<typeof FilesFieldActions>> = {}) => {
  const copyField = vi.fn()
  const pasteField = vi.fn()
  const utils = render(
    <FilesFieldActions
      copyField={copyField}
      pasteField={pasteField}
      {...overrides}
    />,
  )
  return { copyField, pasteField, ...utils }
}

describe('FilesFieldActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a closed three-dots trigger by default', () => {
    setup()
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(screen.getByTestId('more-icon')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens the popup with Copy Field and Paste Field options', () => {
    setup()
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Copy Field')).toBeInTheDocument()
    expect(screen.getByText('Paste Field')).toBeInTheDocument()
  })

  it('calls copyField and closes the popup', () => {
    const { copyField } = setup()
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Copy Field'))

    expect(copyField).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('calls pasteField and closes the popup', () => {
    const { pasteField } = setup()
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Paste Field'))

    expect(pasteField).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('disables the copy option when allowCopy is false', () => {
    setup({ allowCopy: false })
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Copy Field').closest('button')).toBeDisabled()
  })

  it('disables the paste option when allowPaste is false', () => {
    setup({ allowPaste: false })
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Paste Field').closest('button')).toBeDisabled()
  })

  it('renders nothing when both copy and paste are disallowed', () => {
    const { container } = setup({ allowCopy: false, allowPaste: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('closes the popup on Escape', () => {
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
