import { expect, describe, beforeAll, vi, afterAll } from 'vitest'
import { create, find, findByID, update, del, setUserSite } from '@test/utils/localHelpers'
import { test } from '@test/utils/test'
import endpoint from '../publishedBuildStatusWebhook'
import { siteIdHelper } from '@/utilities/idHelper'
import { isAccessError, notFoundError } from '@test/utils/errors'
import { encrypt } from '@/utilities/encryptor'
import type { Site } from '@/payload-types'
import { except } from '@payloadcms/db-postgres/drizzle/pg-core'
beforeAll(()=>{
    vi.stubEnv('PAGES_ENCRYPTION_KEY', 'test-key')
})
afterAll(() => {
    if (process.env.PAGES_ENCRYPTION_KEY) {
      vi.stubEnv('PAGES_ENCRYPTION_KEY', process.env.PAGES_ENCRYPTION_KEY)
    }
})
describe('Published Build Status', () => {
    test('Create a new published build status if it does not exists', async () => {
        const mockCreate = vi.fn().mockResolvedValue({ id: 'created-id' })  
        const mockUpdate = vi.fn().mockResolvedValue({id: 'updated-id'})

        const buildId = '12345'
        const webhookData = {
            pagesSiteId: encrypt('1', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            state: encrypt('success', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            startedAt: encrypt('2024-01-01T10:00:00Z', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            completedAt: encrypt('2024-01-01T10:30:00Z', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            error: encrypt('', process.env.PAGES_ENCRYPTION_KEY).ciphertext
        }
        const mockPayload = {
            ...payload, 
            findByID: vi.fn().mockResolvedValue({
            id: 'mock-id',
            name: 'Mock Document',
            }),
            create: mockCreate,
            find: vi.fn().mockResolvedValue(null),
            update: mockUpdate,
        }
        const mockRequest = {
            routeParams: { buildId },
            json: async () => webhookData,
            payload:mockPayload,
        }
      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()
      expect(mockCreate).toHaveBeenCalledOnce()
      expect(mockUpdate).not.toHaveBeenCalled()
    })

    test('Update a existing published build status if exists', async () => {
        const mockCreate = vi.fn().mockResolvedValue({ id: 'created-id' })  
        const mockUpdate = vi.fn().mockResolvedValue({id: 'updated-id'})

        const buildId = '12345'
        const webhookData = {
            pagesSiteId: encrypt('1', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            state: encrypt('success', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            startedAt: encrypt('2024-01-01T10:00:00Z', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            completedAt: encrypt('2024-01-01T10:30:00Z', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            error: encrypt('', process.env.PAGES_ENCRYPTION_KEY).ciphertext
        }
        const mockPayload = {
            ...payload,
            findByID: vi.fn().mockResolvedValue({
                id: 'mock-id',
                name: 'Mock Document',
            }),
            create: mockCreate,
            find: vi.fn().mockResolvedValue([{
                id: 'mock-id',
                name: 'Mock Document',
            }]),
            update: mockUpdate,
        }
        const mockRequest = {
            routeParams: { buildId },
            json: async () => webhookData,
            payload:mockPayload,
        }
      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()
      expect(mockUpdate).toHaveBeenCalledOnce()
      expect(mockCreate).not.toHaveBeenCalled()
    })


    test('Should fail if no Site is found', async () => {
        const mockCreate = vi.fn().mockResolvedValue({ id: 'created-id' })  
        const mockUpdate = vi.fn().mockResolvedValue({id: 'updated-id'})

        const buildId = '12345'
        const webhookData = {
            pagesSiteId: encrypt('1', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            state: encrypt('success', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            startedAt: encrypt('2024-01-01T10:00:00Z', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            completedAt: encrypt('2024-01-01T10:30:00Z', process.env.PAGES_ENCRYPTION_KEY).ciphertext,
            error: encrypt('', process.env.PAGES_ENCRYPTION_KEY).ciphertext
        }
        const mockPayload = {
            ...payload,
            findByID: vi.fn().mockResolvedValue(null),
            create: mockCreate,
            find: vi.fn().mockResolvedValue([{
                id: 'mock-id',
                name: 'Mock Document',
            }]),
            update: mockUpdate,
        }
        const mockRequest = {
            routeParams: { buildId },
            json: async () => webhookData,
            payload:mockPayload,
        }
        const response = await endpoint.handler(mockRequest as any)
        const result = await response.json()
        expect(result).toMatchObject({ message: 'Site 1 not found' })
        expect(mockCreate).not.toHaveBeenCalled()
        expect(mockUpdate).not.toHaveBeenCalled()
    })
})
