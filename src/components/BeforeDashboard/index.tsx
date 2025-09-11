import React from 'react'

import './index.scss'
import SiteSelect from './SiteSelect'
import { BasePayload } from 'payload'
import { headers as nextHeaders } from 'next/headers'
import { Site } from '@/payload-types'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = async (props: { payload: BasePayload }) => {
  const { payload } = props;
  const headers = await nextHeaders()
  const { user, permissions } = await payload.auth({ headers })

  // don't render:
  // 1. without a user
  // 2. for admins
  // 3. with no sites
  if (!user || user?.isAdmin || !user.sites) return null

  // in server rendered components, we know the shape
  const sites = user.sites.map(site => site.site as Site)

  return (
    <div className={baseClass}>
      <SiteSelect sites={sites} selectedSiteId={user.selectedSiteId} />
      
      {/* Custom Dashboard Content */}
      <div style={{ padding: '2rem', marginTop: '2rem' }}>
        <h1>Dashboard</h1>
        
        {/* Collections */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Collections</h2>
          <div>
            <div>
              <a href="/admin/collections/posts" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Posts</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Blog posts and articles
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/news" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>News</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  News articles and announcements
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/events" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Events</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Events and calendar items
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/leadership" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Leadership</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Leadership team members
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/reports" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Resources</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Resources and documents
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Standalone Pages */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Standalone Pages</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/pages" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Pages</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Individual website pages
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/policies" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Policies</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Policies and procedures
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Global Assets */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Global Assets</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/media" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Media</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Images, documents, and media files
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/categories" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Categories</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Content categories and tags
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>User Management</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Users</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Team members and permissions
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Site Configuration */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Site Configuration</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1rem' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/collections/sites" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Sites</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Multi-site management
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/globals/site-config" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Site Identity</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Site settings and branding
                </p>
              </a>
            </div>
            <div style={{ 
              padding: '1.5rem', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <a href="/admin/globals/menu" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>Menu</h3>
                <p style={{ 
                  margin: '0.5rem 0 0 0', 
                  color: '#666', 
                  fontSize: '0.9rem' 
                }}>
                  Navigation menu configuration
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeforeDashboard
