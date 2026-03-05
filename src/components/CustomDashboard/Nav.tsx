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
        <Link className="link-button margin-y-2" href="/admin/collections/collection-types/create">
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
      </div>
    </aside>
  )
}

export default Nav
