import { User } from "@/payload-types"
import { siteIdHelper } from "./idHelper"

// common access patterns

export type Role = NonNullable<Required<User>["sites"]>[number]["role"]

function isRoleForSelectedSite (user: User, roles: Role[]) {
    const siteId = user.selectedSiteId
    const matchedSite = user.sites.find(site => siteIdHelper(site.site) === siteId)
    return matchedSite && roles.includes(matchedSite.role)
}

export { isRoleForSelectedSite }
