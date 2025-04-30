import { decrypt } from '@/utilities/encryptor'
import type { Config, PayloadRequest } from 'payload'

const post: Required<Config>["endpoints"][number]["method"] = "post"

const endpoint = {
    path: '/webhook/site/:id',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction, routeParams: { id?: string } }) => {
      const { id } = req.routeParams
      if (!id) return Response.json({ message: 'error' })
      const {
        siteId: encryptedPagesSiteId,
        orgId: encryptedOrgId,
        bucket: encryptypedBucketName
      } = await req.json()
      try {
        const pagesSiteId = Number(decrypt(encryptedPagesSiteId, process.env.PAGES_ENCRYPTION_KEY))
        const orgId = Number(decrypt(encryptedOrgId, process.env.PAGES_ENCRYPTION_KEY))
        const bucket = decrypt(encryptypedBucketName, process.env.PAGES_ENCRYPTION_KEY)

        const site = await req.payload.update({
          collection: 'sites',
          id: Number(req.routeParams.id),
          data: {
            pagesSiteId,
            orgId,
            bucket
          }
        })
        return Response.json(site)
      } catch (err) {
        console.error(err)
        return Response.json({ message: 'error updating site' })
      }
    }
}

export default endpoint
