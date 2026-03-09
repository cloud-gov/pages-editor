'use client'
import React, { useEffect, useState } from 'react'
import { Select } from '@payloadcms/ui'
import { Site, SiteConfig } from '@/payload-types'

interface SiteSelectProps {
  sites: Site[]
  selectedSiteId?: string | null
}

const SiteSelect: React.FC<SiteSelectProps> = ({ sites, selectedSiteId }) => {
  // this is duplicated state but it helps refresh this component when needed
  const [localSiteId, setLocalSiteId] = useState(selectedSiteId)
  const [currentSiteIdentity, setCurrentSiteIdentity] = useState<SiteConfig | null>(null)

  useEffect(() => {
    async function fetchSiteIdentity(id: string) {
      const siteIdentity = await fetch(`${process.env.PUBLIC_URL}/api/globals/site-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: id }),
      })

      return siteIdentity.json()
    }

    if (localSiteId) {
      fetchSiteIdentity(localSiteId)
        .then((siteIdentity) => {
          setCurrentSiteIdentity(siteIdentity.result)
        })
        .catch(() => {
          setCurrentSiteIdentity(null)
        })
    }
  }, [localSiteId, sites])

  async function onChange(event) {
    if (event.value) {
      const valueAsNumber = Number(event.value)
      await fetch(`${process.env.PUBLIC_URL}/api/siteSelect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: valueAsNumber }),
      })
      setLocalSiteId(valueAsNumber.toString())
      // refresh the page so that user.selectedSiteId is updated
      window.location.reload()
    }
  }

  // Don't render for admins or if no sites
  if (sites.length === 0) return null

  // set this now if the user doesn't have this present
  if (!selectedSiteId) {
    const firstSite = sites[0]
    if (!firstSite) return null
    onChange({ value: firstSite.id })
    setLocalSiteId(firstSite.id.toString())
    return null
  }

  const match = sites.find((site) => site.id.toString() === localSiteId)
  if (!match)
    return (
      <div className="usa-alert usa-alert--error">
        Unexpected error. Please contact pages-support@cloud.gov
      </div>
    )

  const siteOptions = sites.map((site) => ({
    value: site.id,
    label: site.name,
  }))

  const currentSiteOption = { value: match.id, label: match.name }

  return (
    <div className="grid-row grid-gap display-flex flex-align-center">
      <div className="grid-col-12 tablet:grid-col-4">
        <h2 id="site-selection">
          <p>
            <span className="text-normal">Site:</span> {currentSiteIdentity?.agencyName}
          </p>
        </h2>
      </div>

      {siteOptions.length > 1 && (
        <div className="usa-form-group grid-col-12 tablet:grid-col-6 tablet:grid-offset-2 desktop:grid-col-4 desktop:grid-offset-4">
          <div className="grid-row grid-gap display-flex flex-align-center">
            <div className="grid-col-auto">
              <label htmlFor="site-select">Select Site:</label>
            </div>
            <div className="grid-col-fill">
              <Select
                id="site-select"
                options={siteOptions}
                value={currentSiteOption}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiteSelect
