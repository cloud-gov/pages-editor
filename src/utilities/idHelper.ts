import type { Site, User } from "@/payload-types"

export const siteIdHelper = (site: Site | number) => {
    if (typeof site === 'number') return site
    return site.id
}

export function getUserSiteIds(
    user: User
  ) {
    // this theoretically can't happen but technically can
    if (!user.sites) return []
    return user.sites.map(site => siteIdHelper(site.site))
  }
