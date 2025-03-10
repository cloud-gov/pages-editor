import React from 'react'
import type { Payload } from 'payload'
import { getSiteId } from '@/access/preferenceHelper'
import { User, Site } from '@/payload-types'
import { Select, useField } from '@payloadcms/ui'
import { roles } from '@/collections/Users'


export default async function UserSite({
  payload, siblingData, schemaPath, indexPath, data
}: {
  payload: Payload,
  siblingData: User,
  schemaPath, indexPath, data
}) {
  const siteId = await getSiteId(payload, Number(siblingData.id))
  if (!siteId) return null
  const match = siblingData.sites?.find(s => (s.site as Site).id === siteId)
  if (!match) return null

  const roleOptions = roles.map(role => ({
    value: role,
    label: role
  }))

  const currentSiteOption = { value: match.role, label: match.role }

  return (
    <Select
        options={roleOptions}
        value={currentSiteOption}
        // onChange={(event) => onChange(event, setUserSite, setPreference)}
    />
  )
}
