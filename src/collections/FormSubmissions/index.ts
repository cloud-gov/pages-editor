import type { CollectionConfig, CollectionSlug, CollectionBeforeChangeHook } from 'payload'
import { siteField } from '@/fields/relationships'
import { getAdminOrSiteUser } from '@/access/adminOrSite'

const siteFormSubmissionsCollectionName: CollectionSlug = 'site-form-submissions' as CollectionSlug

// Type for form document from our custom SiteForms collection
interface FormDocument {
  id: number | string
  site?: number | { id: number }
  [key: string]: unknown
}

// Hook to auto-populate site from form relationship and add metadata
const populateSubmissionData: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' && data?.form) {
    try {
      const form = (await req.payload.findByID({
        collection: 'site-forms' as CollectionSlug,
        id: data.form,
        depth: 0,
      })) as unknown as FormDocument | null
      if (form?.site) {
        data.site = typeof form.site === 'number' ? form.site : form.site.id
      }
    } catch (error) {
      // Form may not exist, let validation handle it
    }

    // Add submission metadata
    data.metadata = {
      ...data.metadata,
      submittedAt: new Date().toISOString(),
      ipAddress: req.headers?.get?.('x-forwarded-for') || req.headers?.get?.('x-real-ip') || 'unknown',
      userAgent: req.headers?.get?.('user-agent') || 'unknown',
      referer: req.headers?.get?.('referer') || '',
    }
  }
  return data
}

export const SiteFormSubmissions: CollectionConfig = {
  slug: siteFormSubmissionsCollectionName,
  access: {
    // Site-scoped: users can only see submissions for forms in their sites
    read: getAdminOrSiteUser(siteFormSubmissionsCollectionName, ['manager', 'user']),
    // Only allow unauthenticated API requests to create submissions
    // This allows external forms to submit while blocking admin UI creation
    create: ({ req }) => !req.user,
    update: getAdminOrSiteUser(siteFormSubmissionsCollectionName, ['manager']),
    delete: getAdminOrSiteUser(siteFormSubmissionsCollectionName, ['manager']),
  },
  admin: {
    group: 'Forms',
    description: 'View and manage form submissions.',
    defaultColumns: ['form', 'status', 'createdAt'],
    useAsTitle: 'id',
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'site-forms' as CollectionSlug,
      required: true,
      hasMany: false,
      label: 'Form',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      label: 'Submission Data',
      admin: {
        description: 'The submitted form data',
        readOnly: true,
        components: {
          Field: '@/components/SubmissionDataField',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Spam', value: 'spam' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      label: 'Submission Metadata',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'submittedAt',
          type: 'date',
          label: 'Submitted At',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes about this submission',
      },
    },
    siteField,
  ],
  hooks: {
    beforeChange: [populateSubmissionData],
  },
  timestamps: true,
}
