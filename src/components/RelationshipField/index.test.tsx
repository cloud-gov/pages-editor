import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/react'
import { RelationshipField } from './index'
import { resetPayloadMocks, mockSetValue } from './testmocks'

vi.mock('@payloadcms/ui', async () => {
  const mod = await import('./testmocks')
  return {
    useField: mod.mockUseField,
    useConfig: mod.mockUseConfig,
    useLocale: mod.mockUseLocale,
    useAuth: mod.mockUseAuth,
  }
})

vi.mock('payload/shared', () => ({
  formatAdminURL: ({ apiRoute, path }: { apiRoute: string; path: string }) =>
    `${apiRoute}${path}`,
}))

vi.mock('qs-esm', () => ({
  stringify: (value: unknown) => JSON.stringify(value),
}))

function createFetchJsonResponse(data: unknown) {
  return Promise.resolve({
    ok: true,
    json: async () => data,
  } as Response)
}

function mockFetchSequence(...responses: unknown[]) {
  const fetchMock = vi.fn()
  for (const response of responses) {
    fetchMock.mockImplementationOnce(() => createFetchJsonResponse(response))
  }
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const defaultProps = {
  path: 'tags',
  label: 'Tags',
  field: {
    relationTo: 'tags',
    hasMany: true,
    required: true,
    label: 'Tags',
    admin: {
      description: 'Tags used to organize content',
      custom: {
        labelField: 'title',
        createTitleField: 'title',
        createLabel: 'Create new',
        minChars: 2,
        maxResults: 10,
      },
    },
  },
}

describe('RelationshipField', () => {
  beforeEach(() => {
    resetPayloadMocks()
  })

  it('renders label, required marker, description, and combobox', async () => {
    mockFetchSequence({ docs: [] }) // initial hydration fetch

    render(<RelationshipField {...defaultProps} />)

    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('Tags used to organize content')).toBeInTheDocument()

    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-haspopup', 'listbox')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('hydrates selected IDs into chips', async () => {
    resetPayloadMocks({ value: [2] })

    mockFetchSequence({
      docs: [{ id: 2, title: 'Alpha' }],
    })

    render(<RelationshipField {...defaultProps} />)

    expect(await screen.findByText('Alpha')).toBeInTheDocument()
    expect(screen.getByLabelText('Edit Alpha')).toBeInTheDocument()
    expect(screen.getByLabelText('Remove Alpha')).toBeInTheDocument()
  })

  it('does not contain inline styles', () => {
    const { container } = render(<RelationshipField {...defaultProps} />)

    expect(container.querySelector('[style]')).toBeNull();
  })

  it('loads unselected tags when activated and excludes selected items', async () => {
    resetPayloadMocks({ value: [2] })

    // 1) hydrate selected chip
    // 2) load default options on focus
    mockFetchSequence(
      { docs: [{ id: 2, title: 'Alpha' }] },
      {
        docs: [
          { id: 1, title: 'Beta' },
          { id: 3, title: 'Gamma' },
        ],
      },
    )

    render(<RelationshipField {...defaultProps} />)

    const input = await screen.findByRole('combobox')
    await userEvent.click(input)

    const listbox = await screen.findByRole('listbox')
    expect(within(listbox).queryByText('Alpha')).not.toBeInTheDocument()
    expect(within(listbox).getByText('Beta')).toBeInTheDocument()
    expect(within(listbox).getByText('Gamma')).toBeInTheDocument()
  })

  it('searches asynchronously when minChars is reached', async () => {
    mockFetchSequence(
      { docs: [] }, // initial hydration
      {
        docs: [
          { id: 11, title: 'React' },
          { id: 12, title: 'React Testing Library' },
        ],
      }, // search fetch
    )

    render(<RelationshipField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'rea')

    const listbox = await screen.findByRole('listbox')
    expect(within(listbox).getByText('React')).toBeInTheDocument()
    expect(within(listbox).getByText('React Testing Library')).toBeInTheDocument()

    expect(global.fetch).toHaveBeenCalled()
  })

  it('selects a tag from the dropdown and writes updated IDs', async () => {
    mockFetchSequence(
      { docs: [] }, // hydrate
      {
        docs: [
          { id: 7, title: 'Accessibility' },
          { id: 8, title: 'Testing' },
        ],
      }, // default options
    )

    render(<RelationshipField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)

    await userEvent.click(await screen.findByText('Accessibility'))

    expect(await screen.findByText('Accessibility')).toBeInTheDocument()
    expect(mockSetValue).toHaveBeenCalledWith([7])
    expect(input).toHaveValue('')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('removes a selected tag and updates field value', async () => {
    resetPayloadMocks({ value: [2] })

    mockFetchSequence({
      docs: [{ id: 2, title: 'Alpha' }],
    })

    render(<RelationshipField {...defaultProps} />)

    await screen.findByText('Alpha')
    await userEvent.click(screen.getByLabelText('Remove Alpha'))

    expect(mockSetValue).toHaveBeenCalledWith([])
    await waitFor(() => {
      expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    })
  })

  it('supports keyboard navigation: ArrowDown + Enter selects active option', async () => {
    mockFetchSequence(
      { docs: [] },
      {
        docs: [
          { id: 21, title: 'First' },
          { id: 22, title: 'Second' },
        ],
      },
    )

    render(<RelationshipField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)

    const listbox = await screen.findByRole('listbox')
    expect(within(listbox).getByText('First')).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')

    expect(mockSetValue).toHaveBeenCalledWith([22])
    expect(await screen.findByText('Second')).toBeInTheDocument()
  })

  it('supports Escape to close the dropdown', async () => {
    mockFetchSequence(
      { docs: [] },
      {
        docs: [{ id: 31, title: 'Escape Tag' }],
      },
    )

    render(<RelationshipField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)

    expect(await screen.findByRole('listbox')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens create modal and validates empty title', async () => {
    mockFetchSequence({ docs: [] })

    render(<RelationshipField {...defaultProps} />)

    await userEvent.click(screen.getByLabelText('Add new Tag'))

    expect(await screen.findByText('Create new Tag')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
  })

  it('creates a new tag and selects it', async () => {
    mockFetchSequence(
      { docs: [] }, // hydrate
      { id: 50, title: 'New Tag' }, // create POST
    )

    render(<RelationshipField {...defaultProps} />)

    await userEvent.click(screen.getByLabelText('Add new Tag'))

    const titleInput = await screen.findByLabelText('Title*')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'New Tag')

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('New Tag')).toBeInTheDocument()
    expect(mockSetValue).toHaveBeenCalledWith([50])
  })

  it('opens edit modal and saves updated chip label', async () => {
    resetPayloadMocks({ value: [2] })

    mockFetchSequence(
      { docs: [{ id: 2, title: 'Alpha' }] }, // hydrate selected
      { id: 2, title: 'Alpha Updated' }, // PATCH edit
    )

    render(<RelationshipField {...defaultProps} />)

    expect(await screen.findByText('Alpha')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Edit Alpha'))

    const titleInput = await screen.findByLabelText('Title*')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Alpha Updated')

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Alpha Updated')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('renders validation error state from useField', async () => {
    resetPayloadMocks({
      value: [],
      showError: true,
      errorMessage: 'This field is required.',
    })

    mockFetchSequence({ docs: [] })

    render(<RelationshipField {...defaultProps} />)

    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.')

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
