import { expect, describe, vi } from 'vitest'
import { test } from '@test/utils/test'
import endpoint from './formSchema'

describe('formSchema endpoint', () => {
  describe('success cases', () => {
    test('returns form schema for published form', async () => {
      const formId = '123'
      const mockForm = {
        id: formId,
        title: 'Contact Us',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'full_name',
            label: 'Full Name',
            helpText: 'Enter your full name',
            placeholder: 'John Doe',
            required: true,
            validation: {
              minLength: 2,
              maxLength: 100,
            },
          },
          {
            fieldType: 'email',
            name: 'email',
            label: 'Email Address',
            required: true,
          },
          {
            fieldType: 'select',
            name: 'subject',
            label: 'Subject',
            options: [
              { label: 'General Inquiry', value: 'general' },
              { label: 'Support', value: 'support' },
            ],
          },
        ],
        settings: {
          submitButtonText: 'Send Message',
          successMessage: 'Thanks for reaching out!',
        },
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
      }

      const mockRequest = {
        routeParams: { id: formId },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.id).toBe(formId)
      expect(result.title).toBe('Contact Us')
      expect(result.fields).toHaveLength(3)
      expect(result.fields[0]).toMatchObject({
        fieldType: 'text',
        name: 'full_name',
        label: 'Full Name',
        required: true,
      })
      expect(result.settings.submitButtonText).toBe('Send Message')
      expect(result.settings.successMessage).toBe('Thanks for reaching out!')
    })

    test('returns default settings when form has no custom settings', async () => {
      const formId = '456'
      const mockForm = {
        id: formId,
        title: 'Simple Form',
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
      }

      const mockRequest = {
        routeParams: { id: formId },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(200)
      expect(result.settings.submitButtonText).toBe('Submit')
      expect(result.settings.successMessage).toBe('Thank you for your submission!')
    })

    test('includes CORS headers in response', async () => {
      const mockForm = {
        id: '789',
        title: 'Test Form',
        _status: 'published',
        fields: [],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
      }

      const mockRequest = {
        routeParams: { id: '789' },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS')
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type')
    })

    test('sets required to false for optional fields', async () => {
      const mockForm = {
        id: '101',
        title: 'Form with optional',
        _status: 'published',
        fields: [
          {
            fieldType: 'text',
            name: 'optional_field',
            label: 'Optional Field',
            // required is undefined
          },
        ],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
      }

      const mockRequest = {
        routeParams: { id: '101' },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(result.fields[0].required).toBe(false)
    })
  })

  describe('error cases', () => {
    test('returns 400 when form ID is missing', async () => {
      const mockPayload = {
        findByID: vi.fn(),
      }

      const mockRequest = {
        routeParams: {},
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(400)
      expect(result.error).toBe('Form ID is required')
      expect(mockPayload.findByID).not.toHaveBeenCalled()
    })

    test('returns 404 when form does not exist', async () => {
      const mockPayload = {
        findByID: vi.fn().mockRejectedValue(new Error('Not Found')),
      }

      const mockRequest = {
        routeParams: { id: 'nonexistent' },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(404)
      expect(result.error).toBe('Form not found')
    })

    test('returns 404 when findByID returns null', async () => {
      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(null),
      }

      const mockRequest = {
        routeParams: { id: '999' },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(404)
      expect(result.error).toBe('Form not found')
    })

    test('returns 403 when form is in draft status', async () => {
      const mockForm = {
        id: '123',
        title: 'Draft Form',
        _status: 'draft',
        fields: [],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(403)
      expect(result.error).toBe('Form not available')
    })

    test('returns 403 when form has archived status', async () => {
      const mockForm = {
        id: '123',
        title: 'Archived Form',
        _status: 'archived',
        fields: [],
        settings: {},
      }

      const mockPayload = {
        findByID: vi.fn().mockResolvedValue(mockForm),
      }

      const mockRequest = {
        routeParams: { id: '123' },
        payload: mockPayload,
      }

      const response = await endpoint.handler(mockRequest as any)
      const result = await response.json()

      expect(response.status).toBe(403)
      expect(result.error).toBe('Form not available')
    })
  })
})
