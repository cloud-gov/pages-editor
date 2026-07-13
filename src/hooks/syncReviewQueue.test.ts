import { expect, describe } from 'vitest'
import { create, find, update, del } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'

const REVIEW_QUEUE = 'review-queue'

async function findQueueRows(
  tid: string | number,
  sourceCollection: string,
  sourceId: number | string,
) {
  return find(payload, tid, {
    collection: REVIEW_QUEUE,
    where: {
      and: [
        { sourceCollection: { equals: sourceCollection } },
        { sourceId: { equals: String(sourceId) } },
      ],
    },
    depth: 0,
  })
}

describe('syncReviewQueue hook', () => {
  test('creates a queue row when a page is marked reviewReady', async ({
    tid,
    sites,
  }) => {
    const site = sites[0]
    const page = await create(payload, tid, {
      collection: 'pages',
      data: {
        title: 'Review Me',
        site,
        reviewReady: true,
      },
    })

    const rows = await findQueueRows(tid, 'pages', page.id)
    expect(rows.docs).toHaveLength(1)

    const row = rows.docs[0]
    expect(row.title).toBe('Review Me')
    expect(row.contentType).toBe('Page')
    expect(row.sourceCollection).toBe('pages')
    expect(row.sourceId).toBe(String(page.id))
    expect(row.editUrl).toBe(`/admin/collections/pages/${page.id}`)
    expect(siteIdHelper(row.site)).toBe(site.id)
  })

  test('does not create a row when reviewReady is false', async ({ tid, sites }) => {
    const page = await create(payload, tid, {
      collection: 'pages',
      data: {
        title: 'Not Ready',
        site: sites[0],
        reviewReady: false,
      },
    })

    const rows = await findQueueRows(tid, 'pages', page.id)
    expect(rows.docs).toHaveLength(0)
  })

  test('removes the queue row when reviewReady is set back to false', async ({
    tid,
    sites,
  }) => {
    const page = await create(payload, tid, {
      collection: 'pages',
      data: { title: 'Toggle', site: sites[0], reviewReady: true },
    })

    expect((await findQueueRows(tid, 'pages', page.id)).docs).toHaveLength(1)

    await update(payload, tid, {
      collection: 'pages',
      id: page.id,
      data: { reviewReady: false },
    })

    expect((await findQueueRows(tid, 'pages', page.id)).docs).toHaveLength(0)
  })

  test('publishing resets reviewReady to false and removes the queue row', async ({
    tid,
    sites,
  }) => {
    const page = await create(payload, tid, {
      collection: 'pages',
      data: { title: 'Publish Me', site: sites[0], reviewReady: true },
    })

    expect((await findQueueRows(tid, 'pages', page.id)).docs).toHaveLength(1)

    const published = await update(payload, tid, {
      collection: 'pages',
      id: page.id,
      data: { _status: 'published', reviewReady: true },
    })

    expect(published.reviewReady).toBe(false)
    expect((await findQueueRows(tid, 'pages', page.id)).docs).toHaveLength(0)
  })

  test('updates the queue row title/lastModified on subsequent edits', async ({
    tid,
    sites,
  }) => {
    const page = await create(payload, tid, {
      collection: 'pages',
      data: { title: 'Original Title', site: sites[0], reviewReady: true },
    })

    await update(payload, tid, {
      collection: 'pages',
      id: page.id,
      data: { title: 'Renamed Title', reviewReady: true },
    })

    const rows = await findQueueRows(tid, 'pages', page.id)
    expect(rows.docs).toHaveLength(1)
    expect(rows.docs[0].title).toBe('Renamed Title')
  })

  test('removes the queue row when the source doc is deleted', async ({
    tid,
    sites,
  }) => {
    const page = await create(payload, tid, {
      collection: 'pages',
      data: { title: 'Delete Me', site: sites[0], reviewReady: true },
    })

    expect((await findQueueRows(tid, 'pages', page.id)).docs).toHaveLength(1)

    await del(payload, tid, { collection: 'pages', id: page.id })

    expect((await findQueueRows(tid, 'pages', page.id)).docs).toHaveLength(0)
  })

  test('uses the specific collection type name for collection entries', async ({
    tid,
    sites,
  }) => {
    const site = sites[0]

    const collectionType = await create(payload, tid, {
      collection: 'collection-types',
      data: { title: 'Reports', site },
    })

    const entry = await create(payload, tid, {
      collection: 'collection-entries',
      data: {
        title: 'Quarterly Report',
        collectionType: collectionType.id,
        site,
        reviewReady: true,
      },
    })

    const rows = await findQueueRows(tid, 'collection-entries', entry.id)
    expect(rows.docs).toHaveLength(1)
    expect(rows.docs[0].contentType).toBe('Reports')
  })

  test('is only scoped to the docs site', async ({ tid, sites }) => {
    const page = await create(payload, tid, {
      collection: 'pages',
      data: { title: 'Scoped', site: sites[1], reviewReady: true },
    })

    const rows = await findQueueRows(tid, 'pages', page.id)
    expect(rows.docs).toHaveLength(1)
    expect(siteIdHelper(rows.docs[0].site)).toBe(sites[1].id)
  })
})
