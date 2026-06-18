import React from 'react'
import {
  render,
  screen,
} from '@testing-library/react'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { CardGridRowFields } from './CardGridRow'

const mockSetValue = vi.fn()

const mockFieldValues = vi.hoisted(() => {
  return new Map<string, unknown>()
})

vi.mock('@payloadcms/ui', () => ({
  useField: ({
    path,
  }: {
    path: string
  }) => ({
    value: mockFieldValues.get(path),
    setValue: mockSetValue,
  }),
}))

vi.mock(
  '@/components/fields/FieldWrapper',
  () => ({
    FieldWrapper: ({
      children,
      id,
      label,
    }: {
      children: React.ReactNode
      id: string
      label?: string
    }) => (
      <div data-testid={`field-wrapper-${id}`}>
        {label ? (
          <label htmlFor={id}>
            {label}
          </label>
        ) : null}

        {children}
      </div>
    ),
  }),
)

vi.mock(
  '@/components/fields/CustomBlocksField/components/UploadField',
  () => ({
    UploadField: ({
      label,
      value,
    }: {
      label: string
      value: unknown
    }) => (
      <div
        data-testid="upload-field"
        data-value={
          typeof value === 'string'
            ? value
            : ''
        }
      >
        {label}
      </div>
    ),
  }),
)

describe('CardGridRowFields', () => {
  const cardPath = 'content.0.cards.0'
  const fieldId = 'inline-card-grid'

  beforeEach(() => {
    mockSetValue.mockClear()
    mockFieldValues.clear()

    mockFieldValues.set(
      `${cardPath}.title`,
      'Featured card',
    )

    mockFieldValues.set(
      `${cardPath}.description`,
      'Card description',
    )

    mockFieldValues.set(
      `${cardPath}.image`,
      'media-id',
    )

    mockFieldValues.set(
      `${cardPath}.link.url`,
      '/featured',
    )

    mockFieldValues.set(
      `${cardPath}.link.text`,
      'Learn More',
    )
  })

  it('renders the card row fields', () => {
    render(
      <CardGridRowFields
        cardPath={cardPath}
        fieldId={fieldId}
        index={0}
      />,
    )

    expect(
      screen.getByLabelText('Card Title'),
    ).toHaveValue('Featured card')

    expect(
      screen.getByLabelText(
        'Card Description',
      ),
    ).toHaveValue('Card description')

    expect(
      screen.getByLabelText('Link URL'),
    ).toHaveValue('/featured')

    expect(
      screen.getByLabelText('Link Text'),
    ).toHaveValue('Learn More')

    expect(
      screen.getByTestId('upload-field'),
    ).toHaveTextContent('Card Image')
  })

  it('does not render inline style attributes', () => {
    const { container } = render(
      <CardGridRowFields
        cardPath={cardPath}
        fieldId={fieldId}
        index={0}
      />,
    )

    expect(
      container.querySelector('[style]'),
    ).not.toBeInTheDocument()
  })
})
