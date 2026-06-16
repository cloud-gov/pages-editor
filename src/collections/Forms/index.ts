import type { CollectionConfig, CollectionSlug } from 'payload'
import { siteField, updatedByField } from '@/fields/relationships'
import { titleField, readyForReviewField, descriptionField } from '@/fields/commonFields'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { addSite } from '@/hooks/addSite'
import buildSite from '@/hooks/buildSite'
import { completeReview } from '@/hooks/completeReview'
import { populateUpdatedBy } from '@/hooks/populateUpdatedBy'

const siteFormsCollectionName: CollectionSlug = 'site-forms' as CollectionSlug

export const SiteForms: CollectionConfig = {
  slug: siteFormsCollectionName,
  access: {
    create: getAdminOrSiteUser(siteFormsCollectionName),
    delete: getAdminOrSiteUser(siteFormsCollectionName),
    read: getAdminOrSiteUser(siteFormsCollectionName, ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser(siteFormsCollectionName),
  },
  admin: {
    group: 'Forms',
    description: 'Create and manage forms for your site.',
    defaultColumns: ['title', '_status', 'updatedAt'],
    useAsTitle: 'title',
    hideAPIURL: true,
  },
  fields: [
    {
      ...titleField,
      label: 'Form Title',
    },
    {
      ...descriptionField,
      label: 'Description',
      admin: {
        description: 'Internal description for admins (not shown on the form)',
      },
    },
    {
      name: 'fields',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Form Fields',
      admin: {
        description: 'Add the fields that will appear on your form',
      },
      fields: [
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          label: 'Field Type',
          options: [
            { label: 'Text Input', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Number', value: 'number' },
            { label: 'Phone', value: 'phone' },
            { label: 'Select Dropdown', value: 'select' },
            { label: 'Radio Buttons', value: 'radio' },
            { label: 'Checkboxes', value: 'checkbox' },
            { label: 'Date', value: 'date' },
          ],
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Field Name',
          admin: {
            description: 'Machine-readable name (no spaces, lowercase, e.g., "first_name")',
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            },
          },
          validate: (value: string | null | undefined) => {
            if (!value) return 'Field name is required'
            if (!/^[a-z][a-z0-9_]*$/.test(value)) {
              return 'Field name must start with a letter and contain only lowercase letters, numbers, and underscores'
            }
            return true
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Field Label',
          admin: {
            description: 'The label shown to users (e.g., "First Name")',
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            },
          },
        },
        {
          name: 'helpText',
          type: 'text',
          label: 'Help Text',
          admin: {
            description: 'Additional guidance shown below the field',
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            },
          },
        },
        {
          name: 'placeholder',
          type: 'text',
          label: 'Placeholder',
          admin: {
            description: 'Placeholder text shown inside the field',
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            },
          },
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          label: 'Required Field',
        },
        {
          name: 'options',
          type: 'array',
          label: 'Options',
          admin: {
            condition: (data, siblingData) =>
              ['select', 'radio', 'checkbox'].includes(siblingData?.fieldType),
            description: 'Add options for select, radio, or checkbox fields',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Option Label',
              admin: {
                components: {
                  Field: '@/components/fields/CustomTextField#CustomTextField',
                },
              }
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Option Value',
              admin: {
                components: {
                  Field: '@/components/fields/CustomTextField#CustomTextField',
                },
              }
            },
          ],
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'Form Settings',
      fields: [
        {
          name: 'submitButtonText',
          type: 'text',
          defaultValue: 'Submit',
          label: 'Submit Button Text',
          admin: {
            components: {
              Field: '@/components/fields/CustomTextField#CustomTextField',
            },
          }
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue: 'Thank you for your submission!',
          label: 'Success Message',
          admin: {
            description: 'Message shown after successful form submission',
          },
        },
        {
          name: 'notificationEmail',
          type: 'email',
          label: 'Notification Email',
          admin: {
            description: 'Send email notification to this address when form is submitted',
          },
        },
      ],
    },
    readyForReviewField,
    updatedByField,
    siteField,
  ],
  hooks: {
    afterChange: [buildSite.afterChange],
    afterDelete: [buildSite.afterDelete],
    beforeChange: [addSite, completeReview, populateUpdatedBy],
  },
  timestamps: true,
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
