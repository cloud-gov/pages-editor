import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import { FileUploadField } from './index'

const mockSetValue = vi.fn()
const mockUseField = vi.fn()

vi.mock('@payloadcms/ui', () => ({
  useConfig: () => ({
    config: { routes: { api: '/api' }, serverURL: 'http://localhost' },
  }),
  useField: (args: unknown) => mockUseField(args),
  // Render a representative thumbnail so the sanitizer has something to act on.
  UploadInput: ({ value }: { value?: unknown }) => (
    <div className="upload-field-card">
      <div className="thumbnail">
        <svg viewBox="0 0 150 150" style={{ backgroundColor: '#333' }} data-testid="placeholder">
          <path d="M0 0" />
        </svg>
      </div>
      <span data-testid="upload-value">{JSON.stringify(value ?? null)}</span>
    </div>
  ),
}))

const baseProps = {
  field: {
    name: 'file',
    label: 'File',
    relationTo: 'media',
    required: true,
    admin: {},
  },
  path: 'file',
  readOnly: false,
} as unknown as React.ComponentProps<typeof FileUploadField>

const baseField = baseProps.field as Record<string, unknown>

const setField = (overrides: Record<string, unknown> = {}) => {
  mockUseField.mockReturnValue({
    customComponents: {},
    disabled: false,
    filterOptions: undefined,
    path: 'file',
    setValue: mockSetValue,
    showError: false,
    value: 'media-id',
    ...overrides,
  })
}

describe('FileUploadField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setField()
  })

  it('renders Payload UploadInput', () => {
    render(<FileUploadField {...baseProps} />)
    expect(screen.getByTestId('upload-value')).toBeInTheDocument()
  })

  it('strips the inline style from the placeholder svg and tags it', async () => {
    render(<FileUploadField {...baseProps} />)

    const svg = screen.getByTestId('placeholder')
    await waitFor(() => {
      expect(svg.hasAttribute('style')).toBe(false)
    })
    expect(svg).toHaveAttribute('data-file-placeholder', 'true')
  })

  it('passes the raw value through for single (non-hasMany) uploads', () => {
    setField({ value: 'media-id' })
    render(<FileUploadField {...baseProps} />)
    expect(screen.getByTestId('upload-value')).toHaveTextContent('"media-id"')
  })

  it('maps hasMany values into relationTo/value objects', () => {
    setField({ value: ['a', 'b'] })
    render(
      <FileUploadField
        {...baseProps}
        field={{ ...baseField, hasMany: true } as never}
      />,
    )
    const text = screen.getByTestId('upload-value').textContent ?? ''
    expect(text).toContain('"relationTo":"media"')
    expect(text).toContain('"value":"a"')
    expect(text).toContain('"value":"b"')
  })

  it('does not contain inline styles after sanitization', async () => {
    const { container } = render(<FileUploadField {...baseProps} />)
    await waitFor(() => {
      expect(container.querySelector('[style]')).toBeNull()
    })
  })
})
