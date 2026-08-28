import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { NavClientGroup } from './NavClientGroup'
import Link from 'next/link'

vi.mock('@payloadcms/ui', () => ({
  ChevronIcon: ({
    className,
  }: {
    className?: string
  }) => (
    <svg
      data-testid="chevron-icon"
      className={className}
    />
  ),
}))

describe('NavClientGroup', () => {
  const renderComponent = () =>
  render(
    <NavClientGroup label="Content Pages">
      <Link href="#">Pages</Link>
      <Link href="#">HomePage</Link>
    </NavClientGroup>,
  )

  test('renders expected links', () => {
    renderComponent()

    expect(
      screen.getByRole('link', {
        name: 'Pages',
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'HomePage',
      }),
    ).toBeInTheDocument()
  })

  test('renders no inline style attributes', () => {
    const { container } = renderComponent()

    const styledElements =
      container.querySelectorAll('[style]')

    expect(styledElements).toHaveLength(0)
  })

  test('does not render react-animate-height wrappers', () => {
    const { container } = renderComponent()

    expect(
      container.querySelector('.rah-static'),
    ).not.toBeInTheDocument()

    expect(
      container.querySelector('.rah-static--height-auto'),
    ).not.toBeInTheDocument()
  })

  test('is expanded by default', () => {
    renderComponent()

    const button = screen.getByRole('button', {
      name: /content pages/i,
    })

    expect(button).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  test('toggles aria-expanded when clicked', async () => {
    const user = userEvent.setup()

    renderComponent()

    const button = screen.getByRole('button', {
      name: /content pages/i,
    })

    expect(button).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await user.click(button)

    expect(button).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    await user.click(button)

    expect(button).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  test('adds and removes open class when toggled', async () => {
    const user = userEvent.setup()

    const { container } = renderComponent()

    const button = screen.getByRole('button', {
      name: /content pages/i,
    })

    const wrapper = container.querySelector(
      '.nav-group__content-wrapper',
    )

    expect(wrapper).toHaveClass(
      'nav-group__content-wrapper--open',
    )

    await user.click(button)

    expect(wrapper).not.toHaveClass(
      'nav-group__content-wrapper--open',
    )

    await user.click(button)

    expect(wrapper).toHaveClass(
      'nav-group__content-wrapper--open',
    )
  })

  test('keeps aria-hidden synchronized with expanded state', async () => {
    const user = userEvent.setup()

    const { container } = renderComponent()

    const button = screen.getByRole('button', {
      name: /content pages/i,
    })

    const wrapper = container.querySelector(
      '.nav-group__content-wrapper',
    )

    expect(wrapper).toHaveAttribute(
      'aria-hidden',
      'false',
    )

    await user.click(button)

    expect(wrapper).toHaveAttribute(
      'aria-hidden',
      'true',
    )

    await user.click(button)

    expect(wrapper).toHaveAttribute(
      'aria-hidden',
      'false',
    )
  })

  test('maintains aria-controls relationship', () => {
    renderComponent()

    const button = screen.getByRole('button', {
      name: /content pages/i,
    })

    const controlsId =
      button.getAttribute('aria-controls')

    expect(controlsId).toBeTruthy()

    const controlledElement = document.getElementById(
      controlsId!,
    )

    expect(controlledElement).toBeInTheDocument()
  })
})
