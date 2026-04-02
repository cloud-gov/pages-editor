'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { NavGroup } from '@payloadcms/ui'

type NavClientProps = {
  collectionTypeLinks: {
    id: string
    title: string
    slug: string | null | undefined
    href: string
  }[]
  user: any
  selectedSiteRole: 'user' | 'manager' | 'bot' | null | undefined
}

const NavClient: React.FC<NavClientProps> = ({ collectionTypeLinks, user, selectedSiteRole }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    const cleanHref = href.split('?')[0]
    return pathname === cleanHref || pathname.startsWith(cleanHref)
  }

  const isCollectionTypeActive = (id: string) => {
    for (const [key, value] of searchParams.entries()) {
      if (key.includes('collectionType') && value.toString() === id.toString()) {
        return true
      }
    }
    return false
  }

  return (
    <aside className="nav nav--nav-open nav--nav-animate nav--nav-hydrated">
      <div className="nav__scroll" style={{ overscrollBehavior: 'auto' }}>
        <Link className="margin-bottom-2" href="/admin/">
          &#127968; Homepage
        </Link>
        {user?.isAdmin && (
          <>
            <NavGroup label="&#128193; Admin">
              <Link
                href="/admin/collections/sites"
                className={`nav__link ${isActive('/admin/collections/sites') ? 'nav__link--active' : ''}`}
              >
                Sites
              </Link>
            </NavGroup>
            <NavGroup label="&#128193; Content Pages and Collections">
              <Link
                href="/admin/collections/pages"
                className={`nav__link ${isActive('/admin/collections/pages') ? 'nav__link--active' : ''}`}
              >
                Pages
              </Link>
              <Link
                href="/admin/collections/collection-entries"
                className={`nav__link ${isActive('/admin/collections/collection-entries') ? 'nav__link--active' : ''}`}
              >
                Collection Entries
              </Link>
              <Link
                href="/admin/collections/home-page-site-collection"
                className={`nav__link ${isActive('/admin/collections/home-page-site-collection') ? 'nav__link--active' : ''}`}
              >
                Home Page Site Collection
              </Link>
            </NavGroup>
            <NavGroup label="&#x1F464; User Management">
              <Link
                href="/admin/collections/users"
                className={`nav__link ${isActive('/admin/collections/users') ? 'nav__link--active' : ''}`}
              >
                Users
              </Link>
            </NavGroup>
            <NavGroup label="&#128272; Site Compliance and Security">
              <Link className="nav__link" href="/admin/collections/site-auth-site-collection">
                Authorization Forms
              </Link>
            </NavGroup>
          </>
        )}

        {!user?.isAdmin && (
          <>
            <Link
              className="link-button margin-bottom-2"
              href="/admin/collections/collection-types/create"
            >
              &oplus; Create Collection Type
            </Link>
            <NavGroup label="&#128193; Content Collections">
              {collectionTypeLinks.map((type) => {
                return (
                  <Link
                    key={type.slug}
                    href={type.href}
                    className={`nav__link ${isCollectionTypeActive(type.id) ? 'nav__link--active' : ''}`}
                  >
                    {type.title}
                  </Link>
                )
              })}
            </NavGroup>
            <NavGroup label="&#x1F4C4; Content Pages">
              <Link
                href="/admin/collections/pages"
                className={`nav__link ${isActive('/admin/collections/pages') ? 'nav__link--active' : ''}`}
              >
                Pages
              </Link>

              <Link
                href="/admin/globals/home-page"
                className={`nav__link ${isActive('/admin/globals/home-page') ? 'nav__link--active' : ''}`}
              >
                HomePage
              </Link>
            </NavGroup>
            <NavGroup label="&#x1F30F; Global Assets">
              <Link
                href="/admin/collections/alerts"
                className={`nav__link ${isActive('/admin/collections/alerts') ? 'nav__link--active' : ''}`}
              >
                Alerts
              </Link>

              <Link
                href="/admin/collections/media"
                className={`nav__link ${isActive('/admin/collections/media') ? 'nav__link--active' : ''}`}
              >
                Media
              </Link>

              <Link
                href="/admin/collections/tags"
                className={`nav__link ${isActive('/admin/collections/tags') ? 'nav__link--active' : ''}`}
              >
                Tags
              </Link>

              <Link
                href="/admin/globals/not-found-page"
                className={`nav__link ${isActive('/admin/globals/not-found-page') ? 'nav__link--active' : ''}`}
              >
                Not Found 404 Error Page
              </Link>
            </NavGroup>
            <NavGroup label="&#x1F4D0; Structure">
              <Link
                href="/admin/globals/menu"
                className={`nav__link ${isActive('/admin/globals/menu') ? 'nav__link--active' : ''}`}
              >
                Main Navigation Menu
              </Link>

              <Link
                href="/admin/collections/side-navigation"
                className={`nav__link ${isActive('/admin/collections/side-navigation') ? 'nav__link--active' : ''}`}
              >
                Side Navigation
              </Link>

              <Link
                href="/admin/globals/pre-footer"
                className={`nav__link ${isActive('/admin/globals/pre-footer') ? 'nav__link--active' : ''}`}
              >
                Pre-Footer
              </Link>

              <Link
                href="/admin/globals/footer"
                className={`nav__link ${isActive('/admin/globals/footer') ? 'nav__link--active' : ''}`}
              >
                Main Footer
              </Link>
            </NavGroup>
            {(selectedSiteRole === 'manager' || user.isAdmin) && (
              <NavGroup label="&#x1F464; User Management">
                <Link
                  href="/admin/collections/users"
                  className={`nav__link ${isActive('/admin/collections/users') ? 'nav__link--active' : ''}`}
                >
                  Users
                </Link>

                <Link
                  href="/admin/sites-roles-and-permissions"
                  className={`nav__link ${isActive('/admin/sites-roles-and-permissions') ? 'nav__link--active' : ''}`}
                >
                  Sites, Roles, and Permissions
                </Link>
              </NavGroup>
            )}
            <NavGroup label="&#x2699; Site Configuration">
              <Link
                href="/admin/globals/site-config"
                className={`nav__link ${isActive('/admin/globals/site-config') ? 'nav__link--active' : ''}`}
              >
                Site Identity
              </Link>

              <Link
                href="/admin/globals/search-analytics-page"
                className={`nav__link ${isActive('/admin/globals/search-analytics-page') ? 'nav__link--active' : ''}`}
              >
                Web Analytics
              </Link>
            </NavGroup>
            {selectedSiteRole === 'manager' && (
              <NavGroup label="&#128272; Site Compliance and Security">
                <Link
                  className={`nav__link ${isActive('/admin/globals/site-auth') ? 'nav__link--active' : ''}`}
                  href="/admin/globals/site-auth"
                >
                  Authorization Forms
                </Link>
                <Link
                  className={`nav__link ${isActive('/admin/atu-package') ? 'nav__link--active' : ''}`}
                  href="/admin/atu-package"
                >
                  ATU Package
                </Link>
                <Link
                  className={`nav__link ${isActive('/admin/atu-guide') ? 'nav__link--active' : ''}`}
                  href="/admin/atu-guide"
                >
                  ATU Guide
                </Link>
              </NavGroup>
            )}
          </>
        )}
        <div className="nav__controls">
          <Link href="/admin/logout" className="nav__log-out" aria-label="Logout">
            <svg
              className="icon icon--logout"
              fill="none"
              height="20"
              viewBox="0 0 20 20"
              width="20"
            >
              <path
                className="stroke"
                d="M12 16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V5.33333C16 4.97971 15.8595 4.64057 15.6095 4.39052C15.3594 4.14048 15.0203 4 14.6667 4H12M7.33333 13.3333L4 10M4 10L7.33333 6.66667M4 10H12"
                strokeLinecap="square"
              />
            </svg>
            Logout
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default NavClient
