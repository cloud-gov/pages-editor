import { PayloadPreference, User } from "@/payload-types";
import { BasePayload } from "payload";

const siteKey = 'site-key'

//  we need to check against the "selected" site from user preferences
// TODO: this will become easier after https://github.com/payloadcms/payload/pull/9511
// is merged

export async function getSiteId (payload: BasePayload, userId: number): Promise<number | undefined> {
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
      })
     return siteIds.docs.length ? siteIds.docs[0].value as number : undefined
}
