import React from 'react'
import { BasePayload } from 'payload'
import { NavGroup } from '@payloadcms/ui'
import { headers as nextHeaders } from 'next/headers'
import Link from 'next/link'
import { buildFilteredUrl, getCollectionTypes, getUserSiteInfo } from '@/components/utilities'

const Nav: React.FC = async (props: { payload: BasePayload }) => {
  const headers = await nextHeaders()
  const collectionTypes = await getCollectionTypes(props.payload, headers)
  const { user, selectedSiteRole } = await getUserSiteInfo(props.payload, headers)

  return (
    <aside className="nav nav--nav-open nav--nav-animate nav--nav-hydrated">
      <div className="nav__scroll" style={{ overscrollBehavior: 'auto' }}>
        <Link className="link-button margin-bottom-2" href="/admin/collections/collection-types/create">
          &oplus; Create Collection Type
        </Link>
        <NavGroup label="&#128193; Content Collections">
          {collectionTypes.docs.map((type) => {
            const filteredUrl = buildFilteredUrl(type.id)

            return (
              <Link key={type.slug} className="nav__link" href={filteredUrl}>
                {type.title}
              </Link>
            )
          })}
        </NavGroup>
        <NavGroup label="&#x1F4C4; Content Pages">
          <Link className="nav__link" href="/admin/collections/pages">
            Pages
          </Link>
          <Link className="nav__link" href="/admin/globals/home-page">
            HomePage
          </Link>
        </NavGroup>
        <NavGroup label="&#x1F30F; Global Assets">
          <Link className="nav__link" href="/admin/collections/alerts">
            Alerts
          </Link>
          <Link className="nav__link" href="/admin/collections/media">
            Media
          </Link>
          <Link className="nav__link" href="/admin/collections/tags">
            Tags
          </Link>
          <Link className="nav__link" href="/admin/collections/not-found-page">
            Not Found 404 Error Page
          </Link>
        </NavGroup>
        <NavGroup label="&#x1F4D0; Structure">
          <Link className="nav__link" href="/admin/globals/menu">
            Main Navigation Menu
          </Link>
          <Link className="nav__link" href="/admin/collections/side-navigation">
            Side Navigation
          </Link>
          <Link className="nav__link" href="/admin/globals/pre-footer">
            Pre-Footer
          </Link>
          <Link className="nav__link" href="/admin/globals/footer">
            Main Footer
          </Link>
        </NavGroup>
        {(selectedSiteRole === 'manager' || user.isAdmin) && (
          <NavGroup label="&#x1F464; User Management">
            <Link className="nav__link" href="/admin/collections/users">
              Users
            </Link>
            <Link className="nav__link" href="/admin/sites-roles-and-permissions">
              Sites, Roles, and Permissions
            </Link>
          </NavGroup>
        )}
        <NavGroup label="&#x2699; Site Configuration">
          <Link className="nav__link" href="/admin/globals/site-config">
            Site Identity
          </Link>
          <Link className="nav__link" href="/admin/globals/search-analytics-page">
            Web Analytics
          </Link>
          <Link className="nav__link" href="/admin/site-compliance">
            Site Compliance
          </Link>
        </NavGroup>
        <div className="nav__controls">
          <Link aria-label="Logout" tabIndex={0} className="nav__log-out" href="/admin/logout">
            <svg
              className="icon icon--logout"
              fill="none"
              height="20"
              viewBox="0 0 20 20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="stroke"
                d="M12 16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V5.33333C16 4.97971 15.8595 4.64057 15.6095 4.39052C15.3594 4.14048 15.0203 4 14.6667 4H12M7.33333 13.3333L4 10M4 10L7.33333 6.66667M4 10H12"
                stroke-linecap="square"
              ></path>
            </svg>
            Logout
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Nav
