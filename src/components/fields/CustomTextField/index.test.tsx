import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CustomTextField } from './index'
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
  path: 'title',
  field: {
    name: 'title',
    label: 'Title',
    required: true,
    admin: {
      description: 'Provide a title for this content.',
    },
  },
}

describe('CustomTextField', () => {
  beforeEach(() => {
    resetPayloadMocks()
  })

  it('renders label, required marker, description, and text input', () => {
    render(<CustomTextField {...defaultProps} />)

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(
      screen.getByText('Provide a title for this content.')
    ).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'field-title')
    expect(input).toHaveClass('usa-input')
    expect(input).toHaveValue('')
  })

  it('renders the current field value', () => {
    resetPayloadMocks({ value: 'Initial value' })

    render(<CustomTextField {...defaultProps} />)

    expect(screen.getByRole('textbox')).toHaveValue('Initial value')
  })

  it('updates the value when the user types', async () => {
    render(<CustomTextField {...defaultProps} />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello')

    expect(mockSetValue).toHaveBeenCalled()
    expect(mockSetValue).toHaveBeenLastCalledWith('o')
  })

  it('renders validation error state from useField', () => {
    resetPayloadMocks({
      value: '',
      showError: true,
      errorMessage: 'This field is required.',
    })

    render(<CustomTextField {...defaultProps} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'This field is required.'
    )
  })

  it('does not contain inline styles', () => {
    const { container } = render(<CustomTextField {...defaultProps} />)

    expect(container.querySelector('[style]')).toBeNull()
  })
})
