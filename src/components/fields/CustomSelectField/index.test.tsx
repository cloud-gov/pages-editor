import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomSelectField } from './index'
import { resetPayloadMocks, mockSetValue } from '../mocks/testmocks'

// Mock Payload hooks
vi.mock('@payloadcms/ui', async () => {
  const mod = await import('../mocks/testmocks')
  return {
    useField: mod.mockUseField,
  }
})

// Mock resolveStaticText utility
vi.mock('@/components/utilities', () => ({
  resolveStaticText: (value: unknown, fallback?: string) =>
    typeof value === 'string' ? value : fallback,
}))

const defaultProps = {
  path: 'amountCards',
  field: {
    name: 'amountCards',
    label: 'Amount of Cards Per Row',
    required: true,
    admin: {
      description: 'Choose how many cards appear per row.',
    },
    options: [
      { label: 'Three', value: '3' },
      { label: 'Two', value: '2' },
      { label: 'One', value: '1' },
    ],
  },
}

describe('CustomSelectField', () => {
  beforeEach(() => {
    resetPayloadMocks()
  })

  it('renders label, required marker, description, and the combobox', () => {
    render(<CustomSelectField {...defaultProps} />)

    expect(screen.getByText('Amount of Cards Per Row')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(
      screen.getByText('Choose how many cards appear per row.')
    ).toBeInTheDocument()

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('id', 'field-amountCards')
    expect(input).toHaveClass('rs__input')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the placeholder when there is no value', () => {
    render(<CustomSelectField {...defaultProps} />)

    expect(screen.getByText('Select a value')).toBeInTheDocument()
  })

  it('renders the current field value as the selected label', () => {
    resetPayloadMocks({ value: '2' })

    render(<CustomSelectField {...defaultProps} />)

    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('opens the options menu on focus and lists all options', async () => {
    render(<CustomSelectField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)

    expect(input).toHaveAttribute('aria-expanded', 'true')

    const listbox = screen.getByRole('listbox')
    const options = within(listbox).getAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options.map((o) => o.textContent)).toEqual(['Three', 'Two', 'One'])
  })

  it('filters options as the user types', async () => {
    render(<CustomSelectField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'tw')

    const options = within(screen.getByRole('listbox')).getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Two')
  })

  it('filters case-insensitively and shows a no-options notice when nothing matches', async () => {
    render(<CustomSelectField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'zzz')

    expect(within(screen.getByRole('listbox')).queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('No options')).toBeInTheDocument()
  })

  it('selects a filtered option with Enter', async () => {
    render(<CustomSelectField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'one')
    await userEvent.keyboard('{Enter}')

    expect(mockSetValue).toHaveBeenLastCalledWith('1')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('updates the value when an option is clicked', async () => {
    render(<CustomSelectField {...defaultProps} />)

    await userEvent.click(screen.getByRole('combobox'))
    await userEvent.click(screen.getByRole('option', { name: 'One' }))

    expect(mockSetValue).toHaveBeenCalledWith('1')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('supports keyboard selection with arrows and Enter', async () => {
    render(<CustomSelectField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input) // open, active index 0 ('Three')

    await userEvent.keyboard('{ArrowDown}') // active index 1 ('Two')
    await userEvent.keyboard('{Enter}')

    expect(mockSetValue).toHaveBeenLastCalledWith('2')
  })

  it('marks the selected option with aria-selected', async () => {
    resetPayloadMocks({ value: '2' })

    render(<CustomSelectField {...defaultProps} />)

    await userEvent.click(screen.getByRole('combobox'))

    const selected = screen.getByRole('option', { selected: true })
    expect(selected).toHaveTextContent('Two')
    expect(selected).toHaveClass('rs__option--is-selected')
  })

  it('shows a clear button only when a value is selected and clears it to null', async () => {
    const { rerender } = render(<CustomSelectField {...defaultProps} />)

    // No value -> no clear button
    expect(
      screen.queryByRole('button', { name: 'Clear value' })
    ).not.toBeInTheDocument()

    // With a value -> clear button appears
    resetPayloadMocks({ value: '2' })
    rerender(<CustomSelectField {...defaultProps} />)

    const clearButton = screen.getByRole('button', { name: 'Clear value' })
    expect(clearButton).toBeInTheDocument()

    await userEvent.click(clearButton)

    expect(mockSetValue).toHaveBeenLastCalledWith(null)
  })

  it('renders validation error state from useField', () => {
    resetPayloadMocks({
      value: '',
      showError: true,
      errorMessage: 'This field is required.',
    })

    render(<CustomSelectField {...defaultProps} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'This field is required.'
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not contain inline styles', () => {
    const { container } = render(<CustomSelectField {...defaultProps} />)

    expect(container.querySelector('[style]')).toBeNull()
  })
})
