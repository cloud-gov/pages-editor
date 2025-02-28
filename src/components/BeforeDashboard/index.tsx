import React from 'react'

import './index.scss'
import { BasePayload } from 'payload'
import SiteInfo from './SiteSelect'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = (props: { payload: BasePayload} ) => {
  const { config } = props.payload

  // don't render this for admins
  if (!config.admin.custom.sites.length) return null

  const { sites } = config.admin.custom

  return (
    <div className={baseClass}>
      <SiteInfo sites={sites} />
    </div>
  )
}

export default BeforeDashboard
