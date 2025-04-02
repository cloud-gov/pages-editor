import React from 'react'

import './index.scss'
import SiteSelect from './SiteSelect'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { Site } from '@/payload-types'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = async (props: { payload: BasePayload }) => {
  const { payload } = props;
  const headers = await nextHeaders()
  const { user, permissions } = await payload.auth({ headers })

  // don't render:
  // 1. without a user
  // 2. for admins
  // 3. with no sites
  if (!user || user?.isAdmin || !user.sites) return null

  // in server rendered components, we know the shape
  const sites = user.sites.map(site => site.site as Site)

  return (
    <div className={baseClass}>
      <SiteSelect sites={sites} selectedSiteId={user.selectedSiteId} />
    </div>
  )
}

export default BeforeDashboard
