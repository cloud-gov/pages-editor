import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { USWDSInit } from '@/components/utilities/USWDSInPageNavInit.client'
import { SetStepNav } from '@/components/utilities/SetStepNav.client'
import { getSiteATUPackage } from '@/components/utilities'
import Package from './Package'

/**
 * User Roles & Permissions — Custom Root View (Server Component)
 * Wrapped in DefaultTemplate so the admin chrome (header, sidebar, breadcrumbs) renders.
 * The in-page nav aside + headings in <main> are picked up by USWDS JS initialized by the client component.
 */
export default async function SiteCompliance(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
  const { req, permissions, locale, visibleEntities } = initPageResult
  const { user, siteUsers, atuPackage } = await getSiteATUPackage(req.payload, req.headers).catch(
    (err) => redirect(`/admin/login`),
  )

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={visibleEntities}
    >
      {/* Initialize USWDS In-page nav, accordion on the client and fix breadcrumbs */}
      <USWDSInit />
      <SetStepNav />

      {/* Main content */}
      <Gutter>
        {/* In-page nav + content layout */}
        <div className="usa-in-page-nav-container">
          {/* USWDS JS auto-populates this aside based on headings inside <main> */}
          <aside
            className="usa-in-page-nav"
            data-title-text="On this page"
            data-title-heading-level="h4"
            data-scroll-offset="0"
            data-root-margin="0px 0px 0px 0px"
            data-threshold="1"
          />
          <Package siteUsers={siteUsers} atuPackage={atuPackage} />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
