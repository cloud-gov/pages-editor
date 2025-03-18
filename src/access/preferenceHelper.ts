import { User, Site } from "@/payload-types";
import { PayloadRequest } from "payload";
import { siteIdHelper } from "@/utilities/idHelper";

const siteKey = 'site-key'

//  we need to check against the "selected" site from user preferences
// TODO: this will become easier after https://github.com/payloadcms/payload/pull/9511
// is merged

export async function getSiteId (req: PayloadRequest, userId: number): Promise<number | undefined> {
  const { payload } = req;
  const siteIds = await payload.find({
        collection: 'payload-preferences',
        limit: 1,
        where: {
          and: [
            {
              key: {
                equals: siteKey,
              },
            },
            {
              'user.relationTo': {
                equals: 'users',
              },
            },
            {
              'user.value': {
                equals: userId,
              },
            },
          ],
        },
        req
      })
     return siteIds.docs.length ? siteIds.docs[0].value as number : undefined
}

export async function setUserSite(req: PayloadRequest, user: User, site: Site | number) {
    const { payload } = req;
    return payload.create({
        collection: 'payload-preferences',
        data: {
          key: siteKey,
          user: {
            relationTo: 'users',
            value: user.id
          },
          value: siteIdHelper(site)
        },
        req
      })
}
