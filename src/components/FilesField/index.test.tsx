import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { FilesField } from './index'

const mockUseField = vi.fn()
const mockDispatchFields = vi.fn()
const mockMoveFieldRow = vi.fn()
const mockSetDocFieldPreferences = vi.fn()
const mockGetFields = vi.fn(() => ({}))
const mockReplaceState = vi.fn()
const mockSetModified = vi.fn()

vi.mock('@payloadcms/ui', () => ({
  Banner: ({ children }: { children: React.ReactNode }) => <div data-testid="banner">{children}</div>,
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="add-row" onClick={onClick} type="button">
      {children}
    </button>
  ),
  ErrorPill: ({ count }: { count: number }) => <span data-testid="error-pill">{count}</span>,
  FieldDescription: ({ description }: { description?: string }) => <p>{description}</p>,
  FieldError: () => <div data-testid="field-error" />,
  FieldLabel: ({ label }: { label?: string }) => <span data-testid="field-label">{label}</span>,
  NullifyLocaleField: () => null,
  RenderCustomComponent: ({ Fallback }: { Fallback: React.ReactNode }) => <>{Fallback}</>,
  useConfig: () => ({ config: { localization: false } }),
  useDocumentInfo: () => ({ setDocFieldPreferences: mockSetDocFieldPreferences }),
  useField: (args: unknown) => mockUseField(args),
  useForm: () => ({
    addFieldRow: vi.fn(),
    dispatchFields: mockDispatchFields,
    getFields: mockGetFields,
    moveFieldRow: mockMoveFieldRow,
    removeFieldRow: vi.fn(),
    replaceState: mockReplaceState,
    setModified: mockSetModified,
  }),
  useFormSubmitted: () => true,
  useLocale: () => ({ code: 'en' }),
  useTranslation: () => ({ i18n: {}, t: (key: string) => key }),
}))

vi.mock('@payloadcms/ui/utilities/scrollToID', () => ({ scrollToID: vi.fn() }))
vi.mock('@payloadcms/translations', () => ({
  getTranslation: (label: unknown) => (typeof label === 'string' ? label : 'Files'),
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

// Render rows shallowly so the test focuses on FilesField behaviour.
vi.mock('../FilesRow', () => ({
  FilesRow: ({ rowIndex }: { rowIndex: number }) => (
    <div data-testid={`files-row-${rowIndex}`}>row {rowIndex}</div>
  ),
}))
vi.mock('../FilesFieldActions', () => ({
  FilesFieldActions: () => <div data-testid="field-actions" />,
}))
vi.mock('../DragDropCustom', () => ({
  DragDropCustomList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-list">{children}</div>
  ),
  DragDropCustomItem: ({
    children,
  }: {
    children: (p: {
      attributes: object
      isDragging: boolean
      listeners: object
    }) => React.ReactNode
  }) => <>{children({ attributes: {}, isDragging: false, listeners: {} })}</>,
}))

const baseProps = {
  field: {
    name: 'files',
    label: 'Files',
    fields: [],
    required: true,
    admin: { isSortable: true },
  },
  path: 'files',
  permissions: {},
  readOnly: false,
  schemaPath: 'files',
} as unknown as React.ComponentProps<typeof FilesField>

const setField = (overrides: Record<string, unknown> = {}) => {
  mockUseField.mockReturnValue({
    customComponents: {},
    disabled: false,
    errorPaths: [],
    path: 'files',
    rows: [{ id: 'r0' }, { id: 'r1' }],
    showError: false,
    valid: true,
    value: 2,
    ...overrides,
  })
}

describe('FilesField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setField()
  })

  it('renders the field label and a row per value', () => {
    render(<FilesField {...baseProps} />)
    expect(screen.getByTestId('field-label')).toHaveTextContent('Files')
    expect(screen.getByTestId('files-row-0')).toBeInTheDocument()
    expect(screen.getByTestId('files-row-1')).toBeInTheDocument()
  })

  it('renders Collapse All / Show All header actions when rows exist', () => {
    render(<FilesField {...baseProps} />)
    expect(screen.getByText('fields:collapseAll')).toBeInTheDocument()
    expect(screen.getByText('fields:showAll')).toBeInTheDocument()
  })

  it('renders the whole-field actions (copy/paste) menu', () => {
    render(<FilesField {...baseProps} />)
    expect(screen.getByTestId('field-actions')).toBeInTheDocument()
  })

  it('dispatches collapse-all when Collapse All is clicked', () => {
    render(<FilesField {...baseProps} />)
    fireEvent.click(screen.getByText('fields:collapseAll'))
    expect(mockDispatchFields).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_ALL_ROWS_COLLAPSED', path: 'files' }),
    )
  })

  it('dispatches show-all when Show All is clicked', () => {
    render(<FilesField {...baseProps} />)
    fireEvent.click(screen.getByText('fields:showAll'))
    expect(mockSetDocFieldPreferences).toHaveBeenCalledWith('files', { collapsed: [] })
  })

  it('renders the add-row button when not at max rows', () => {
    render(<FilesField {...baseProps} />)
    expect(screen.getByTestId('add-row')).toBeInTheDocument()
  })

  it('hides header actions when there are no rows', () => {
    setField({ rows: [], value: 0 })
    render(<FilesField {...baseProps} />)
    expect(screen.queryByText('fields:collapseAll')).toBeNull()
  })

  it('renders a field error when showError is set', () => {
    setField({ showError: true })
    render(<FilesField {...baseProps} />)
    expect(screen.getByTestId('field-error')).toBeInTheDocument()
  })

  it('does not contain inline styles', () => {
    const { container } = render(<FilesField {...baseProps} />)
    expect(container.querySelector('[style]')).toBeNull()
  })
})
