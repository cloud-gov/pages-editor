import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NavClient from './NavClient'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@payloadcms/ui', () => ({
  NavGroup: ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div data-testid="nav-group" aria-label={label}>
      {children}
    </div>
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}))

const baseProps = {
  collectionTypeLinks: [],
  tagTypeLinks: [],
}

function formsLinks() {
  return {
    forms: document.querySelector('a[href="/admin/collections/site-forms"]'),
    submissions: document.querySelector(
      'a[href="/admin/collections/site-form-submissions"]',
    ),
  }
}

describe('NavClient forms feature flag', () => {
  describe('admin view', () => {
    it('shows Forms nav group when formsEnabled is true', () => {
      render(
        <NavClient
          {...baseProps}
          user={{ isAdmin: true }}
          selectedSiteRole={null}
          formsEnabled
        />,
      )
      const { forms, submissions } = formsLinks()
      expect(forms).toBeTruthy()
      expect(submissions).toBeTruthy()
    })

    it('hides Forms nav group when formsEnabled is false', () => {
      render(
        <NavClient
          {...baseProps}
          user={{ isAdmin: true }}
          selectedSiteRole={null}
          formsEnabled={false}
        />,
      )
      const { forms, submissions } = formsLinks()
      expect(forms).toBeNull()
      expect(submissions).toBeNull()
    })

    it('hides Forms nav group when formsEnabled is omitted (defaults off)', () => {
      render(<NavClient {...baseProps} user={{ isAdmin: true }} selectedSiteRole={null} />)
      const { forms, submissions } = formsLinks()
      expect(forms).toBeNull()
      expect(submissions).toBeNull()
    })
  })

  describe('site user view', () => {
    it('shows Forms nav group when formsEnabled is true', () => {
      render(
        <NavClient
          {...baseProps}
          user={{ isAdmin: false }}
          selectedSiteRole="manager"
          formsEnabled
        />,
      )
      const { forms, submissions } = formsLinks()
      expect(forms).toBeTruthy()
      expect(submissions).toBeTruthy()
    })

    it('hides Forms nav group when formsEnabled is false', () => {
      render(
        <NavClient
          {...baseProps}
          user={{ isAdmin: false }}
          selectedSiteRole="manager"
          formsEnabled={false}
        />,
      )
      const { forms, submissions } = formsLinks()
      expect(forms).toBeNull()
      expect(submissions).toBeNull()
    })
  })
})
