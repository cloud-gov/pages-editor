'use client'
import React from 'react'
import { Select } from '@payloadcms/ui'

import '../index.scss'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { Site } from '@/payload-types'
import { useState } from 'react'

const baseClass = 'before-dashboard'

interface SiteSelectProps {
    sites: Site[]
    selectedSiteId: number
}

const SiteSelect: React.FC<SiteSelectProps> = (props: SiteSelectProps) => {
    // this is sent down from the server component so that the sites shape and content
    // can be guaranteed/unfiltered by access controls
    const { sites, selectedSiteId } = props
    // this is duplicated state but it helps refresh this component when needed
    const [localSiteId, setLocalSiteId ] = useState(selectedSiteId)

    async function onChange(event) {
        if (event.value) {
          const valueAsNumber = Number(event.value)
          await fetch(`${process.env.PUBLIC_URL}/api/siteSelect`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: valueAsNumber })
          })
          setLocalSiteId(valueAsNumber)
        }
      }

    // set this now if the user doesn't have this present
    if (!selectedSiteId) {
        const firstSite = sites[0]
        if (!firstSite) return null
        onChange({ value: firstSite.id })
        setLocalSiteId(firstSite.id)
        return null
    }

    const match = sites.find(site => site.id == localSiteId)
    if (!match) return 'Unexpected error. Please contact pages-support@cloud.gov'

    const siteOptions = sites.map(site => ({
        value: site.id,
        label: site.name,
    }))

    const currentSiteOption = { value: match.id, label: match.name }

    return (
        <div className={baseClass}>
            <Banner className={`${baseClass}__banner`} type="success">
                <h4>Welcome to your dashboard! Signed in to {currentSiteOption.label}</h4>
                {siteOptions.length > 1 &&
                    <Select
                        options={siteOptions}
                        value={currentSiteOption}
                        onChange={onChange}
                    />
                }
            </Banner>
        </div>
    )
}

export default SiteSelect
