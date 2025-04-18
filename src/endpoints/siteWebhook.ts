import type { Config, PayloadRequest } from 'payload'

const post: Required<Config>["endpoints"][number]["method"] = "post"

const endpoint = {
    path: '/webhooks/site/:id',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction, routeParams: { id?: string } }) => {
      // TODO: does this need separate auth or is the fact that we have
      // a shared encryption key okay
      const { id } = req.routeParams
      if (!id) return Response.json({ message: 'error' })
      const { siteId: pagesSiteId } = await req.json()
      try {
        const site = await req.payload.update({
          collection: 'sites',
          id: Number(req.routeParams.id),
          data: {
            pagesSiteId
          }
        })
        return Response.json(site)
      } catch (err) {
        console.error(err)
        // TODO: better response to pages but avoid leaking info if this
        // endpoint is open
        return Response.json({ message: 'error' })
      }
    }
}

export default endpoint
