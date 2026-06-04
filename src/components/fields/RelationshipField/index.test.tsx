import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RelationshipField } from './index'
import {
  resetPayloadMocks,
  mockSetValue,
} from '../mocks/testmocks'
import { createFetchResponse, getHeader, mockRelationshipFieldCreateFetch, mockRelationshipFieldEditFetch, mockRelationshipFieldSearchFetch } from '../mocks/fetchmocks'

vi.mock('@payloadcms/ui', async () => {
  const mod = await import('../mocks/testmocks')
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

/**
* Mock the modal so this remains a true unit test of RelationshipField behavior:
* - field rendering comes from `custom.modalFields`
* - submit invokes RelationshipField's own validation + submit handlers
*/
vi.mock('../../Modal', () => ({
  Modal: (props: {
    isOpen: boolean
    mode: 'create' | 'edit'
    fields: Array<{
      name: string
      label: string
      type: 'text' | 'textarea' | 'checkbox' | 'radio'
      required?: boolean
    }>
    values: Record<string, unknown>
    onChange: (name: string, value: unknown) => void
    onSubmit: () => void
    onClose: () => void
  }) => {
    if (!props.isOpen) return null

    return (
      <div role="dialog" aria-label={props.mode === 'edit' ? 'Edit Tag' : 'Create Tag'}>
        {props.fields.map((field) => {
          const label = `${field.label}${field.required ? '*' : ''}`
          const value = props.values?.[field.name]

          if (field.type === 'textarea') {
            return (
              <label key={field.name}>
                {label}
                <textarea
                  aria-label={label}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(e) => props.onChange(field.name, e.target.value)}
                />
              </label>
            )
          }

          if (field.type === 'checkbox') {
            return (
              <label key={field.name}>
                {label}
                <input
                  aria-label={label}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => props.onChange(field.name, e.target.checked)}
                />
              </label>
            )
          }

          return (
            <label key={field.name}>
              {label}
              <input
                aria-label={label}
                type="text"
                value={typeof value === 'string' ? value : ''}
                onChange={(e) => props.onChange(field.name, e.target.value)}
              />
            </label>
          )
        })}

        <button type="button" onClick={props.onSubmit}>
          {props.mode === 'edit' ? 'Save' : 'Create'}
        </button>
        <button type="button" onClick={props.onClose}>
          Close
        </button>
      </div>
    )
  },
}))

function mockFetchSequence(...responses: unknown[]) {
  const fetchMock = vi.fn()

  for (const response of responses) {
    fetchMock.mockImplementationOnce(() => createFetchResponse(response))
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
      position: 'sidebar',
      description: 'Select one or more tags to associate with this content',
      custom: {
        singularLabel: 'Tag',
        pluralLabel: 'Tags',
        labelField: 'title',
        createTitleField: 'title',
        createLabel: 'Create new Tag',
        createModalDescription:
          'Tags are used to organize and filter content across the site.',
        placeholder: 'Select one or more tags',
        minChars: 2,
        maxResults: 10,
        allowInlineEdit: true,
        allowCreate: true,
        siteScoped: true,
        modalFields: [
          {
            name: 'title',
            label: 'Title',
            type: 'text' as const,
            required: true,
          },
          {
            name: 'description',
            label: 'Description',
            type: 'text' as const,
            required: false,
          },
        ],
      },
    },
  },
}

describe('RelationshipField', () => {
  beforeEach(() => {
    resetPayloadMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders label, required marker, description, and combobox', async () => {
    render(<RelationshipField {...defaultProps} />)

    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(
      screen.getByText('Select one or more tags to associate with this content'),
    ).toBeInTheDocument()

    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-haspopup', 'listbox')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveAttribute('placeholder', 'Select one or more tags')
  })

  it('hydrates selected IDs into chips with edit and remove controls', async () => {
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
    expect(container.querySelector('[style]')).toBeNull()
  })

  it('loads unselected tags when activated and excludes selected items', async () => {
    resetPayloadMocks({ value: [2] })

    mockFetchSequence(
      { docs: [{ id: 2, title: 'Alpha' }] }, // selected chip hydration
      {
        docs: [
          { id: 1, title: 'Beta' },
          { id: 3, title: 'Gamma' },
        ],
      }, // default options
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
    mockRelationshipFieldSearchFetch()

    render(<RelationshipField {...defaultProps} />)

    const input = screen.getByRole('combobox')

    await userEvent.click(input)
    await userEvent.type(input, 're')

    const listbox = await screen.findByRole('listbox')

    expect(within(listbox).getByText('React')).toBeInTheDocument()
    expect(
      within(listbox).getByText('React Testing Library')
    ).toBeInTheDocument()
  })

  it('selects a tag from the dropdown and writes updated IDs', async () => {
    mockFetchSequence({
      docs: [
        { id: 7, title: 'Accessibility' },
        { id: 8, title: 'Testing' },
      ],
    })

    render(<RelationshipField {...defaultProps} />)

    const input = screen.getByRole('combobox')
    await userEvent.click(input)

    await userEvent.click(await screen.findByText('Accessibility'))

    expect(await screen.findByText('Accessibility')).toBeInTheDocument()
    expect(mockSetValue).toHaveBeenCalledWith([7])
    expect(input).toHaveValue('')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
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

  it('supports keyboard navigation: ArrowDown + Enter selects the active option', async () => {
    mockFetchSequence({
      docs: [
        { id: 21, title: 'First' },
        { id: 22, title: 'Second' },
      ],
    })

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
    mockFetchSequence({
      docs: [{ id: 31, title: 'Escape Tag' }],
    })

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

  it('opens create modal, renders configured modal fields and validates empty required title', async () => {
    render(<RelationshipField {...defaultProps} />)

    await userEvent.click(screen.getByLabelText('Create new Tag'))

    // createModalDescription is rendered when the modal is open
    expect(
      await screen.findByText(
        'Tags are used to organize and filter content across the site.',
      ),
    ).toBeInTheDocument()

    expect(await screen.findByLabelText(/Title/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
  })

  it('creates a new tag from configured modal fields, selects it, and includes selected site id', async () => {
    const fetchMock = mockRelationshipFieldCreateFetch()

    render(<RelationshipField {...defaultProps} />)

    await userEvent.click(screen.getByLabelText('Create new Tag'))

    expect(
      await screen.findByText(
        'Tags are used to organize and filter content across the site.',
      ),
    ).toBeInTheDocument()

    const titleInput = await screen.findByLabelText(/Title/)
    const descriptionInput = screen.getByLabelText(/Description/)

    await userEvent.type(titleInput, 'New Tag')
    await userEvent.type(descriptionInput, 'A new description')

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(await screen.findByText('New Tag')).toBeInTheDocument()
    expect(mockSetValue).toHaveBeenCalledWith([50])

    const createCall = fetchMock.mock.calls.find(([, init]) => {
      const method = init?.method ?? 'GET'
      const override = getHeader(
        init?.headers as HeadersInit | undefined,
        'X-Payload-HTTP-Method-Override',
      )
      return method === 'POST' && override !== 'GET'
    })

    expect(createCall).toBeTruthy()

    const [, requestInit] = createCall!
    const parsedBody = JSON.parse(String(requestInit?.body))

    expect(parsedBody).toMatchObject({
      title: 'New Tag',
      description: 'A new description',
      site: 123,
    })
  })

  it('opens edit modal and saves updated chip label using configured modal fields', async () => {
    resetPayloadMocks({ value: [2] })
    const fetchMock = mockRelationshipFieldEditFetch()

    render(<RelationshipField {...defaultProps} />)

    expect(await screen.findByText('Alpha')).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Edit Alpha'))

    const titleInput = await screen.findByLabelText(/Title/)
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Alpha Updated')

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    expect(await screen.findByText('Alpha Updated')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalled()
  })
})
