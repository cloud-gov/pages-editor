'use client'
import { siteIdHelper } from "@/utilities/idHelper"
import { useAuth } from "@payloadcms/ui"

const SiteCell = ({ cellData }) => {
  const { user } = useAuth()
  if (!user) return null
  if (user.isAdmin) return cellData.map(site => (
    <div key={siteIdHelper(site.site)} className="pill pill--style-light pill--size-small">
      <span className='pill-label'>{siteIdHelper(site.site)}: {site.role}</span>
      </div>)
  )
  const siteId = user.selectedSiteId
  const role = cellData.find(site => siteIdHelper(site.site) === siteId)
  if (!role) return null
  return role.role
}

export default SiteCell
