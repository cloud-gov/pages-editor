import type { SiteForm } from '@/payload-types'
import { generateRandomInt } from './utils'

/**
 * Creates a general contact form with name, email, and message fields
 */
const forms = (siteId: number): Partial<SiteForm>[] => {
  return [
    {
      id: generateRandomInt(),
      title: 'General Contact Form',
      description: 'A general contact form for visitors to reach out with questions or feedback.',
      site: siteId,
      _status: 'published',
      fields: [
        {
          fieldType: 'text',
          name: 'name',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
        },
        {
          fieldType: 'email',
          name: 'email',
          label: 'Email Address',
          placeholder: 'you@example.gov',
          helpText: 'We will use this email to respond to your inquiry.',
          required: true,
        },
        {
          fieldType: 'text',
          name: 'subject',
          label: 'Subject',
          placeholder: 'What is this regarding?',
          required: false,
        },
        {
          fieldType: 'textarea',
          name: 'message',
          label: 'Message',
          placeholder: 'How can we help you?',
          helpText: 'Please provide as much detail as possible.',
          required: true,
        },
      ],
      settings: {
        submitButtonText: 'Send Message',
        successMessage: 'Thank you for contacting us! We will get back to you within 2-3 business days.',
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]
}

export default forms
