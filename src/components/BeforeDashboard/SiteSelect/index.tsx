'use client'
import React, { useEffect, useState } from 'react'
import { Select, usePreferences } from '@payloadcms/ui'

import '../index.scss'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { Site, User } from '@/payload-types'

const baseClass = 'before-dashboard'
const siteKey = 'site-key'

interface SitePreferenceLoaded {
    loaded: true,
    siteId: number
}

interface SitePreferenceInitial {
    loaded: false
}

type SitePreference = SitePreferenceLoaded | SitePreferenceInitial

interface SiteSelectProps {
    sites: Site[]
}

type LocalUpdateType = React.Dispatch<React.SetStateAction<SitePreference>>
type PreferenceUpdateType = <T = any>(key: string, value: T, merge?: boolean) => Promise<void>

function onChange(event, localUpdate: LocalUpdateType, preferenceUpdate: PreferenceUpdateType) {
  if (event.value) {
    const valueAsNumber = Number(event.value)
    localUpdate({ loaded: true, siteId: valueAsNumber})
    preferenceUpdate(siteKey, valueAsNumber)
  }
}

const SiteSelect: React.FC<SiteSelectProps> = (props: SiteSelectProps) => {
    const { sites } = props
    const [ userSite, setUserSite ] = useState<SitePreference>({ loaded: false })
    const { getPreference, setPreference } = usePreferences()

    useEffect(() => {
        async function getSiteId () {
            let siteId: number | undefined = await getPreference(siteKey)
            // if the user doesn't have a set site preferences, set it now
            if (!siteId) {
                siteId = sites[0].id
                await setPreference(siteKey, siteId)
            }
            setUserSite({ loaded: true, siteId })
        }
        getSiteId()
    }, [getPreference, setPreference, sites])

    if (!userSite.loaded) return null

    const match = sites.find(site => site.id == userSite.siteId)
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
                        onChange={(event) => onChange(event, setUserSite, setPreference)}
                    />
                }
            </Banner>
        </div>
    )
}

export default SiteSelect
