import { Field, GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { updatedByField } from '@/fields/relationships'
import { readyForReviewField } from '@/fields'
import { populateGlobalUpdatedBy } from '@/hooks/populateUpdatedBy'

export const roleGroup = (name: string, fields: Field[] = []): Field => ({
  name,
  type: 'group',
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Job Title',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
    },
    { name: 'phone', type: 'text', label: 'Phone Number' },
    ...fields,
  ],
})

const agencyOwnwer = roleGroup('agencyOwner')
const agencySiteManager = roleGroup('agencySiteManager')
const agencySecurityOfficer = roleGroup('agencySecurityOfficer', [
  { name: 'program', type: 'text', label: 'Agency, Program office or Division' },
])
const thirdPartyRepresntative = roleGroup('thirdPartyRepresentative', [
  { name: 'company', type: 'text', label: 'Agency, Program Office, Company Name' },
])

export const SiteAuth: GlobalConfig = {
  slug: 'site-auth',
  label: 'Site Authorization',
  access: {
    read: getAdminOrSiteUserGlobals(['manager']),
    update: getAdminOrSiteUserGlobals(['manager']),
    readVersions: getAdminOrSiteUserGlobals(['manager']),
  },
  admin: {
    description:
      'The site authorization is used to manage the information related to the Authority to Use (ATU) documentation.',
  },
  fields: [
    agencyOwnwer,
    agencySiteManager,
    agencySecurityOfficer,
    {
      name: 'thirdPartyReps',
      type: 'array',
      label: 'Third Party Representatives',
      fields: [thirdPartyRepresntative],
    },
    {
      name: 'websiteInfo',
      type: 'group',
      label: 'Website Information',
      fields: [
        { name: 'siteName', type: 'text', label: 'Name of the site' },
        { name: 'accronym', type: 'text', label: 'Acronym or abbreviation of the agency' },
        { name: 'agency', type: 'text', label: 'Agency or Site Organization' },
        {
          name: 'description',
          type: 'textarea',
          label: "Describe the website's purpose, audience, mission, and content type.",
        },
      ],
    },
    {
      name: 'piiCheck',
      type: 'radio',
      label: 'Personally Identifiable Information (PII)?',
      options: [
        {
          label: 'Yes: Content was reviewed to confirm it does not contain PII',
          value: 'yes',
        },
        { label: 'No: Content was not reviewed for PII', value: 'no' },
      ],
    },
    {
      name: 'sensitiveCheck',
      type: 'radio',
      label: 'Sensitive Government Information',
      options: [
        {
          label:
            'Yes: Content was reviewed to confirm it does not contain any Sensitive Government Information.',
          value: 'yes',
        },
        { label: 'No: Content was not reviewed for Sensitive Government Information', value: 'no' },
      ],
    },
    {
      name: 'linksCheck',
      type: 'radio',
      label: 'Links and Attachments',
      options: [
        {
          label:
            'Yes: Content was reviewed to verify all links and attachments are secure, appropriate, and compliant with public web standards.',
          value: 'yes',
        },
        {
          label:
            'No: Content was not reviewed to verify all links and attachments are secure, appropriate, and compliant with public web standards.',
          value: 'no',
        },
      ],
    },
    {
      name: 'formatCheck',
      type: 'radio',
      label: 'Formatting and Accessibility',
      options: [
        {
          label:
            'Yes: Content was reviewed to confirm accessibility compliance and clarity for all users.',
          value: 'yes',
        },
        {
          label:
            'No: Content was not reviewed to confirm accessibility compliance and clarity for all users.',
          value: 'no',
        },
      ],
    },
    {
      name: 'finalReviewCheck',
      type: 'radio',
      label: 'Final Review',
      options: [
        {
          label: 'Yes: Review has been completed and final approval has been provided.',
          value: 'yes',
        },
        {
          label: 'No: Review has not been completed and final approval has not been provided.',
          value: 'no',
        },
      ],
    },
    updatedByField,
    readyForReviewField,
  ],
  hooks: {
    beforeChange: [populateGlobalUpdatedBy],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
