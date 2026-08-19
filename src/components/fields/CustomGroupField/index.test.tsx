import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CustomGroupField } from './index'
import { createMockGroupField, resetPayloadMocks } from '../mocks/testmocks'

const defaultProps = {
  field: createMockGroupField({
    label: 'External Link'
  }),
  path: '',
  schemaPath: '',
  permissions: {} as any,
  readOnly: false,
}

const renderFieldsMock = vi.fn((props) => (
  <div data-testid="render-fields" />
))

vi.mock('@payloadcms/ui', () => ({
  RenderFields: (props) => {
    renderFieldsMock(props)
    return <div data-testid="render-fields" />
  },
}))

describe('CustomGroupField', () => {
  beforeEach(() => {
    resetPayloadMocks()
  })

  it('does not contain inline styles', () => {
    const { container } = render(<CustomGroupField {...defaultProps} />)

    expect(container.querySelector('[style]')).toBeNull()
  })

  it('renders the group label', () => {
    render(<CustomGroupField {...defaultProps} />)

    expect(screen.getByText('External Link')).toBeInTheDocument()
  })

  it('passes path information to RenderFields', () => {
    render(<CustomGroupField {...defaultProps} />)

    expect(renderFieldsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        parentPath: '',
        parentSchemaPath: '',
        parentIndexPath: ''
      })
    )
  })

  it('renders child fields container', () => {
    render(<CustomGroupField {...defaultProps} />)

    expect(screen.getByTestId('render-fields')).toBeInTheDocument()
  })

  it('renders when label is not a string', () => {
    render(
      <CustomGroupField
        {...defaultProps}
        field={{
          ...defaultProps.field,
          label: false,
        }}
      />
    )

    expect(screen.getByTestId('render-fields')).toBeInTheDocument()
  })
})
