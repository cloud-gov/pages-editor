import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import SubmissionDataField from './index'

const mockUseField = vi.fn()

vi.mock('@payloadcms/ui', () => ({
  useField: () => mockUseField(),
}))

vi.mock('./index.scss', () => ({}))

const defaultProps = {
  path: 'data',
  field: {
    label: 'Submission Data',
    admin: {
      description: 'The submitted form data',
    },
  },
}

function setFieldValue(value: unknown) {
  mockUseField.mockReturnValue({ value })
}

describe('SubmissionDataField', () => {
  beforeEach(() => {
    mockUseField.mockReset()
  })

  describe('rendering basics', () => {
    it('renders label and description', () => {
      setFieldValue({})

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Submission Data')).toBeInTheDocument()
      expect(screen.getByText('The submitted form data')).toBeInTheDocument()
    })

    it('uses default label when not provided', () => {
      setFieldValue({})

      render(
        <SubmissionDataField
          path="data"
          field={{}}
        />
      )

      expect(screen.getByText('Submission Data')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty message when value is null', () => {
      setFieldValue(null)

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('No data submitted')).toBeInTheDocument()
    })

    it('shows empty message when value is undefined', () => {
      setFieldValue(undefined)

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('No data submitted')).toBeInTheDocument()
    })

    it('shows empty message when value is empty object', () => {
      setFieldValue({})

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('No data submitted')).toBeInTheDocument()
    })
  })

  describe('flat object rendering', () => {
    it('renders simple key-value pairs in a table', () => {
      setFieldValue({
        name: 'John Doe',
        message: 'Hello world',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Message')).toBeInTheDocument()
      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })

    it('renders table headers', () => {
      setFieldValue({ name: 'Test' })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.getByText('Value')).toBeInTheDocument()
    })
  })

  describe('nested object flattening', () => {
    it('flattens nested objects with dot notation labels', () => {
      setFieldValue({
        address: {
          city: 'New York',
          zip: '10001',
        },
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Address > City')).toBeInTheDocument()
      expect(screen.getByText('New York')).toBeInTheDocument()
      expect(screen.getByText('Address > Zip')).toBeInTheDocument()
      expect(screen.getByText('10001')).toBeInTheDocument()
    })

    it('flattens deeply nested objects', () => {
      setFieldValue({
        user: {
          profile: {
            settings: {
              theme: 'dark',
            },
          },
        },
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('User > Profile > Settings > Theme')).toBeInTheDocument()
      expect(screen.getByText('dark')).toBeInTheDocument()
    })

    it('flattens arrays with numeric indices', () => {
      setFieldValue({
        items: ['apple', 'banana'],
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Items > 0')).toBeInTheDocument()
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('Items > 1')).toBeInTheDocument()
      expect(screen.getByText('banana')).toBeInTheDocument()
    })

    it('flattens arrays of objects', () => {
      setFieldValue({
        contacts: [
          { name: 'Alice' },
          { name: 'Bob' },
        ],
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Contacts > 0 > Name')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Contacts > 1 > Name')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  describe('URL auto-detection', () => {
    it('renders http URLs as clickable links', () => {
      setFieldValue({
        website: 'http://example.com',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const link = screen.getByRole('link', { name: 'http://example.com' })
      expect(link).toHaveAttribute('href', 'http://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('renders https URLs as clickable links', () => {
      setFieldValue({
        website: 'https://secure.example.com/path?query=1',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const link = screen.getByRole('link', { name: 'https://secure.example.com/path?query=1' })
      expect(link).toHaveAttribute('href', 'https://secure.example.com/path?query=1')
    })
  })

  describe('email auto-detection', () => {
    it('renders email addresses as mailto links', () => {
      setFieldValue({
        email: 'user@example.com',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const link = screen.getByRole('link', { name: 'user@example.com' })
      expect(link).toHaveAttribute('href', 'mailto:user@example.com')
    })

    it('handles emails with subdomains', () => {
      setFieldValue({
        email: 'contact@mail.example.org',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const link = screen.getByRole('link', { name: 'contact@mail.example.org' })
      expect(link).toHaveAttribute('href', 'mailto:contact@mail.example.org')
    })
  })

  describe('date auto-detection', () => {
    it('formats ISO date strings', () => {
      setFieldValue({
        createdAt: '2024-03-15',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const time = screen.getByRole('cell', { name: /2024/ }).querySelector('time')
      expect(time).toHaveAttribute('datetime', '2024-03-15')
    })

    it('formats ISO datetime strings', () => {
      setFieldValue({
        submittedAt: '2024-03-15T14:30:00',
      })

      render(<SubmissionDataField {...defaultProps} />)

      const time = screen.getByRole('cell', { name: /2024/ }).querySelector('time')
      expect(time).toHaveAttribute('datetime', '2024-03-15T14:30:00')
    })
  })

  describe('boolean formatting', () => {
    it('formats true as "Yes"', () => {
      setFieldValue({
        subscribed: true,
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Yes')).toBeInTheDocument()
    })

    it('formats false as "No"', () => {
      setFieldValue({
        subscribed: false,
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('No')).toBeInTheDocument()
    })
  })

  describe('null/undefined value formatting', () => {
    it('shows dash for null values', () => {
      setFieldValue({
        optional: null,
      })

      render(<SubmissionDataField {...defaultProps} />)

      const cell = screen.getByText('Optional').closest('tr')?.querySelector('.submission-data-field__value')
      expect(within(cell!).getByText('-')).toBeInTheDocument()
    })
  })

  describe('key to label conversion', () => {
    it('converts camelCase to Title Case', () => {
      setFieldValue({
        firstName: 'John',
        lastName: 'Doe',
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
    })

    it('converts snake_case to readable format', () => {
      setFieldValue({
        phone_number: '555-1234',
        street_address: '123 Main St',
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Phone number')).toBeInTheDocument()
      expect(screen.getByText('Street address')).toBeInTheDocument()
    })

    it('converts kebab-case to readable format', () => {
      setFieldValue({
        'postal-code': '12345',
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Postal code')).toBeInTheDocument()
    })

    it('capitalizes single-word keys', () => {
      setFieldValue({
        name: 'Test',
        email: 'test@test.com',
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('Name')).toBeInTheDocument()
    })
  })

  describe('numeric values', () => {
    it('renders numbers as strings', () => {
      setFieldValue({
        age: 25,
        score: 99.5,
      })

      render(<SubmissionDataField {...defaultProps} />)

      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText('99.5')).toBeInTheDocument()
    })
  })
})
