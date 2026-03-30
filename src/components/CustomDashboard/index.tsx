import React from 'react'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { getUserSiteInfo, getCollectionTypes } from '@/components/utilities'
import TopTasks from './TopTasks'
import SiteSelect from './SiteSelect'
import ListSiteCollectionTypes from './ListSiteCollectionTypes'
import Section from './Section'
import CardLink from './CardLink'

const CustomDashboard: React.FC = async (props: { payload: BasePayload }) => {
  const { payload } = props
  const headers = await nextHeaders()
  const { user, sites, selectedSiteId, selectedSiteRole } = await getUserSiteInfo(payload, headers)
  const collectionTypes = await getCollectionTypes(payload, headers)

  return (
    <div className="grid-container">
      <div className="grid-row margin-top-0">
        <div className="grid-col-12">
          <h1 className="usa-sr-only">Dashboard</h1>
        </div>
      </div>

      <div className="grid-row margin-top-0 margin-bottom-4">
        <div className="grid-col-12">
          <SiteSelect sites={sites} selectedSiteId={selectedSiteId} />
        </div>
      </div>
      <div className="grid-row margin-top-0 margin-bottom-4">
        <div className="grid-col-12">
          <TopTasks sites={sites} selectedSiteId={selectedSiteId} role={selectedSiteRole} />
        </div>
      </div>

      <ListSiteCollectionTypes collectionTypes={collectionTypes} />

      <Section title="Content Pages">
        <div className="grid-row grid-gap-2">
          <CardLink
            href="/admin/collections/pages"
            title="Pages"
            description="Individual pages like About or Contact."
            label="View all single pages"
          />
          <CardLink
            href="/admin/globals/home-page"
            title="Homepage"
            description="A customizable homepage with flexible content blocks."
            label="View homepage"
          />
        </div>
      </Section>

      <Section title="Global Assets">
        <div className="grid-row grid-gap-2">
          <CardLink
            href="/admin/globals/alerts"
            title="Alerts"
            description="Informational banners for announcements such as deadlines, outages or news."
            label="View all alerts"
          />
          <CardLink
            href="/admin/collections/media"
            title="Media"
            description="Site-wide images, videos, and files used across pages and content."
            label="View all media"
          />
          <CardLink
            href="/admin/collections/tags"
            title="Tags"
            description="Tags used to organize and filter content across the site."
            label="View all tags"
          />
          <CardLink
            href="/admin/globals/not-found-page"
            title="Not Found 404 Error Page"
            description="Customizable 404 error page."
            label="View"
          />
        </div>
      </Section>

      <Section title="Structure">
        <div className="grid-row grid-gap-2">
          <CardLink
            href="/admin/globals/menu"
            title="Main Navigation Menu"
            description="Build and organize primary site navigation for pages and content sections."
            label="View main navigation menu"
          />
          <CardLink
            href="/admin/collections/side-navigation"
            title="Side Navigation"
            description="Create and manage side navigation menus for single pages and collections."
            label="View side navigation"
          />
          <CardLink
            href="/admin/globals/pre-footer"
            title="Pre-Footer"
            description="Build and organize site pre-footer content and links."
            label="View pre-footer"
          />
          <CardLink
            href="/admin/globals/footer"
            title="Footer"
            description="Build and organize the main footer content and links."
            label="View footer"
          />
        </div>
      </Section>

      {(selectedSiteRole === 'manager' || user.isAdmin) && (
        <Section title="User Management">
          <div className="grid-row grid-gap-2">
            <CardLink
              href="/admin/collections/users"
              title="Users"
              description="Manage who can access and edit the site."
              label="View users"
            />
            <CardLink
              href="/admin/sites-roles-and-permissions"
              title="Site Roles and Permissions"
              description="Documentation on roles and permissions."
              label="View"
            />
          </div>
        </Section>
      )}

      <Section title="Site Configuration">
        <div className="grid-row grid-gap-2">
          <CardLink
            href="/admin/globals/site-config"
            title="Site Identify"
            description="Set global branding details like site name, logo, and typography."
            label="View"
          />
          <CardLink
            href="/admin/globals/search-analytics-page"
            title="Web Analytics"
            description="Configure site search settings and digital analytics integrations."
            label="View"
          />
        </div>
      </Section>

      {(selectedSiteRole === 'manager' || user.isAdmin) && (
        <Section title="Site Compliance and Security">
          <div className="grid-row grid-gap-2">
            <CardLink
              href="/admin/globals/site-auth"
              title="Authorization Forms"
              description="Forms for completing and managing your site Authority to Use (ATU)."
              label="View authorization"
            />

            <CardLink
              href="/admin/atu-package"
              title="ATU Package"
              description="Authority to Use (ATU) package with your sites compliance documentation."
              label="Get ATU package"
            />
            <CardLink
              href="/admin/atu-guide"
              title="ATU Guide"
              description="Authority to Use (ATU) guide with steps and resources to help you meet compliance requirements."
              label="Review guide"
            />
          </div>
        </Section>
      )}
    </div>
  )
}

export default CustomDashboard
