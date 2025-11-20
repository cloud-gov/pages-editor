import { expect, describe, beforeAll } from 'vitest'
import { create, find, update, del } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { FooterSiteCollection } from '@/payload-types'
import  { CollectionSlug, Payload } from 'payload'
import { globalBeforeAll, initGlobalTest, testRead, testUpdate } from '@test/utils/globals'

const footerCollectionName: CollectionSlug = 'footer-site-collection' as CollectionSlug

const fieldsToFill: Pick<FooterSiteCollection, 'domain' | 'id' | 'content'> = {
  id: 1,
  domain: 'GSA.gov',
  content: {
    "root": {
      "type": "root",
      "format": "",
      "indent": 0,
      "version": 1,
      "children": [
        {
          "type": "paragraph",
          "format": "",
          "indent": 0,
          "version": 1,
          "children": [
            {
              "mode": "normal",
              "text": "Footer Text",
              "type": "text",
              "style": "",
              "detail": 0,
              "format": 0,
              "version": 1
            }
          ],
          "direction": "ltr",
          "textStyle": "",
          "textFormat": 0
        }
      ],
      "direction": "ltr"
    }
  },
}

describe('Footers access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all Footers', async ({ tid, testUser, footerSiteCollection }) => {
      const foundFooters = await find(
        payload,
        tid,
        {
          collection: footerCollectionName,
        },
        testUser,
      )
      expect(foundFooters.docs).toHaveLength(footerSiteCollection.length)
    })

    test('write a Footer to any site', async ({ tid, testUser, sites }) => {
      const newFooters = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: footerCollectionName,
              data: {
                ...fieldsToFill,
                site
              },
            },
            testUser,
          )
        }),
      )

      expect(newFooters).toHaveLength(sites.length)
    })

    test('update any Footer', async ({ tid, testUser, footerSiteCollection }) => {
      const newFooters = await Promise.all(
        footerSiteCollection.map(async (footer) => {
          return update(
            payload,
            tid,
            {
              collection: footerCollectionName,
              id: footer.id,
              data: {
                domain: `${footer.domain} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newFooters.forEach((footer) => {
        expect(footer.domain).toContain('Edited')
      })
    })

    test('delete any Footer', async ({ tid, testUser, footerSiteCollection }) => {
      await Promise.all(
        footerSiteCollection.map(async (footer) => {
          return del(
            payload,
            tid,
            {
              collection: footerCollectionName,
              id: footer.id,
            },
            testUser,
          )
        }),
      )

      const foundFooters = await find(payload, tid, {
        collection: footerCollectionName,
      })
      expect(foundFooters.docs.length).toBe(0)
    })

  })
})

let payload2: Payload
let users = initGlobalTest()

describe('Footer global access', () => {
  let slug = 'footer'
  let globalCollectionName = 'footer-site-collection'
  let field = 'domain'
  let options = {
    [field]: 'Test Value New',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                mode: 'normal',
                text: 'Footer Text',
                type: 'text',
                style: '',
                detail: 0,
                format: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            textStyle: '',
            textFormat: 0,
          },
        ],
        direction: 'ltr',
      },
    },
  }

  beforeAll(async () => {
    payload2 = await globalBeforeAll(
      payload2,
      users,
      slug,
      globalCollectionName,
      { ...options, [field]: 'Test Value New' },
      { ...options, [field]: 'Test Value Updated' },
    )
  })

  describe('read', testRead(slug, field, users))
  describe(
    'update',
    testUpdate(
      slug,
      field,
      { ...options, [field]: 'Agency Name' },
      users,
    ),
  )
})

