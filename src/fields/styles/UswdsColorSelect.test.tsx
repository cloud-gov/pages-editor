import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UswdsColorSelect } from './UswdsColorSelect'

const mockUseField = vi.fn()

vi.mock('@payloadcms/ui', () => ({
  useField: (...args: unknown[]) => mockUseField(...args),
  FieldLabel: ({ label }: { label: React.ReactNode }) => (
    <label>{label}</label>
  ),
}))

const defaultProps = {
  field: {
    name: 'color',
    label: 'Color',
  },
  path: 'color',
}

describe('UswdsColorSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseField.mockReturnValue({
      value: null,
      setValue: vi.fn(),
    })
  })

  it('renders placeholder text when no color is selected', () => {
    render(<UswdsColorSelect {...defaultProps} />)

    expect(
      screen.getByText('Select a color'),
    ).toBeInTheDocument()
  })

  it('renders token name and hex value for a selected color', () => {
    mockUseField.mockReturnValue({
      value: '#f8eff1',
      setValue: vi.fn(),
    })

    render(<UswdsColorSelect {...defaultProps} />)

    expect(
      screen.getByText('red-cool-5'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('#f8eff1'),
    ).toBeInTheDocument()
  })

  it('renders swatch class and does not use inline styling', () => {
    mockUseField.mockReturnValue({
      value: '#f8eff1',
      setValue: vi.fn(),
    })

    const { container } = render(
      <UswdsColorSelect {...defaultProps} />,
    )

    const swatch = container.querySelector(
      '.uswds-color-select__swatch',
    )

    expect(swatch).toBeInTheDocument()

    expect(swatch).toHaveClass('bg-red-cool-5')

    expect(swatch).not.toHaveAttribute('style')
  })

  it('opens the picker when trigger is clicked', () => {
    render(<UswdsColorSelect {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    expect(
      screen.getByPlaceholderText(
        'Search USWDS tokens...',
      ),
    ).toBeInTheDocument()
  })

  it('filters color options by search text', () => {
    render(<UswdsColorSelect {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    fireEvent.change(
      screen.getByPlaceholderText(
        'Search USWDS tokens...',
      ),
      {
        target: {
          value: 'red-cool',
        },
      },
    )

    expect(
      screen.getByText('red-cool-5'),
    ).toBeInTheDocument()

    expect(
      screen.queryByText('blue-50'),
    ).not.toBeInTheDocument()
  })

  it('selects a color and updates the field value', () => {
    const setValue = vi.fn()

    mockUseField.mockReturnValue({
      value: null,
      setValue,
    })

    render(<UswdsColorSelect {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    fireEvent.click(screen.getAllByRole('option')[0])

    expect(setValue).toHaveBeenCalledTimes(1)
    expect(setValue).toHaveBeenCalledWith('#ffffff')
  })

  it('clears the selected color', () => {
    const setValue = vi.fn()

    mockUseField.mockReturnValue({
      value: '#f8eff1',
      setValue,
    })

    render(<UswdsColorSelect {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Clear',
      }),
    )

    expect(setValue).toHaveBeenCalledWith(null)
  })

  it('shows empty state when search has no matches', () => {
    render(<UswdsColorSelect {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    fireEvent.change(
      screen.getByPlaceholderText(
        'Search USWDS tokens...',
      ),
      {
        target: {
          value: 'this-does-not-exist',
        },
      },
    )

    expect(
      screen.getByText('No matching tokens'),
    ).toBeInTheDocument()
  })

  it('does not open when readOnly', () => {
    render(
      <UswdsColorSelect
        {...defaultProps}
        readOnly
      />,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(
      screen.queryByPlaceholderText(
        'Search USWDS tokens...',
      ),
    ).not.toBeInTheDocument()
  })
})
