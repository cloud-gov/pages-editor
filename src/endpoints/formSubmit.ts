import type { Config, PayloadRequest, CollectionSlug } from 'payload'

const post: Required<Config>['endpoints'][number]['method'] = 'post'

interface FormField {
  fieldType: string
  name: string
  label: string
  required?: boolean
  options?: Array<{ label: string; value: string }>
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
}

interface FormSettings {
  successMessage?: string
  rateLimitPerHour?: number
}

interface Form {
  id: string | number
  _status: string
  fields: FormField[]
  settings: FormSettings
}

interface ValidationError {
  field: string
  message: string
}

// Simple in-memory rate limiting (consider Redis for production with multiple instances)
const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map()

function checkRateLimit(ipAddress: string, formId: string, limitPerHour: number): boolean {
  const key = `${formId}:${ipAddress}`
  const now = Date.now()
  const hourInMs = 60 * 60 * 1000

  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + hourInMs })
    return true
  }

  if (existing.count >= limitPerHour) {
    return false
  }

  existing.count++
  return true
}

function validateFormData(
  fields: FormField[],
  data: Record<string, unknown>,
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  for (const field of fields) {
    const value = data[field.name]
    const stringValue = typeof value === 'string' ? value : String(value || '')

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: field.name,
        message: `${field.label} is required`,
      })
      continue
    }

    // Skip validation for empty optional fields
    if ((value === undefined || value === null || value === '') && !field.required) continue

    // Type-specific validation
    if (field.fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(stringValue)) {
        errors.push({
          field: field.name,
          message: 'Invalid email format',
        })
      }
    }

    if (field.fieldType === 'number' && value !== undefined && value !== '') {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        errors.push({
          field: field.name,
          message: 'Must be a valid number',
        })
      } else {
        if (field.validation?.min !== undefined && numValue < field.validation.min) {
          errors.push({
            field: field.name,
            message: `Value must be at least ${field.validation.min}`,
          })
        }
        if (field.validation?.max !== undefined && numValue > field.validation.max) {
          errors.push({
            field: field.name,
            message: `Value must be at most ${field.validation.max}`,
          })
        }
      }
    }

    // String validation
    if (typeof value === 'string') {
      if (field.validation?.minLength && stringValue.length < field.validation.minLength) {
        errors.push({
          field: field.name,
          message: `${field.label} must be at least ${field.validation.minLength} characters`,
        })
      }
      if (field.validation?.maxLength && stringValue.length > field.validation.maxLength) {
        errors.push({
          field: field.name,
          message: `${field.label} must be at most ${field.validation.maxLength} characters`,
        })
      }
      if (field.validation?.pattern) {
        try {
          const regex = new RegExp(field.validation.pattern)
          if (!regex.test(stringValue)) {
            errors.push({
              field: field.name,
              message: `${field.label} format is invalid`,
            })
          }
        } catch {
          // Invalid regex pattern in form config, skip validation
        }
      }
    }

    // Select/Radio validation - ensure value is one of the options
    if (['select', 'radio'].includes(field.fieldType) && value && field.options) {
      const validValues = field.options.map((opt) => opt.value)
      if (!validValues.includes(stringValue)) {
        errors.push({
          field: field.name,
          message: `Invalid selection for ${field.label}`,
        })
      }
    }

    // Checkbox validation - ensure all values are valid options
    if (field.fieldType === 'checkbox' && value && field.options) {
      const validValues = field.options.map((opt) => opt.value)
      const selectedValues = Array.isArray(value) ? value : [value]
      for (const selected of selectedValues) {
        if (!validValues.includes(String(selected))) {
          errors.push({
            field: field.name,
            message: `Invalid selection for ${field.label}`,
          })
          break
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

const endpoint = {
  path: '/site-forms/:id/submit',
  method: post,
  handler: async (req: PayloadRequest & { json?: () => Promise<unknown> }) => {
    const id = req.routeParams?.id as string

    if (!id) {
      return Response.json({ error: 'Form ID is required' }, { status: 400 })
    }

    // Parse request body
    let body: { data?: Record<string, unknown> }
    try {
      body = (await req.json?.()) as { data?: Record<string, unknown> }
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { data } = body || {}

    if (!data || typeof data !== 'object') {
      return Response.json({ error: 'Missing form data' }, { status: 400 })
    }

    try {
      // Fetch form definition
      const form = (await req.payload.findByID({
        collection: 'site-forms' as CollectionSlug,
        id,
        depth: 0,
      })) as unknown as Form | null

      if (!form) {
        return Response.json({ error: 'Form not found' }, { status: 404 })
      }

      if (form._status !== 'published') {
        return Response.json({ error: 'Form not available' }, { status: 403 })
      }

      // Get IP address for rate limiting
      const ipAddress =
        req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers?.get?.('x-real-ip') ||
        'unknown'

      // Check rate limit
      const rateLimitPerHour = form.settings?.rateLimitPerHour || 10
      if (!checkRateLimit(ipAddress, String(form.id), rateLimitPerHour)) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Please try again later',
            retryAfter: 3600,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Retry-After': '3600',
            },
          },
        )
      }

      // Validate submission data
      const validation = validateFormData(form.fields, data)
      if (!validation.valid) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: validation.errors,
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          },
        )
      }

      // Sanitize data - only keep fields that exist in form definition
      const validFieldNames = form.fields.map((f) => f.name)
      const sanitizedData: Record<string, unknown> = {}
      for (const fieldName of validFieldNames) {
        if (data[fieldName] !== undefined) {
          sanitizedData[fieldName] = data[fieldName]
        }
      }

      // Create submission
      const submission = await req.payload.create({
        collection: 'site-form-submissions' as CollectionSlug,
        data: {
          form: typeof form.id === 'string' ? parseInt(form.id, 10) : form.id,
          data: sanitizedData,
          status: 'pending',
          metadata: {
            ipAddress,
            userAgent: req.headers?.get?.('user-agent') || 'unknown',
            referer: req.headers?.get?.('referer') || '',
            submittedAt: new Date().toISOString(),
          },
        } as Record<string, unknown>,
      })

      const successMessage =
        form.settings?.successMessage || 'Thank you for your submission!'

      return new Response(
        JSON.stringify({
          success: true,
          message: successMessage,
          submissionId: submission.id,
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    } catch (error) {
      console.error('Error submitting form:', error)
      return Response.json({ error: 'Failed to submit form' }, { status: 500 })
    }
  },
}

export default endpoint
