import { decrypt } from '@/utilities/encryptor'
import type { Config, PayloadRequest } from 'payload'

const post: Required<Config>["endpoints"][number]["method"] = "post"

const endpoint = {
    path: '/webhook/buildStatus/:buildId',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction, routeParams: { id?: string } }) => {
      const { buildId } = req.routeParams
      if (!buildId) return Response.json({ message: 'error' })
      const {
        pagesSiteId: encryptedPagesSiteId,
        state: encryptedState,
        startedAt: encryptypedStartedAt,
        completedAt: encryptypedCompletedAt,
        error: encryptypedError
      } = await req.json()
      try {
        const pagesSiteId = Number(decrypt(encryptedPagesSiteId, process.env.PAGES_ENCRYPTION_KEY))
        const state = decrypt(encryptedState, process.env.PAGES_ENCRYPTION_KEY)
        const startedAt = decrypt(encryptypedStartedAt, process.env.PAGES_ENCRYPTION_KEY)
        const completedAt = decrypt(encryptypedCompletedAt, process.env.PAGES_ENCRYPTION_KEY)
        const error = decrypt(encryptypedError, process.env.PAGES_ENCRYPTION_KEY)

        const site = await req.payload.findByID({
          collection: 'sites',id: pagesSiteId
        })
        
        if(!site){
          return Response.json({ message: `Site ${pagesSiteId} not found` })
        }
        
        const publishedBuildStatusExists = await req.payload.find({
          collection:'published-build-status',
          where: {
            and: [{ pagesBuildId: { equals: buildId } }, { pagesSiteId: { equals: site.id } }],
          },
          req
        })
        
        if(!publishedBuildStatusExists || publishedBuildStatusExists.totalDocs === 0){
          const publishedBuildStatus = await req.payload.create({
            collection: 'published-build-status',
            data: {
              site,
              startedAt,
              completedAt,
              state,
              pagesBuildId: Number(buildId),
              error
            }
          })
          return Response.json(publishedBuildStatus)
      }else{
        const updatedUser = await req.payload.update({
          collection: 'published-build-status',
          id: publishedBuildStatusExists[0].id,
          data: {
            completedAt,
            error,
            state,
          },
          req
        })
        return Response.json(updatedUser)
      }
        
      } catch (err) {
        console.error(err)
        return Response.json({ message: 'error updating site' })
      }
    }
}

export default endpoint
