import React from 'react'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { Site } from '@/payload-types'
import Link from 'next/link'
import SiteSelect from './SiteSelect'

const CustomDashboard: React.FC = async (props: { payload: BasePayload }) => {
  const { payload } = props
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })

  // Don't render without a user
  if (!user) return null

  // Get sites for non-admin users
  const sites = user?.isAdmin ? [] : user.sites?.map(site => site.site as Site) || []
  const selectedSiteId = user?.selectedSiteId?.toString()

  // Get all collections and globals from the config
  const config = payload.config

  // Hidden collections
  const hiddenCollections = [
    'reports',
  ]
  
  // Map collections to dashboard items
  const collections = config.collections?.map(collection => {
    // Handle label that could be string, function, or object
    let label: string = collection.slug
    if (collection.labels?.plural) {
      if (typeof collection.labels.plural === 'string') {
        label = collection.labels.plural
      } else if (typeof collection.labels.plural === 'function') {
        // For function labels, we'll use the slug as fallback since we can't execute the function here
        label = collection.slug
      } else if (typeof collection.labels.plural === 'object') {
        // For object labels, try to get a default value
        label = Object.values(collection.labels.plural)[0] || collection.slug
      }
    } else if (collection.labels?.singular) {
      if (typeof collection.labels.singular === 'string') {
        label = collection.labels.singular
      } else if (typeof collection.labels.singular === 'function') {
        // For function labels, we'll use the slug as fallback since we can't execute the function here
        label = collection.slug
      } else if (typeof collection.labels.singular === 'object') {
        // For object labels, try to get a default value
        label = Object.values(collection.labels.singular)[0] || collection.slug
      }
    }
    
    return {
      slug: collection.slug,
      label,
      description: collection.admin?.description || '',
      group: collection.admin?.group || 'Default',
      href: `/admin/collections/${collection.slug}`,
      type: 'collection' as const
    }
  }).filter(collection => {
    // Hide Sites collection for non-admin users
    if (collection.slug === 'sites' && !user?.isAdmin) {
      return false
    }
    // Don't show collection items flagged as hidden
    if(hiddenCollections.includes(collection.slug)) {
      return false
    }
    return true
  }) || []

  // Map globals to dashboard items
  const globals = config.globals?.map(global => {
    // Handle label that could be string, function, or object
    let label: string = global.slug
    if (global.label) {
      if (typeof global.label === 'string') {
        label = global.label
      } else if (typeof global.label === 'function') {
        // For function labels, we'll use the slug as fallback since we can't execute the function here
        label = global.slug
      } else if (typeof global.label === 'object') {
        // For object labels, try to get a default value
        label = Object.values(global.label)[0] || global.slug
      }
    }
    
    return {
      slug: global.slug,
      label,
      description: global.admin?.description || '',
      group: global.admin?.group || 'Default',
      href: `/admin/globals/${global.slug}`,
      type: 'global' as const
    }
  }) || []

  // Combine and group items
  const allItems = [...collections, ...globals]
  const groupedItems: { [key: string]: typeof allItems } = {}
  
  allItems.forEach(item => {
    const groupKey = typeof item.group === 'string' ? item.group : 'Default'
    if (!groupedItems[groupKey]) {
      groupedItems[groupKey] = []
    }
    groupedItems[groupKey].push(item)
  })

  const usersGroup = collections.find(c => c.slug === 'users')?.group || 'User Management'

  const rolesAndPermissionsPage = {
    slug: 'sites-roles-and-permissions',
    label: 'Site Roles and Permissions',
    description: 'Documentation on roles and permissions.',
    group: typeof usersGroup === 'string' ? usersGroup : 'User Management',
    href: '/admin/sites-roles-and-permissions',
  }

  if (!groupedItems[rolesAndPermissionsPage.group]) {
    groupedItems[rolesAndPermissionsPage.group] = []
  }

  const usersIdx = groupedItems[rolesAndPermissionsPage.group].findIndex(i => i.slug === 'users')
  if(usersIdx >= 0) {
    groupedItems[rolesAndPermissionsPage.group].splice(usersIdx + 1, 0, rolesAndPermissionsPage as any)
  } else {
    groupedItems[rolesAndPermissionsPage.group].push(rolesAndPermissionsPage as any)
  }

  // Define the order of groups
  const groupOrder = [
    'Content Collection',
    'Single Pages', 
    'Global Assets',
    'Analytics',
    'User Management',
    'Site Configuration'
  ]

  return (
    <div className="grid-container">
      <div className="grid-row margin-top-0">
        <div className="grid-col-12">
          <h1 className="usa-sr-only">Dashboard</h1>
        </div>
      </div>
      
      {/* Site Selection for users with multiple sites */}
      {sites.length > 1 && (
        <div className="grid-row margin-top-0 margin-bottom-4">
          <div className="grid-col-12">
            <SiteSelect sites={sites} selectedSiteId={selectedSiteId} />
          </div>
        </div>
      )}
      
      {groupOrder.map(groupName => {
        const items = groupedItems[groupName]
        if (!items || items.length === 0) return null

        return (
          <div key={groupName} className="margin-bottom-4">
            <h2 className="margin-bottom-2">{groupName}</h2>
            <div className="grid-row grid-gap-2">
              {items.map(item => (
                <div key={item.slug} className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
                  <Link href={item.href} className="usa-card__link">
                    <div className="usa-card">
                      <div className="usa-card__container">
                        <div className="usa-card__header">
                          <div className="display-flex flex-justify-between flex-align-center">
                            <h3 className="usa-card__heading margin-0">
                                {item.label}
                            </h3>
                            <span className="dashboard-card-icon" aria-hidden="true">+</span>
                          </div>
                        </div>
                        {item.description && (
                          <div className="usa-card__body">
                            <span className="usa-sr-only">Description: </span>
                            <p>{typeof item.description === 'string' ? item.description : ''}</p>
                          </div>
                        )}
                      </div>
                  </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CustomDashboard
