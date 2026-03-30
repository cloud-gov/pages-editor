'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { H2, H3, H4 } from '@/components/ui/prose-headings'
import { SlimAlert } from '@/components/ui/alert'
import Callout from '@/components/ui/callout'
import Table from '@/components/ui/table'
import DownloadButton from './DownloadButton'

const userTableRows = (siteUsers) => {
  return siteUsers.map((user) => [
    {
      column: 'Email',
      value: user.email,
    },
    {
      column: 'Role',
      value: user.role,
    },
  ])
}

const requiredFields = (props) => {
  return Object.keys(props)
    .filter((key) => {
      if (props[key] === '' || props[key] === null || props[key] === undefined) {
        return `${key} is required`
      }
    })
    .filter((field) => typeof field === 'string')
}

interface ItemCalloutProps {
  sectionName?: string
  attributes: {
    key: string
    label: string
    order: number
    required?: boolean
  }[]
  data: { [key: string]: string }
}

const ItemCallout = ({ sectionName, attributes, data }: ItemCalloutProps) => {
  const orderedAttributes = attributes.sort((a, b) => a.order - b.order)
  const requiredData = attributes.filter((attr) => attr.required)
  const requiredDataValues = requiredData.reduce((acc, attr) => {
    acc[attr.key] = data[attr.key]
    return acc
  }, {})
  const missingFields = requiredFields({ ...requiredDataValues })
  const calloutColorClass = missingFields.length > 0 ? 'bg-secondary-lighter' : 'bg-base-lightest'

  return (
    <>
      {sectionName && <H3>{sectionName}</H3>}
      {missingFields.length > 0 && (
        <SlimAlert type="error">
          The following required fields are missing for <strong>{sectionName}</strong>:{' '}
          {missingFields.join(', ')} <Link href="/admin/globals/site-auth">Update ATU forms</Link>
        </SlimAlert>
      )}
      <Callout backgroundColorClass={calloutColorClass}>
        {orderedAttributes.map((attr) => (
          <p key={attr.key}>
            <strong>{attr.label}:</strong> {data[attr.key]}
          </p>
        ))}
      </Callout>
    </>
  )
}

const ItemVerification = ({
  sectionName,
  description,
  value,
}: {
  sectionName: string
  description: string
  value: string
}) => {
  const isVerified = value === 'yes'
  const calloutColorClass = !isVerified ? 'bg-secondary-lighter' : 'bg-base-lightest'

  return (
    <>
      <H3>{sectionName}</H3>
      {!isVerified && (
        <SlimAlert type="error">
          This item is marked as &ldquo;No&ldquo;. Please review the content and update the
          verification status accordingly.{' '}
          <Link href="/admin/globals/site-auth">Update ATU forms</Link>
        </SlimAlert>
      )}
      <Callout backgroundColorClass={calloutColorClass}>
        <p className="padding-bottom-2">{description}</p>
        <div
          className={`grid-row ${isVerified ? 'text-bold text-underline' : 'text-normal text-strike'}`}
        >
          {/* <div className="grid-col-auto border-4px font-mono-md">{yesCheck}</div> */}
          <div className="grid-col-fill">Yes</div>
        </div>
        <div
          className={`grid-row ${!isVerified ? 'text-bold text-underline' : 'text-normal text-strike'}`}
        >
          {/* <div className="grid-col-auto border-4px font-mono-md">{noCheck}</div> */}
          <div className="grid-col-fill">No</div>
        </div>
      </Callout>
    </>
  )
}

const SignatureCallout = ({ fullName }: { fullName?: string }) => {
  return (
    <>
      <div className="grid-row gap-2 padding-y-4">
        <div className="grid-col-12 border-bottom">
          <p>
            <strong>Full Name: </strong>
            {fullName && fullName}
          </p>
        </div>
      </div>
      <div className="grid-row gap-2 padding-bottom-4">
        <div className="grid-col-12 border-bottom">
          <strong>Signature:</strong>
        </div>
      </div>
      <div className="grid-row gap-2 padding-bottom-4">
        <div className="grid-col-12 border-bottom">
          <strong>Date:</strong>
        </div>
      </div>
    </>
  )
}

const Package = ({ siteUsers, atuPackage }) => {
  const printableSectionRef = useRef<HTMLDivElement | null>(null)
  const userRows = userTableRows(siteUsers)

  return (
    <main id="atu-package" ref={printableSectionRef}>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <style>
        {`
          .print-heading {
            font-size: 20px;
            font-weight: bold;
            color: #000;
            display: none;
          }
          @media print {
            .print-heading {
              display: block !important;
            }
          }`}
      </style>
      <section className="usa-section section section--white align-left">
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-10">
              <div className="section__container">
                <div className="section__slot">
                  <div className="flex-column margin-bottom-5">
                    <h1 style={{ marginBottom: '1rem' }}>Authority to Use (ATU) Package</h1>
                    <Callout>
                      <p>
                        This ATU package is related to{' '}
                        <strong>{atuPackage?.websiteInfo?.siteName}</strong>.{' '}
                        {atuPackage?.websiteInfo?.description}
                      </p>
                    </Callout>
                    <p className="margin-top-2 no-print">
                      ATU template for external (non-GSA) agencies. See ATU guide here.
                    </p>
                  </div>
                  <section className="usa-prose padding-bottom-8">
                    <SlimAlert className="no-print" type="info">
                      Complete the forms in the{' '}
                      <Link href="/admin/globals/site-auth">Edit the ATU forms</Link> and then
                      download a copy for Pages Compliance.
                    </SlimAlert>
                    <H2 className="no-print">Purpose</H2>
                    <p className="print-heading">Purpose</p>
                    <p>
                      The ATU Process described in the document is intended for static websites
                      hosted on Cloud.gov Pages Content Management System (CMS) known as Cloud.gov
                      Publisher. Cloud.gov Pages is a FedRAMP-approved Software as a Service (SaaS)
                      hosting application.
                    </p>
                    <H2 className="no-print">Hosting and Platform Overview</H2>
                    <p className="print-heading">Hosting and Platform Overview</p>
                    <H3>Leveraged Authorizations</H3>
                    <Table
                      columns={[
                        'Leveraged Information System Name',
                        'Leveraged Service Provider Owner',
                        'Date ATO Granted',
                      ]}
                      rows={[
                        [
                          {
                            column: 'Leveraged Information System Name',
                            value: 'Cloud.gov PaaS FedRAMP Authorized',
                          },
                          {
                            column: 'Leveraged Service Provider Owner',
                            value: 'GSA',
                          },
                          {
                            column: 'Date ATO Granted',
                            value: '2017-01-18',
                          },
                        ],
                        [
                          {
                            column: 'Leveraged Information System Name',
                            value: 'Cloud.gov Pages SaaS FedRAMP Authorized',
                          },
                          {
                            column: 'Leveraged Service Provider Owner',
                            value: 'GSA',
                          },
                          {
                            column: 'Date ATO Granted',
                            value: '2018-03-05',
                          },
                        ],
                      ]}
                    />
                    <H4>Hosting Type</H4>
                    <p>
                      Software-as-a-Service (SaaS) Authorized by FedRAMP for government use only.
                    </p>
                    <H4>Functionality</H4>
                    <p>
                      Pages is a FedRAMP-approved application designed to host static, public-facing
                      websites that do not require user authentication. It offers a secure platform
                      for managing, editing, and publishing website content.{' '}
                    </p>
                    <H2 className="no-print">Site Point of Contacts (POCs)</H2>
                    <p className="print-heading">Site Point of Contacts (POCs)</p>
                    <ItemCallout
                      sectionName="Agency Website Owner"
                      attributes={[
                        { key: 'fullName', label: 'Full Name', order: 1, required: true },
                        { key: 'title', label: 'Title', order: 2 },
                        { key: 'email', label: 'Email', order: 3, required: true },
                        { key: 'phone', label: 'Phone Number', order: 4, required: true },
                      ]}
                      data={atuPackage?.agencyOwner || {}}
                    />
                    <ItemCallout
                      sectionName="Agency Website Manager"
                      attributes={[
                        { key: 'fullName', label: 'Full Name', order: 1, required: true },
                        { key: 'title', label: 'Title', order: 2 },
                        { key: 'email', label: 'Email', order: 3, required: true },
                        { key: 'phone', label: 'Phone Number', order: 4, required: true },
                      ]}
                      data={atuPackage?.agencySiteManager || {}}
                    />
                    <ItemCallout
                      sectionName="Agency Information Security Office Representative"
                      attributes={[
                        { key: 'fullName', label: 'Full Name', order: 1, required: true },
                        { key: 'title', label: 'Title', order: 2 },
                        { key: 'email', label: 'Email', order: 3, required: true },
                        { key: 'phone', label: 'Phone Number', order: 4, required: true },
                        {
                          key: 'program',
                          label: 'Agency, Program office or Division',
                          order: 5,
                          required: true,
                        },
                      ]}
                      data={atuPackage?.agencySecurityOfficer || {}}
                    />
                    {!atuPackage?.thirdPartyReps ||
                      (atuPackage?.thirdPartyReps?.length === 0 && (
                        <SlimAlert type="info">
                          No third party representatives are listed. If this site is managed by a
                          third party contractor, please add a
                        </SlimAlert>
                      ))}
                    {atuPackage?.thirdPartyReps?.length > 0 &&
                      atuPackage.thirdPartyReps.map((rep, index) => (
                        <ItemCallout
                          key={index}
                          sectionName={`Third Party Organization/ Company Representative #${index + 1}`}
                          attributes={[
                            { key: 'fullName', label: 'Full Name', order: 1, required: true },
                            { key: 'title', label: 'Title', order: 2 },
                            { key: 'email', label: 'Email', order: 3, required: true },
                            { key: 'phone', label: 'Phone Number', order: 4, required: true },
                            {
                              key: 'company',
                              label: 'Agency, Program office or Company name',
                              order: 5,
                              required: true,
                            },
                          ]}
                          data={rep.thirdPartyRepresentative || {}}
                        />
                      ))}
                    <H2 className="no-print">Website Information</H2>
                    <p className="print-heading">Website Information</p>
                    <p>
                      Provide foundational information about the website, including mission,
                      audience, content type, sensitivity, and FIPS-199 Categorization.
                    </p>
                    <ItemCallout
                      attributes={[
                        { key: 'siteName', label: 'Site Name', order: 1, required: true },
                        { key: 'accronym', label: 'Acronym', order: 2, required: true },
                        {
                          key: 'agency',
                          label: 'Agency/Site Organization',
                          order: 3,
                          required: true,
                        },
                        {
                          key: 'description',
                          label: 'Site Description',
                          order: 4,
                          required: true,
                        },
                      ]}
                      data={atuPackage?.websiteInfo || {}}
                    />
                    <H2 className="no-print">Content Review Checklist</H2>
                    <p className="print-heading">Content Review Checklist</p>
                    <ItemVerification
                      sectionName="Personally Identifiable Information (PII)"
                      description="Content was carefully reviewed to confirm it does not contain PII that could compromise privacy or violate compliance standards."
                      value={atuPackage?.piiCheck}
                    />
                    <ItemVerification
                      sectionName="Sensitive Government Information"
                      description="Content was carefully reviewed to confirm it does not contain any sensitive government information."
                      value={atuPackage?.sensitiveCheck}
                    />
                    <ItemVerification
                      sectionName="Links and Attachments"
                      description="Content was carefully reviewed to verify that all links and attachments are secure, appropriate, and compliant with public web standards."
                      value={atuPackage?.linksCheck}
                    />
                    <ItemVerification
                      sectionName="Formatting and Accessibility"
                      description="Content was reviewed to confirm accessibility compliance and clarity for all users."
                      value={atuPackage?.formatCheck}
                    />
                    <H2 className="no-print">Security Controls Review Summary</H2>
                    <p className="print-heading">Security Controls Review Summary</p>
                    <Callout>
                      <H3>Access Control (AC)</H3>
                      <H4>Administrative Access</H4>
                      <p>
                        Access to the website&apos;s Content Management System (CMS) customer portal is
                        restricted to authorized personnel using at least multi-factor
                        authentication (MFA). All org/space user accounts are managed through the
                        User Account and Authentication (UAA) service provided by Cloud.gov.
                      </p>
                      <H4>Role-Based Access</H4>
                      <p>
                        Permissions are assigned based on roles to limit access and enforce least
                        privilege.
                      </p>
                      <ul>
                        <li>
                          <strong>User:</strong> Content editor (no publishing rights)
                        </li>
                        <li>
                          <strong>Manager:</strong> Reviews and publishes content, and can add or
                          remove User
                        </li>
                        <li>
                          <strong>Admin:</strong> Pages engineer/Pages Operator (technical
                          oversight)
                        </li>
                      </ul>
                      <H4>Account Creation</H4>
                      <p>
                        The customer is responsible for identifying their authorized users and
                        designating who oversees internal approval processes. They must notify
                        cloud.gov Pages when user or account details change to ensure accurate and
                        up-to-date access management. Additionally, the customer is expected to
                        incorporate account management into their personnel onboarding, offboarding,
                        and transfer procedures. It is important to note that cloud.gov does not
                        support or assume responsibility for account sharing.
                      </p>
                      <H4>Account Management</H4>
                      <p>
                        Cloud.gov regularly monitors usage of all Pages org and space accounts and
                        conducts periodic reviews to ensure proper oversight. Inactive or terminated
                        user accounts are promptly disabled or removed in line with agency policy.
                        The cloud.gov Pages service supports only a single level of authorization;
                        customers cannot configure custom access policies.{' '}
                      </p>
                      <p>Artifacts:</p>
                      <ul>
                        <li>Completed Site User Access Management table</li>
                        <li>User Access Reviews</li>
                        <li>Authentication Mechanism</li>
                      </ul>
                      <Table columns={['Email', 'Role']} rows={userRows} />
                    </Callout>
                    <Callout>
                      <H3>Audit and Accountability (AU)</H3>
                      <H4>Action Logging</H4>
                      <p>
                        All administrative actions, including content publishing and user
                        management, are logged automatically by the platform.
                      </p>
                      <H4>Attribution</H4>
                      <p>
                        Logs capture user identifiers, timestamps, and actions performed, enabling
                        traceability and accountability.
                      </p>
                      <H4>Retention and Review</H4>
                      <p>
                        Logs are retained for a minimum of one year and reviewed periodically by
                        Cloud.gov and Pages admins or compliance personnel.
                      </p>
                      <H4>Audit logs</H4>
                      <p>
                        Audit logs are also captured in the customer portals to identify the
                        individual responsible for actions such as creating, editing, publishing
                        content, uploading or deleting files.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Privacy Awareness Training (AT)</H3>
                      <p>
                        Inherited from agencies through the specific Security and Privacy Awareness
                        trainings.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Identification and Authentication (IA)</H3>
                      <p>
                        Access to Cloud.gov Publisher begins with an invitation. Site owners or
                        managers invite users to join the site organization or the site management
                        portal. The hosting application is PIV-enabled through Cloud.gov, which
                        enforces MFA and allows customer agencies to authenticate using their PIV
                        via their enterprise identity systems.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Security Assessment and Authorization (CA)</H3>
                      <p>
                        Site owners and managers complete the ATU process and propose the final
                        document to their agency&apos;s security and compliance official for
                        approval.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Configuration Management (CM)</H3>
                      <H4>Change Control Process</H4>
                      <p>
                        Restrict to content only. All content changes must follow an internal review
                        and approval workflow before being published to the live site. Refer to the{' '}
                        <strong>Site Content Review Before Publication</strong> for Cloud.gov Pages
                        guidance.
                      </p>
                      <H4>Version Control</H4>
                      <p>
                        The platform maintains a version history to allow rollback to previous
                        content states if necessary. Customers can configure templates for view or
                        layout purposes which will be captured in the overall site backup.
                      </p>
                      <H4>Documentation and Reviews</H4>
                      <p>
                        Cloud.gov Publisher configuration settings are documented and reviewed by
                        the Cloud.gov Pages at least annually or when major updates occur.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>System and Communications Protection (SC)</H3>
                      <H4>Secure Access</H4>
                      <p>
                        All web traffic is served over HTTPS, ensuring encryption of data in
                        transit. All site files are encrypted in AWS S3 buckets.
                      </p>
                      <H4>Web Application Protections</H4>
                      <p>
                        The hosting platform implements protections against common web-based threats
                        such as cross-site scripting (XSS), cross-site request forgery (CSRF), and
                        code injection.
                      </p>
                      <H4>File Uploads</H4>
                      <p>
                        Any uploaded files (e.g., PDFs, images) are scanned for malware before
                        publication to the site.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>System Integrity and Maintenance (SI)</H3>
                      <H4>Platform Updates</H4>
                      <p>
                        Cloud.gov Pages, the provider is responsible for routine patching and
                        vulnerability remediation, security advisories or planned maintenance.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Contingency Planning (CP)</H3>
                      <H4>Data Backup</H4>
                      <p>
                        Website code and content are backed up at regular intervals (daily
                        incremental and weekly full snapshots).
                      </p>
                      <H4>Restoration Plan</H4>
                      <p>
                        An internal documented process exists to restore websites in the event of
                        intentional or unintentional deletion, corruption, or other disruptions.
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Agency-specific Website Compliance Policies Requirements</H3>
                      <p>
                        <strong>
                          Content was reviewed to ensure the messaging is consistent with approved
                          agency communications and guidelines and is compliant with legal mandates
                          and agency-specific policies.
                        </strong>
                      </p>
                      <p>
                        This ATU serves as the security and compliance document for the website.
                        Cloud.gov Pages maintains an overarching System Security Plan (SSP) that is
                        updated annually or as significant changes occur.
                      </p>
                    </Callout>
                    <H2 className="no-print">Final Review and Signature</H2>
                    <p className="print-heading">Final Review and Signature</p>
                    <ItemVerification
                      sectionName="Final quality and compliance checks must be completed before publishing."
                      description="Confirm the following: Review has been completed by the designated content reviewer; Final approval has been provided by the appropriate content owner or manager; All content was reviewed and approved according to agency publishing procedures."
                      value={atuPackage?.finalReviewCheck}
                    />
                    <H3>Required Signatures</H3>
                    <p>
                      This Site Authority to Use (ATU) is valid until one of the following
                      conditions occurs which will require a new site ATU review.
                    </p>
                    <ul>
                      <li>
                        The data types (sensitivity) or information presented on the site change.
                      </li>
                      <li>A significant security incident occurs.</li>
                      <li>
                        There are deviations from the ATU maintenance requirements, specifically
                        regarding content review and its alignment with the ATU process.
                      </li>
                    </ul>
                    <H3>Agency Website Owner</H3>
                    <Callout>
                      <SignatureCallout fullName={atuPackage?.agencyOwner?.fullName} />
                    </Callout>
                    <H3>Agency Website Manager</H3>
                    <Callout>
                      <SignatureCallout fullName={atuPackage?.agencySiteManager?.fullName} />
                    </Callout>
                    <H3>Information Security Office Representative</H3>
                    <p>
                      The Agency&apos;s Information Security Office Representative signature
                      certifies that the information contained in this document has been reviewed
                      and that the site is appropriately configured to what is required for its
                      operation.
                    </p>
                    <Callout>
                      <SignatureCallout fullName={atuPackage?.agencySecurityOfficer?.fullName} />
                    </Callout>
                    <Callout className="no-print" backgroundColorClass="bg-primary-lighter">
                      <H2>Download a copy of the ATU document</H2>
                      <p>
                        Forward a copy of the signed ATU document to Pages Compliance for filing.
                        Email: pages-support@cloud.gov
                      </p>
                      <DownloadButton ref={printableSectionRef} />
                    </Callout>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Package
