import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'
import { BasePayload } from 'payload'
import SiteSelect from './SiteSelect'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = (props: { payload: BasePayload} ) => {
  if (!props.payload.config.admin.custom.site) return null
  const { site, sites } = props.payload.config.admin.custom
  const siteOptions = sites.map(site => ({ label: site.name, value: site.name }))
  const siteValue = { label: site.name, value: site.name }
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard! Signed in to {site.name}</h4>
        {siteOptions.length > 1 &&
          <SiteSelect sites={siteOptions} site={siteValue} />
        }
      </Banner>
    </div>
  )
}

export default BeforeDashboard
