import { describe, expect, beforeEach, vi, afterAll } from 'vitest'
import { mockClient } from 'aws-sdk-client-mock'
import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
  S3ServiceException,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { beforeDeleteHook, saveInfoToS3 } from './index'
import { test } from '@test/utils/test'
import { create, update, find } from '@test/utils/localHelpers'
import { Site } from '@/payload-types'

const BUCKET_NAME = 'test-bucket'

// Mock the S3 client
const s3Mock = mockClient(S3Client)

describe('beforeDeleteHook', () => {
  test.scoped({ defaultUserAdmin: true })

  beforeEach(async () => {
    // Reset the mock before each test
    s3Mock.reset()

    // Set up environment variables for testing
    vi.stubEnv('SITE_METADATA_BUCKET', BUCKET_NAME)
    // Not 'test' so S3 operations run
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterAll(() => {
    vi.stubEnv('NODE_ENV', 'test')
  })

  test('should successfully copy and delete S3 objects when site is deleted', async ({
    payload,
    tid,
  }) => {
    // Create a test site
    const site = await create(payload, tid, {
      collection: 'sites',
      data: {
        name: 'temp-site',
        initialManagerEmail: 'test@gsa.gov',
      },
    })

    const { slug } = site as Site

    // Mock successful S3 responses
    s3Mock.on(CopyObjectCommand).resolves({})
    s3Mock.on(DeleteObjectCommand).resolves({})

    // Create a mock request object
    const mockReq = {
      payload,
      transactionID: tid,
    } as any as any

    // Call the hook
    await beforeDeleteHook({ req: mockReq, id: site.id } as any)

    // Verify that CopyObjectCommand was called with correct parameters
    const copyCalls = s3Mock.commandCalls(CopyObjectCommand)
    expect(copyCalls).toHaveLength(1)
    expect(copyCalls[0].args[0].input).toEqual({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/_sites/active/${slug}.json`,
      Key: `_sites/deleted/${slug}.json`,
    })

    // Verify that DeleteObjectCommand was called with correct parameters
    const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand)
    expect(deleteCalls).toHaveLength(1)
    expect(deleteCalls[0].args[0].input).toEqual({
      Bucket: BUCKET_NAME,
      Key: `_sites/active/${slug}.json`,
    })
  })

  test('should handle CopyObjectCommand failure', async ({ payload, tid }) => {
    // Create a test site
    const site = await create(payload, tid, {
      collection: 'sites',
      data: {
        name: 'test-site',
        initialManagerEmail: 'test@gsa.gov',
      },
    })

    // Mock CopyObjectCommand failure
    const copyError = new S3ServiceException({
      name: 'NoSuchKey',
      message: 'The specified key does not exist.',
      $fault: 'client',
      $metadata: {},
    })
    s3Mock.on(CopyObjectCommand).rejects(copyError)

    // Create a mock request object
    const mockReq = {
      payload,
      transactionID: tid,
    } as any

    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Call the hook - it should not throw but log the error
    await beforeDeleteHook({ req: mockReq, id: site.id } as any)

    // Verify that CopyObjectCommand was called
    const copyCalls = s3Mock.commandCalls(CopyObjectCommand)
    expect(copyCalls).toHaveLength(1)

    // Verify that DeleteObjectCommand was not called due to the error
    const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand)
    expect(deleteCalls).toHaveLength(0)

    // Verify that the error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error from S3 while deleting object'),
    )

    consoleSpy.mockRestore()
  })

  test('should handle DeleteObjectCommand failure', async ({ payload, tid }) => {
    // Create a test site
    const site = await create(payload, tid, {
      collection: 'sites',
      data: {
        name: 'test-site',
        initialManagerEmail: 'test@gsa.gov',
      },
    })

    // Mock successful CopyObjectCommand and failed DeleteObjectCommand
    s3Mock.on(CopyObjectCommand).resolves({})
    const deleteError = new S3ServiceException({
      name: 'AccessDenied',
      message: 'Access Denied',
      $fault: 'client',
      $metadata: {},
    })
    s3Mock.on(DeleteObjectCommand).rejects(deleteError)

    // Create a mock request object
    const mockReq = {
      payload,
      transactionID: tid,
    } as any

    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Call the hook - it should not throw but log the error
    await beforeDeleteHook({ req: mockReq, id: site.id } as any)

    // Verify that both commands were called
    const copyCalls = s3Mock.commandCalls(CopyObjectCommand)
    expect(copyCalls).toHaveLength(1)

    const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand)
    expect(deleteCalls).toHaveLength(1)

    // Verify that the error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error from S3 while deleting object'),
    )

    consoleSpy.mockRestore()
  })

  test('should skip S3 operations when SITE_METADATA_BUCKET is not set', async ({
    payload,
    tid,
  }) => {
    // Unset the bucket environment variable
    delete process.env.SITE_METADATA_BUCKET

    // Create a test site
    const site = await create(payload, tid, {
      collection: 'sites',
      data: {
        name: 'test-site',
        initialManagerEmail: 'test@gsa.gov',
      },
    })

    // Create a mock request object
    const mockReq = {
      payload,
      transactionID: tid,
    } as any

    // Call the hook
    await beforeDeleteHook({ req: mockReq, id: site.id } as any)

    // Verify that no S3 commands were called
    const copyCalls = s3Mock.commandCalls(CopyObjectCommand)
    expect(copyCalls).toHaveLength(0)

    const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand)
    expect(deleteCalls).toHaveLength(0)
  })

  test('should skip S3 operations when NODE_ENV is test', async ({ payload, tid }) => {
    // Set NODE_ENV to test
    vi.stubEnv('NODE_ENV', 'test')

    // Create a test site
    const site = await create(payload, tid, {
      collection: 'sites',
      data: {
        name: 'test-site',
        initialManagerEmail: 'test@gsa.gov',
      },
    })

    // Create a mock request object
    const mockReq = {
      payload,
      transactionID: tid,
    } as any

    // Call the hook
    await beforeDeleteHook({ req: mockReq, id: site.id } as any)

    // Verify that no S3 commands were called
    const copyCalls = s3Mock.commandCalls(CopyObjectCommand)
    expect(copyCalls).toHaveLength(0)

    const deleteCalls = s3Mock.commandCalls(DeleteObjectCommand)
    expect(deleteCalls).toHaveLength(0)
  })

  test('should delete solo users when site is deleted', async ({ payload, tid }) => {
    const soloUserEmail = 'test-solo-user@gsa.gov'
    const multiSiteUserEmail = 'test-multi-site-user@gsa.gov'

    const [site, anotherSite] = await Promise.all([
      create(payload, tid, {
        collection: 'sites',
        data: {
          name: 'test-site',
          initialManagerEmail: soloUserEmail,
        },
      }),
      create(payload, tid, {
        collection: 'sites',
        data: {
          name: 'another-site',
          initialManagerEmail: multiSiteUserEmail,
        },
      }),
    ])

    // Create a test user
    const [multiSiteUser, soloUser] = await Promise.all([
      find(payload, tid, {
        collection: 'users',
        limit: 1,
        where: {
          email: { equals: multiSiteUserEmail },
        },
      }),
      find(payload, tid, {
        collection: 'users',
        limit: 1,
        where: {
          email: { equals: soloUserEmail },
        },
      }),
    ])

    await update(payload, tid, {
      collection: 'users',
      id: multiSiteUser.docs[0].id,
      data: {
        sites: [
          {
            site: site.id,
            role: 'manager',
          },
          {
            site: anotherSite.id,
            role: 'manager',
          },
        ],
      },
    })

    // Create a spy to monitor payload.delete calls
    const deleteSpy = vi.spyOn(payload, 'delete')

    // Mock successful S3 responses
    s3Mock.on(CopyObjectCommand).resolves({})
    s3Mock.on(DeleteObjectCommand).resolves({})

    // Create a mock request object
    const mockReq = {
      payload,
      transactionID: tid,
    } as any

    // Call the hook
    await beforeDeleteHook({ req: mockReq, id: site.id } as any)

    // Verify that payload.delete was called
    expect(deleteSpy).toHaveBeenCalledWith({
      collection: 'users',
      where: {
        id: {
          in: expect.any(String), // The solo user IDs joined as a string
        },
      },
      req: mockReq,
    })
    expect((deleteSpy.mock.calls[0][0].where.id as any)?.in).toContain(
      soloUser.docs[0].id.toString(),
    )
    expect((deleteSpy.mock.calls[0][0].where.id as any)?.in).not.toContain(
      multiSiteUser.docs[0].id.toString(),
    )
    // Clean up the spy
    deleteSpy.mockRestore()
  })
})

describe('saveInfoToS3', () => {
  test.scoped({ defaultUserAdmin: true })

  beforeEach(async () => {
    // Reset the mock before each test
    s3Mock.reset()

    // Set up environment variables for testing
    vi.stubEnv('SITE_METADATA_BUCKET', BUCKET_NAME)
    // Not 'test' so S3 operations run
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterAll(() => {
    vi.stubEnv('NODE_ENV', 'test')
  })

  test('should save site info to S3', async ({ payload, tid }) => {
    // Create a test site
    const site = await create(payload, tid, {
      collection: 'sites',
      data: {
        name: 'test-site',
        initialManagerEmail: 'test@gsa.gov',
      },
    })

    const { slug } = site as Site

    const mockReq = {
      payload,
      transactionID: tid,
    } as any

    // Call the hook
    await saveInfoToS3({ req: mockReq, id: site.id } as any)

    const bot = (
      await payload.find({
        collection: 'users',
        limit: 1,
        where: {
          and: [{ 'sites.site.id': { equals: site.id } }, { 'sites.role': { equals: 'bot' } }],
        },
        req: { transactionID: tid },
      })
    ).docs[0]

    // Verify that PutObjectCommand was called with correct parameters
    const copyCalls = s3Mock.commandCalls(PutObjectCommand)
    const calledArgs = copyCalls[0].args[0].input
    expect(copyCalls).toHaveLength(1)
    expect(calledArgs.Body).toEqual(JSON.stringify({ ...site, apiKey: bot.apiKey }))
  })
})
