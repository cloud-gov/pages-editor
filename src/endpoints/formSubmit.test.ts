import { expect, describe, vi, beforeEach } from 'vitest'
import { test } from '@test/utils/test'
import endpoint from './formSubmit'

describe('formSubmit endpoint', () => {
  beforeEach(() => {
    // Clear rate limit store between tests by resetting the module
    vi.resetModules()
  })

  describe('success cases', () => {
    test('successfully submits form with valid data', async () => {
      const formId = '123'
      const mockForm = {
        id: formId,
        _status: 'published',
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
            label: 'Email',
            required: true,
          },
        ],
        settings: {
          successMessage: 'Thanks for your submission!',
          rateLimitPerHour: 10,
        },
      }

      const mockSubmission = { id: 'submission-123' }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn().mockResolvedValue(mockSubmission),
      }

      const mockRequest = {
        routeParams: { id: formId },
        json: async () => ({
          data: {
            full_name: 'John Doe',
            email: 'john@example.gov',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn((name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1'
            if (name === 'user-agent') return 'Test Agent'
            if (name === 'referer') return 'https://example.gov'
            return null
          }),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(201)
      expect(result.success).toBe(true)
      expect(result.message).toBe('Thanks for your submission!')
      expect(result.submissionId).toBe('submission-123')
      expect(mockPayload.create).toHaveBeenCalledOnce()
    })

    test('uses default success message when not configured', async () => {
      const mockForm = {
        id: '456',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'message',
            label: 'Message',
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn().mockResolvedValue({ id: 'sub-456' }),
      }

      const mockRequest = {
        routeParams: { id: '456' },
        json: async () => ({
          data: {
            message: 'Hello world',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(result.message).toBe('Thank you for your submission!')
    })

    test('sanitizes data to only include defined form fields', async () => {
      const mockForm = {
        id: '789',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'name',
            label: 'Name',
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn().mockResolvedValue({ id: 'sub-789' }),
      }

      const mockRequest = {
        routeParams: { id: '789' },
        json: async () => ({
          data: {
            name: 'John',
            malicious_field: '<script>alert("xss")</script>',
            another_extra: 'should be removed',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      await endpoint.handler(mockRequest as any)

      const createCall = mockPayload.create.mock.calls[0][0]
      expect(createCall.data.data).toEqual({ name: 'John' })
      expect(createCall.data.data.malicious_field).toBeUndefined()
      expect(createCall.data.data.another_extra).toBeUndefined()
    })

    test('includes CORS headers in success response', async () => {
      const mockForm = {
        id: '101',
        _status: 'published',
        fields: [],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn().mockResolvedValue({ id: 'sub-101' }),
      }

      const mockRequest = {
        routeParams: { id: '101' },
        json: async () => ({ data: {} }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    })
  })

  describe('validation cases', () => {
    test('returns validation error for missing required field', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'required_field',
            label: 'Required Field',
            required: true,
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {},
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Validation failed')
      expect(result.details).toContainEqual({
        field: 'required_field',
        message: 'Required Field is required',
      })
      expect(mockPayload.create).not.toHaveBeenCalled()
    })

    test('returns validation error for invalid email format', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'email',
            name: 'email',
            label: 'Email',
            required: true,
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            email: 'not-an-email',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'email',
        message: 'Invalid email format',
      })
    })

    test('returns validation error for number field with invalid value', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'number',
            name: 'age',
            label: 'Age',
            required: true,
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            age: 'not-a-number',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'age',
        message: 'Must be a valid number',
      })
    })

    test('returns validation error for number below minimum', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'number',
            name: 'quantity',
            label: 'Quantity',
            validation: {
              min: 1,
              max: 100,
            },
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            quantity: 0,
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'quantity',
        message: 'Value must be at least 1',
      })
    })

    test('returns validation error for string below minLength', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'message',
            label: 'Message',
            validation: {
              minLength: 10,
            },
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            message: 'Hi',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'message',
        message: 'Message must be at least 10 characters',
      })
    })

    test('returns validation error for invalid select option', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'select',
            name: 'category',
            label: 'Category',
            options: [
              { label: 'Option A', value: 'a' },
              { label: 'Option B', value: 'b' },
            ],
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            category: 'invalid_option',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'category',
        message: 'Invalid selection for Category',
      })
    })

    test('returns validation error for invalid checkbox options', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'checkbox',
            name: 'interests',
            label: 'Interests',
            options: [
              { label: 'Sports', value: 'sports' },
              { label: 'Music', value: 'music' },
            ],
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            interests: ['sports', 'hacking'],
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'interests',
        message: 'Invalid selection for Interests',
      })
    })

    test('returns validation error for pattern mismatch', async () => {
      const mockForm = {
        id: '123',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'zip_code',
            label: 'ZIP Code',
            validation: {
              pattern: '^\\d{5}$',
            },
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn(),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({
          data: {
            zip_code: '1234',
          },
        }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue('192.168.1.1'),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.details).toContainEqual({
        field: 'zip_code',
        message: 'ZIP Code format is invalid',
      })
    })
  })

  describe('error cases', () => {
    test('returns 400 when form ID is missing', async () => {
      const mockRequest = {
        routeParams: {},
        json: async () => ({ data: {} }),
        payload: {},
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Form ID is required')
    })

    test('returns 400 when request body is not valid JSON', async () => {
      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => {
          throw new Error('Invalid JSON')
        },
        payload: {},
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Invalid JSON body')
    })

    test('returns 400 when data field is missing', async () => {
      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({}),
        payload: {},
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Missing form data')
    })

    test('returns 404 when form does not exist', async () => {
      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(null),
      }

      const mockRequest = {
        routeParams: { id: 'nonexistent' },
        json: async () => ({ data: { field: 'value' } }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(404)
      expect(result.error).toBe('Form not found')
    })

    test('returns 403 when form is not published', async () => {
      const mockForm = {
        id: '123',
        _status: 'draft',
        fields: [],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({ data: {} }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(403)
      expect(result.error).toBe('Form not available')
    })

    test('returns 500 when database error occurs', async () => {
      const mockPayload = {
        findByID: vi.fn().mockRejectedValue(new Error('Database error')),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        json: async () => ({ data: { field: 'value' } }),
        payload: mockPayload,
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(500)
      expect(result.error).toBe('Failed to submit form')
    })
  })

  describe('rate limiting', () => {
    test('returns 429 when rate limit is exceeded', async () => {
      const formId = 'rate-limit-test'
      const ipAddress = '10.0.0.1'

      const mockForm = {
        id: formId,
        _status: 'published',
        fields: [],
        settings: {
          rateLimitPerHour: 2,
        },
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
        create: vi.fn().mockResolvedValue({ id: 'sub-1' }),
      }

      const createMockRequest = () => ({
        routeParams: { id: formId },
        json: async () => ({ data: {} }),
        payload: mockPayload,
        headers: {
          get: vi.fn((name: string) => {
            if (name === 'x-forwarded-for') return ipAddress
            return null
          }),
        },
      })

      // Import fresh to reset rate limit store
      const { default: freshEndpoint } = await import('./formSubmit')

      // First request - should succeed
      const response1 = await freshEndpoint.handler(createMockRequest() as any)
      expect(response1.status).toBe(201)

      // Second request - should succeed
      const response2 = await freshEndpoint.handler(createMockRequest() as any)
      expect(response2.status).toBe(201)

      // Third request - should be rate limited
      const response3 = await freshEndpoint.handler(createMockRequest() as any)
      const result3 = await response3.json()

      expect(response3.status).toBe(429)
      expect(result3.error).toBe('Rate limit exceeded')
      expect(result3.retryAfter).toBe(3600)
      expect(response3.headers.get('Retry-After')).toBe('3600')
    })
  })
})
