import type { Site } from "@/payload-types"

export const siteIdHelper = (site: Site | number) => {
    if (typeof site === 'number') return site
    return site.id
}
