'use client'

import { useAuth } from '@payloadcms/ui'

const VirtualRoleCell = ({ rowData }) => {
  const { user } = useAuth()
  if (!user) return ''
  if (user.isAdmin) {
    return (
      <>
      {rowData.sites.map(site => (
        <div key={site.site} className='pill pill--style-light pill-size-small'>
          <span className='pill__label'>{site.site}: {site.role}</span>
        </div>
      ))}
      </>
    )
  }
  return rowData.sites[0].role
}

export default VirtualRoleCell
