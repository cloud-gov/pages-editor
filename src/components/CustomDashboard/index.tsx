import React from 'react'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { Site } from '@/payload-types'
import SiteSelect from './SiteSelect'

const CustomDashboard: React.FC = async (props: { payload: BasePayload }) => {
  const { payload } = props
  const headers = await nextHeaders()
  const { user, permissions } = await payload.auth({ headers })

  // Don't render without a user
  if (!user) return null

  // Get sites for non-admin users
  const sites = user?.isAdmin ? [] : user.sites?.map(site => site.site as Site) || []

  // Get all collections and globals from the config
  const config = payload.config
  
  // Map collections to dashboard items
  const collections = config.collections?.map(collection => ({
    slug: collection.slug,
    label: collection.labels?.plural || collection.labels?.singular || collection.slug,
    description: collection.admin?.description || '',
    group: collection.admin?.group || 'Default',
    href: `/admin/collections/${collection.slug}`,
    type: 'collection' as const
  })) || []

  // Map globals to dashboard items
  const globals = config.globals?.map(global => ({
    slug: global.slug,
    label: global.labels?.plural || global.labels?.singular || global.slug,
    description: global.admin?.description || '',
    group: global.admin?.group || 'Default',
    href: `/admin/globals/${global.slug}`,
    type: 'global' as const
  })) || []

  // Combine and group items
  const allItems = [...collections, ...globals]
  const groupedItems: { [key: string]: typeof allItems } = {}
  
  allItems.forEach(item => {
    if (!groupedItems[item.group]) {
      groupedItems[item.group] = []
    }
    groupedItems[item.group].push(item)
  })

  // Define the order of groups (matching your Information Architecture)
  const groupOrder = [
    'Collections',
    'Standalone Pages', 
    'Global Assets',
    'Analytics',
    'User Management',
    'Site Configuration'
  ]

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col-12">
          <SiteSelect sites={sites} selectedSiteId={user.selectedSiteId?.toString()} />
        </div>
      </div>
      
      <div className="grid-row">
        <div className="grid-col-12">
          <h1>Dashboard</h1>
        </div>
      </div>
      
      {groupOrder.map(groupName => {
        const items = groupedItems[groupName]
        if (!items || items.length === 0) return null

        return (
          <div key={groupName} className="grid-row">
            <div className="grid-col-12">
              <h2>{groupName}</h2>
            </div>
            <div className="grid-col-12">
              <div className="grid-row">
                {items.map(item => (
                  <div key={item.slug} className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                    <div className="usa-card">
                      <div className="usa-card__container">
                        <div className="usa-card__header">
                          <h3 className="usa-card__heading">
                            <a href={item.href} className="usa-link">
                              {item.label}
                            </a>
                          </h3>
                        </div>
                        {item.description && (
                          <div className="usa-card__body">
                            <p>{item.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CustomDashboard
