import React from 'react'
import { Site } from '@/payload-types'

interface SiteSelectProps {
  sites: Site[]
  selectedSiteId?: string
}

const SiteSelect: React.FC<SiteSelectProps> = ({ sites, selectedSiteId }) => {
  // Don't render for admins or if no sites
  if (sites.length === 0) return null

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Select Site</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {sites.map(site => (
          <a
            key={site.id}
            href={`/admin?site=${site.id}`}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedSiteId === site.id ? '#0070f3' : '#fff',
              color: selectedSiteId === site.id ? '#fff' : '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            {site.title}
          </a>
        ))}
      </div>
    </div>
  )
}

export default SiteSelect
