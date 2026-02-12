'use client'
import React, { use, useEffect, useState } from 'react'
import { Select } from '@payloadcms/ui'
import { Site, SiteConfig } from '@/payload-types'
import { useRouter } from 'next/navigation'

const baseClass = 'site-select'

interface SiteSelectProps {
  sites: Site[]
  selectedSiteId?: string
}

const SiteSelect: React.FC<SiteSelectProps> = ({ sites, selectedSiteId }) => {
  // this is duplicated state but it helps refresh this component when needed
  const [localSiteId, setLocalSiteId] = useState(selectedSiteId)
  const [currentSiteIdentity, setCurrentSiteIdentity] = useState<SiteConfig | null>(null)
  const router = useRouter()

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
    <div className={baseClass}>
      <div className="usa-summary-box" role="region" aria-labelledby="site-selection">
        <div className="usa-summary-box__body">
          <h2 className="usa-summary-box__heading" id="site-selection">
            Welcome to your dashboard!
          </h2>
          <p>Signed in to {currentSiteIdentity?.agencyName}</p>
          {siteOptions.length > 1 && (
            <div className="usa-summary-box__text margin-top-1">
              <label htmlFor="site-select" className="usa-label">
                Select Site:
              </label>
              <Select
                id="site-select"
                options={siteOptions}
                value={currentSiteOption}
                onChange={onChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SiteSelect
