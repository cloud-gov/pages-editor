'use client'
import React from 'react'

import '../index.scss'
import { Select } from '@payloadcms/ui'

function onChange (tmp) {
  console.log(tmp)
}

type SiteOption = {
    value: string,
    label?: string
}

interface SiteSelectProps {
  sites: SiteOption[],
  site: SiteOption
}

const SiteSelect: React.FC<SiteSelectProps> = (props: SiteSelectProps) => {
  return (
    <Select
      options={props.sites.concat({ value: 'test'})}
      value={props.site}
      onChange={onChange}
    />
  )
}

export default SiteSelect
