import { decrypt } from '@/utilities/encryptor'
import type { Config, PayloadRequest } from 'payload'
import { isNotEmpty } from '@/utilities/validators/object'

const post: Required<Config>["endpoints"][number]["method"] = "post"

const endpoint = {
    path: '/webhook/buildStatus/:buildId',
    method: post,
    handler: async (req: PayloadRequest & { json: CallableFunction, routeParams: { buildId?: string } }) => {
      const { buildId } = req.routeParams

      try {
        if (!buildId) return Response.json({ message: 'Build id not provided' }, { status: 400 })

        const {
          pagesSiteId: encryptedPagesSiteId,
          state: encryptedState,
          startedAt: encryptypedStartedAt,
          completedAt: encryptypedCompletedAt,
          error: encryptypedError
        } = await req.json()

        if (!encryptedPagesSiteId) return Response.json({ message: 'Pages site id not provided' }, { status: 400 });

        let state;
        let startedAt;
        let completedAt;
        let error;

        const pagesSiteId = Number(decrypt(encryptedPagesSiteId, process.env.PAGES_ENCRYPTION_KEY))
        if(isNotEmpty(encryptedState)){
          state = decrypt(encryptedState, process.env.PAGES_ENCRYPTION_KEY)
        }
        if(isNotEmpty(encryptypedStartedAt)){
          startedAt = decrypt(encryptypedStartedAt, process.env.PAGES_ENCRYPTION_KEY)
        }
         if(isNotEmpty(encryptypedCompletedAt)){
           completedAt = decrypt(encryptypedCompletedAt, process.env.PAGES_ENCRYPTION_KEY)
         }
       if(isNotEmpty(encryptypedError)){
          error = decrypt(encryptypedError, process.env.PAGES_ENCRYPTION_KEY)
        }

        const foundSite = await req.payload.findByID({
          collection: 'sites',id: pagesSiteId
        })

        if(!foundSite){
          return Response.json({ message: `Site ${pagesSiteId} not found` }, { status: 404 })
        }
        
        const publishedBuildStatusExists = await req.payload.find({
          collection:'published-build-status',
          where: {
            and: [{ pagesBuildId: { equals: buildId } }, { pagesSiteId: { equals: foundSite.id } }],
          },
          req
        })
  
        if(!publishedBuildStatusExists || publishedBuildStatusExists.totalDocs === 0){
          const publishedBuildStatus = await req.payload.create({
            collection: 'published-build-status',
            data: {
              site: foundSite,
              startedAt,
              completedAt,
              state,
              pagesBuildId: Number(buildId),
              error,
              pagesSiteId: Number(foundSite.id),
            }
          })
          return Response.json(publishedBuildStatus)
        }else{
          const updatedUser = await req.payload.update({
            collection: 'published-build-status',
            id: publishedBuildStatusExists.docs[0].id,
            data: {
              startedAt,
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
        return Response.json({ message: 'error updating site' }, { status: 500 })
      }
    }
}

export default endpoint
