import type { Config, PayloadRequest, CollectionSlug } from 'payload'

const get: Required<Config>['endpoints'][number]['method'] = 'get'

interface FormField {
  fieldType: string
  name: string
  label: string
  helpText?: string
  placeholder?: string
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
  submitButtonText?: string
  successMessage?: string
}

interface Form {
  id: string | number
  title: string
  _status: string
  fields: FormField[]
  settings: FormSettings
}

const endpoint = {
  path: '/site-forms/:id/schema',
  method: get,
  handler: async (req: PayloadRequest) => {
    const id = req.routeParams?.id as string

    if (!id) {
      return Response.json({ error: 'Form ID is required' }, { status: 400 })
    }

    try {
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

      // Return sanitized schema (omit internal fields like site)
      const schema = {
        id: form.id,
        title: form.title,
        fields: form.fields.map((field) => ({
          fieldType: field.fieldType,
          name: field.name,
          label: field.label,
          helpText: field.helpText,
          placeholder: field.placeholder,
          required: field.required || false,
          options: field.options,
          validation: field.validation,
        })),
        settings: {
          submitButtonText: form.settings?.submitButtonText || 'Submit',
          successMessage: form.settings?.successMessage || 'Thank you for your submission!',
        },
      }

      // Add CORS headers for public access
      return new Response(JSON.stringify(schema), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    } catch (error) {
      console.error('Error fetching form schema:', error)
      return Response.json({ error: 'Form not found' }, { status: 404 })
    }
  },
}

export default endpoint
