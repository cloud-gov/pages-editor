import type { Config, PayloadRequest } from 'payload'
import { getUserSiteIds } from '@/utilities/idHelper'

const post: Required<Config>["endpoints"][number]["method"] = "post"

const endpoint = {
    path: '/siteSelect',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction }) => {
      if (!req.user) {
        return Response.json({ error: 'forbidden' }, { status: 403 })
      }

      const data = await req.json()

      if (!getUserSiteIds(req.user).includes(data.value)) {
        return Response.json({ error: 'forbidden' }, { status: 403 })
      }

      await req.payload.update({
        collection: 'users',
        id: req.user.id,
        data: {
          selectedSiteId: data.value
        }
      })

      return Response.json({ message: 'ok' })
    }
}

export default endpoint
