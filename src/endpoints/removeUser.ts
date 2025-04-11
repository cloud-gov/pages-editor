import type { Config, PayloadRequest } from 'payload'
import { siteIdHelper } from '@/utilities/idHelper'
import { isRoleForSelectedSite } from '@/utilities/access';

const post: Required<Config>["endpoints"][number]["method"] = "post"

const endpoint = {
    path: '/removeUser',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction }) => {
      const { user } = req;
      if (!user) {
        return Response.json({ error: 'forbidden' }, { status: 403 })
      }

      const { siteId, userId } = await req.json()

      if (!isRoleForSelectedSite(user, ['manager'])) {
        return Response.json({ error: 'forbidden' }, { status: 403 })
      }

      const userToRemove = await req.payload.findByID({
        collection: 'users',
        id: userId
      })

      // without any remaining site access we remove the user
      const newSitesArray = userToRemove.sites.filter(site => siteIdHelper(site.site) !== siteId)
      if (newSitesArray.length === 0) {
        await req.payload.delete({
          collection: 'users',
          id: userId
        })
      } else {
        await req.payload.update({
          collection: 'users',
          id: userId,
          data: {
            sites: newSitesArray
          }
        })
      }

      return Response.json({ message: 'ok' })
    }
}

export default endpoint
