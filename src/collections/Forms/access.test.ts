import { expect, describe } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import { SiteForm } from '@/payload-types'
import type { CollectionSlug } from 'payload'

const siteFormsCollectionName: CollectionSlug = 'site-forms' as CollectionSlug

const fieldsToFill: Pick<SiteForm, 'title' | '_status' | 'fields' | 'settings'> = {
  title: 'Test Form',
  _status: 'draft',
  fields: [
    {
      fieldType: 'text',
      name: 'full_name',
      label: 'Full Name',
      required: true,
    },
    {
      fieldType: 'email',
      name: 'email',
      label: 'Email Address',
      required: true,
    },
    {
      fieldType: 'textarea',
      name: 'message',
      label: 'Message',
      required: false,
    },
  ],
  settings: {
    submitButtonText: 'Submit',
    successMessage: 'Thank you for your submission!',
  },
}

describe('SiteForms access', () => {
  describe('admins can...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('read all SiteForms', async ({ tid, testUser, siteForms }) => {
      const foundForms = await find(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
        },
        testUser,
      )
      expect(foundForms.docs).toHaveLength(siteForms.length)
    })

    test('write a Form to any site', async ({ tid, testUser, sites }) => {
      const newForms = await Promise.all(
        sites.map(async (site) => {
          return create(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              data: {
                ...fieldsToFill,
              },
            },
            testUser,
          )
        }),
      )

      expect(newForms).toHaveLength(sites.length)
    })

    test('update any Form', async ({ tid, testUser, siteForms }) => {
      const newForms = await Promise.all(
        siteForms.map(async (form) => {
          return update(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              id: form.id,
              data: {
                title: `${form.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newForms.forEach((form) => {
        expect(form.title).toContain('Edited')
      })
    })

    test('delete any Form', async ({ tid, testUser, siteForms }) => {
      await Promise.all(
        siteForms.map(async (form) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              id: form.id,
            },
            testUser,
          )
        }),
      )

      const foundForms = await find(payload, tid, {
        collection: siteFormsCollectionName,
      })
      expect(foundForms.docs.length).toBe(0)
    })
  })

  describe('site users can...', async () => {
    test.scoped({ defaultUserAdmin: false })

    test('read their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const foundForms = await find(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
        },
        testUser,
      )

      const expectedForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === siteId,
      )

      expect(foundForms.docs).toHaveLength(expectedForms.length)
      foundForms.docs.forEach((form) => {
        expect(siteIdHelper(form.site)).toBe(siteId)
      })
    })

    test('not read not-their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const notTheirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) !== siteId,
      )

      await Promise.all(
        notTheirForms.map(async (form) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                id: form.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('write a Form to their site', async ({ tid, testUser }) => {
      const siteId = testUser.selectedSiteId

      const newForm = await create(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
          data: {
            ...fieldsToFill,
            title: `Form Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newForm).toBeTruthy()
    })

    test('not write a Form to not-their site', async ({ tid, testUser, sites }) => {
      const siteId = testUser.selectedSiteId

      const notTheirSites = sites.filter((site) => site.id !== siteId)

      await Promise.all(
        notTheirSites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                data: {
                  ...fieldsToFill,
                  title: `${site.name} - Title`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('update their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const theirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === siteId,
      )

      const newForms = await Promise.all(
        theirForms.map(async (form) => {
          return update(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              id: form.id,
              data: {
                title: `${form.title} (Edited)`,
              },
            },
            testUser,
          )
        }),
      )

      newForms.forEach((form) => {
        expect(form.title).toContain('Edited')
      })
    })

    test('not update not-their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const notTheirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) !== siteId,
      )

      await Promise.all(
        notTheirForms.map(async (form) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                id: form.id,
                data: {
                  title: `${form.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('delete their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const theirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === siteId,
      )

      await Promise.all(
        theirForms.map((form) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              id: form.id,
            },
            testUser,
          )
        }),
      )

      const foundForms = await find(payload, tid, {
        collection: siteFormsCollectionName,
      })
      expect(foundForms.docs.length).toBe(siteForms.length - theirForms.length)
    })

    test('not delete not-their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const notTheirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) !== siteId,
      )

      await Promise.all(
        notTheirForms.map(async (form) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                id: form.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })

  describe('site users with multiple sites can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

    const addSiteToUser = async (user, tid, site) => {
      return update(payload, tid, {
        collection: 'users',
        id: user.id,
        data: {
          sites: [...user.sites, site],
        },
      })
    }

    test('read all their Forms, upon site selection', async ({
      tid,
      testUser,
      siteForms,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'user' })
      const siteId = testUser.selectedSiteId

      let foundForms = await find(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
        },
        testUser,
      )

      let expectedForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === siteId,
      )

      expect(foundForms.docs).toHaveLength(expectedForms.length)
      foundForms.docs.forEach((form) => {
        expect(siteIdHelper(form.site)).toBe(siteId)
      })

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      foundForms = await find(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
        },
        testUser,
      )

      expectedForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === newSiteId,
      )

      expect(foundForms.docs).toHaveLength(expectedForms.length)
      foundForms.docs.forEach((form) => {
        expect(siteIdHelper(form.site)).toBe(newSiteId)
      })
    })

    test('create a Form for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      let newForm = await create(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
          data: {
            ...fieldsToFill,
            title: `Form Title - ${siteId}`,
            site: siteId,
          },
        },
        testUser,
      )

      expect(newForm).toBeTruthy()
      expect(siteIdHelper(newForm.site)).toBe(siteId)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      newForm = await create(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
          data: {
            ...fieldsToFill,
            title: `Form Title - ${newSiteId}`,
            site: newSiteId,
          },
        },
        testUser,
      )

      expect(siteIdHelper(newForm.site)).toBe(newSiteId)
    })

    test('delete a Form for all their sites, upon site selection', async ({
      tid,
      testUser,
      sites,
      siteForms,
    }) => {
      testUser = await addSiteToUser(testUser, tid, { site: sites[1], role: 'manager' })
      const siteId = testUser.selectedSiteId

      const theirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === siteId,
      )

      await Promise.all(
        theirForms.map((form) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              id: form.id,
            },
            testUser,
          )
        }),
      )

      let foundForms = await find(payload, tid, {
        collection: siteFormsCollectionName,
      })
      expect(foundForms.docs.length).toBe(siteForms.length - theirForms.length)

      // switch site
      testUser = await setUserSite(payload, tid, testUser, sites[1].id)
      const newSiteId = testUser.selectedSiteId

      const moreForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === newSiteId,
      )

      await Promise.all(
        moreForms.map((form) => {
          return del(
            payload,
            tid,
            {
              collection: siteFormsCollectionName,
              id: form.id,
            },
            testUser,
          )
        }),
      )

      foundForms = await find(payload, tid, {
        collection: siteFormsCollectionName,
      })
      expect(foundForms.docs.length).toBe(
        siteForms.length - theirForms.length - moreForms.length,
      )
    })
  })

  describe('bots can...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'bot' })

    test('read their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const foundForms = await find(
        payload,
        tid,
        {
          collection: siteFormsCollectionName,
        },
        testUser,
      )

      const expectedForms = siteForms.filter(
        (form) => siteIdHelper(form.site) === siteId,
      )

      expect(foundForms.docs).toHaveLength(expectedForms.length)
      foundForms.docs.forEach((form) => {
        expect(siteIdHelper(form.site)).toBe(siteId)
      })
    })

    test('not read not-their Forms', async ({ tid, testUser, siteForms }) => {
      const siteId = testUser.selectedSiteId

      const notTheirForms = siteForms.filter(
        (form) => siteIdHelper(form.site) !== siteId,
      )

      await Promise.all(
        notTheirForms.map(async (form) => {
          return notFoundError(
            findByID(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                id: form.id,
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not write a Form', async ({ tid, testUser, sites }) => {
      await Promise.all(
        sites.map(async (site) => {
          return isAccessError(
            create(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                data: {
                  ...fieldsToFill,
                  title: `${site.name} - Title`,
                  site,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not update Forms', async ({ tid, testUser, siteForms }) => {
      await Promise.all(
        siteForms.map(async (form) => {
          return isAccessError(
            update(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                id: form.id,
                data: {
                  title: `${form.title} (Edited)`,
                },
              },
              testUser,
            ),
          )
        }),
      )
    })

    test('not delete Forms', async ({ tid, testUser, siteForms }) => {
      await Promise.all(
        siteForms.map(async (form) => {
          return isAccessError(
            del(
              payload,
              tid,
              {
                collection: siteFormsCollectionName,
                id: form.id,
              },
              testUser,
            ),
          )
        }),
      )
    })
  })
})
