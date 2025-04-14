import type { Site, User } from "@/payload-types"
import { BasePayload } from "payload"

export const siteIdHelper = (site: Site | number) => {
    if (typeof site === 'number') return site
    return site.id
}

export function getUserSiteIds(
    user: User
  ) {
    return user.sites.map(site => siteIdHelper(site.site))
  }
