'use client'
import React, { useState } from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'

import '../index.scss'
import { Select } from '@payloadcms/ui'
import { Site } from '@/payload-types'
import { v4 as uuidv4 } from 'uuid'

const defaultCookieKey = 'payload-site'

function setCookie(cname, cvalue, exdays = 1) {
  const d = new Date()
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

const getSite = (
  cookieKey = defaultCookieKey
) => {
  if (window === undefined) return null

  return window.document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieKey}=`))
    ?.split('=')[1]
}

function onChange (event, sites, refresh) {
  const site = sites.find(s => s.name === event.value)
  setCookie(defaultCookieKey, site.id)
  refresh(uuidv4())
}

interface SiteSelectProps {
  sites: Site[],
}

const baseClass = 'before-dashboard'

const SiteInfo: React.FC<SiteSelectProps> = (props: SiteSelectProps) => {
  const { sites } = props;
  // dummy useState for refreshing on cookie changes
  const [siteRefresh, setSiteRefresh] = useState(false)

  const siteOptions = sites.map(site => ({ label: site.name, value: site.name }))

  // cookie value represents the id (as a string)
  const site = getSite()
  // does the user have access and/or does the cookie exist
  const match =  sites.find(s => String(s.id) === site)

  let currentSiteName = ''

  if (!match) {
    // if this isn't already set or valid, we HAVE to set it
    setCookie(defaultCookieKey, sites[0].id)
    currentSiteName = sites[0].name
  } else {
    currentSiteName = match.name
  }
  const currentSiteOption = { value: currentSiteName, label: currentSiteName }

  return (
    <Banner className={`${baseClass}__banner`} type="success">
    <h4>Welcome to your dashboard! Signed in to {currentSiteName}</h4>
    {siteOptions.length > 1 &&
          <Select
          options={siteOptions}
          value={currentSiteOption}
          onChange={(event) => onChange(event, sites, setSiteRefresh)}
        />
    }
  </Banner>

  )
}

export default SiteInfo
