import { expect, describe, afterEach, beforeEach, vi } from 'vitest'
import { test } from '@test/utils/test'
import { getSiteATUPackage } from './'

describe('getSiteATUPackage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // describe.only('managers can...', async () => {
  //   test.scoped({ defaultUserAdmin: false, defaultUserRole: 'manager' })

  //   test('see site ATU package', async ({ tid, testUser }) => {
  // 		await payload.db.commitTransaction(tid)
  //     vi.spyOn(payload, 'auth').mockResolvedValue({ user: testUser, permissions: {} })
  //     const atuPackage = await getSiteATUPackage(payload, {})

  //     expect(atuPackage).toBeDefined()
  //     expect(atuPackage.atuPackage).toBeDefined()
  //     expect(atuPackage.siteUsers).toBeDefined()
  //     expect(atuPackage.siteUsers.length).toBeGreaterThan(0)
  //   })
  // })

  describe('admins cannot...', async () => {
    test.scoped({ defaultUserAdmin: true })

    test('see site ATU package', async ({ testUser }) => {
      vi.spyOn(payload, 'auth').mockResolvedValue({ user: testUser, permissions: {} })
      await expect(getSiteATUPackage(payload, {})).rejects.toThrow()
    })
  })

  describe('users cannot...', async () => {
    test.scoped({ defaultUserAdmin: false, defaultUserRole: 'user' })

    test('see site ATU package', async ({ testUser }) => {
      vi.spyOn(payload, 'auth').mockResolvedValue({ user: testUser, permissions: {} })
      await expect(getSiteATUPackage(payload, {})).rejects.toThrow()
    })
  })
})
