import { expect, describe } from 'vitest'
import { create, find, findByID, update, del } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError } from '@test/utils/errors'

const REVIEW_QUEUE = 'review-queue'

// Seed the queue by flagging a page reviewReady on each site. Queue rows are
// created by the syncReviewQueue hook, mirroring how the feature works in
// production (rows are owned by the hook, not created by hand).
async function seedQueue(tid: string | number, sites: { id: number; name: string }[]) {
  return Promise.all(
    sites.map(async (site) => {
      const page = await create(payload, tid, {
        collection: 'pages',
        data: {
          title: `${site.name} Review Item`,
          site: site.id,
          reviewReady: true,
        },
      })
      return page
    }),
  )
}

async function findAllQueue(tid: string | number, user?: any) {
  return find(
    payload,
    tid,
    {
      collection: REVIEW_QUEUE,
      depth: 0,
      limit: 100,
    },
    user,
  )
}

describe('Review Queue access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all review queue items', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)

      const found = await findAllQueue(tid, testUser)
      expect(found.docs.length).toBe(sites.length)
    })

    test('delete a review queue item', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)

      const found = await findAllQueue(tid, testUser)
      const item = found.docs[0]

      await del(payload, tid, { collection: REVIEW_QUEUE, id: item.id }, testUser)

      const after = await findAllQueue(tid, testUser)
      expect(after.docs.length).toBe(sites.length - 1)
    })
  })

  describe('managers can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

    test('read only their site review queue items', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)
      const siteId = testUser.selectedSiteId

      const found = await findAllQueue(tid, testUser)

      const expected = sites.filter((s) => s.id === siteId)
      expect(found.docs).toHaveLength(expected.length)
      found.docs.forEach((item) => {
        expect(siteIdHelper(item.site)).toBe(siteId)
      })
    })

    test('not create a review queue item', async ({ tid, testUser, sites }) => {
      await isAccessError(
        create(
          payload,
          tid,
          {
            collection: REVIEW_QUEUE,
            data: {
              title: 'Manual',
              contentType: 'Page',
              sourceCollection: 'pages',
              sourceId: '1',
              editUrl: '/admin/collections/pages/1',
              lastModified: new Date().toISOString(),
              site: sites[0].id,
            },
          },
          testUser,
        ),
      )
    })

    test('not update a review queue item', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)
      const found = await findAllQueue(tid, testUser)
      const item = found.docs[0]

      await isAccessError(
        update(
          payload,
          tid,
          {
            collection: REVIEW_QUEUE,
            id: item.id,
            data: { title: 'Tampered' },
          },
          testUser,
        ),
      )
    })

    test('not delete a review queue item', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)
      const found = await findAllQueue(tid, testUser)
      const item = found.docs[0]

      await isAccessError(
        del(payload, tid, { collection: REVIEW_QUEUE, id: item.id }, testUser),
      )
    })
  })

  describe('non-manager site users can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

    test('not read review queue items', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)

      // getAdminOrSiteUser returns false for non-manager roles -> no access,
      // so find throws a Forbidden error rather than returning data.
      await isAccessError(findAllQueue(tid, testUser))
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('not read review queue items', async ({ tid, testUser, sites }) => {
      await seedQueue(tid, sites)

      await isAccessError(findAllQueue(tid, testUser))
    })
  })
})
