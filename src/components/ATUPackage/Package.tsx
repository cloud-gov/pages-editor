'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { H2, H3 } from '@/components/ui/prose-headings'
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

const ManagerCallout = ({
  sectionName,
  fullName,
  title,
  email,
  phoneNumber,
  program,
}: {
  sectionName: string
  fullName?: string
  title?: string
  email?: string
  phoneNumber?: string
  program?: string
}) => {
  const missingFields = requiredFields({ fullName, email, phoneNumber })
  const calloutColorClass = missingFields.length > 0 ? 'bg-secondary-lighter' : 'bg-base-lightest'

  return (
    <>
      {missingFields.length > 0 && (
        <SlimAlert type="error">
          The following required fields are missing for <strong>{sectionName}</strong>:{' '}
          {missingFields.join(', ')}
        </SlimAlert>
      )}
      <H3>{sectionName}</H3>
      <Callout backgroundColorClass={calloutColorClass}>
        <p>
          <strong>Full Name:</strong> {fullName}
        </p>
        <p>
          <strong>Title:</strong> {title}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Phone Number:</strong> {phoneNumber}
        </p>
        {program && (
          <p>
            <strong>Agency, Program office or Division:</strong> {program}
          </p>
        )}
      </Callout>
    </>
  )
}

const Package = ({ siteUsers, atuPackage }) => {
  const printableSectionRef = useRef<HTMLDivElement | null>(null)
  const userRows = userTableRows(siteUsers)

  console.log('ATU Package data:', atuPackage)

  return (
    <main id="atu-package" ref={printableSectionRef}>
      <section className="usa-section section section--white align-left">
        <div className="grid-container">
          <div className="grid-row">
            <div className="tablet:grid-col-10">
              <div className="section__container">
                <div className="section__slot">
                  <div className="flex-column margin-bottom-5">
                    <h1>Authority to Use (ATU) Package</h1>
                    <p className="margin-top-2">
                      ATU template for external (non-GSA) agencies. See ATU guide here.
                    </p>
                  </div>
                  <section className="usa-prose padding-bottom-8">
                    <SlimAlert type="info">
                      Complete the forms in the{' '}
                      <Link href="/admin/globals/compliance-config">ATU Compliance Config</Link> and
                      then download a copy for Pages Compliance.
                    </SlimAlert>
                    <H2>Site Point of Contacts (POCs)</H2>
                    <ManagerCallout
                      sectionName="Agency Website Owner"
                      fullName={atuPackage?.agencyOwner?.fullName}
                      title={atuPackage?.agencyOwner?.title}
                      email={atuPackage?.agencyOwner?.email}
                      phoneNumber={atuPackage?.agencyOwner?.phone}
                    />
                    <ManagerCallout
                      sectionName="Agency Website Manager"
                      fullName={atuPackage?.agencySiteManager?.fullName}
                      title={atuPackage?.agencySiteManager?.title}
                      email={atuPackage?.agencySiteManager?.email}
                      phoneNumber={atuPackage?.agencySiteManager?.phone}
                    />
                    <ManagerCallout
                      sectionName="Agency Information Security Office Representative"
                      fullName={atuPackage?.agencySecurityOfficer?.fullName}
                      title={atuPackage?.agencySecurityOfficer?.title}
                      email={atuPackage?.agencySecurityOfficer?.email}
                      phoneNumber={atuPackage?.agencySecurityOfficer?.phone}
                      program={atuPackage?.agencySecurityOfficer?.program}
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
                        <ManagerCallout
                          key={index}
                          sectionName={`Third Party Organization/ Company Representative #${index + 1}`}
                          fullName={rep.fullName}
                          title={rep.title}
                          email={rep.email}
                          phoneNumber={rep.phone}
                          program={rep.program}
                        />
                      ))}
                    <H2>Website Information</H2>
                    <p>
                      Provide foundational information about the website, including mission,
                      audience, content type, sensitivity, and FIPS-199 Categorization.
                    </p>
                    <Callout>
                      <p>
                        <strong>Site Name</strong>
                      </p>
                      <p>The Example Website</p>
                      <p>
                        <strong>Acronym</strong>
                      </p>
                      <p>GSA</p>
                      <p>
                        <strong>Agency/Site Organization</strong>
                      </p>
                      <p>The office</p>
                      <p>
                        <strong>Site Description</strong>
                      </p>
                      <p>This is the description of the example website.</p>
                    </Callout>
                    <H2>Content Review Checklist</H2>
                    <Callout>
                      <H3>Personally Identifiable Information (PII)</H3>
                      <p>
                        Content was carefully reviewed to confirm it does not contain PII that could
                        compromise privacy or violate compliance standards.
                      </p>
                      <p>[X] Yes</p>
                      <p>[ ] No</p>
                    </Callout>
                    <Callout>
                      <H3>Sensitive Government Information</H3>
                      <p>
                        Content was carefully reviewed to confirm it does not contain any
                        information that could compromise government operations or violate
                        disclosure policies.
                      </p>
                      <p>[ ] Yes</p>
                      <p>[X] No</p>
                      <p>
                        <strong>Comments</strong>
                      </p>
                      <p>This is the comments section.</p>
                    </Callout>
                    <Callout>
                      <H3>Links and Attachments</H3>
                      <p>
                        Content was carefully reviewed to verify that all links and attachments are
                        secure, appropriate, and compliant with public web standards.
                      </p>
                      <p>[ ] Yes</p>
                      <p>[X] No</p>
                    </Callout>
                    <Callout>
                      <H3>Formatting and Accessibility</H3>
                      <p>
                        Content was reviewed to confirm accessibility compliance and clarity for all
                        users.
                      </p>
                      <p>[ ] Yes</p>
                      <p>[X] No</p>
                    </Callout>
                    <H2>Security Controls Review Summary</H2>
                    <Callout>
                      <H3>Access Control (AC)</H3>
                      <p>Artifacts:</p>
                      <ul>
                        <li>Completed Site User Access Management table</li>
                        <li>User Access Reviews</li>
                        <li>Authentication Mechanism</li>
                      </ul>
                      <Table columns={['Email', 'Role']} rows={userRows} />
                    </Callout>
                    <Callout>
                      <H3>Identification and Authentication (IA)</H3>
                      <p>Artifacts:</p>
                      <ul>
                        <li>
                          Screenshot showing that Site Owner, Manager and Content Creator (Users)
                          are using a PIV-enabled or MFA solution for access to Cloud.gov Publisher.
                        </li>
                      </ul>
                    </Callout>
                    <H2>Final Review and Signature</H2>
                    <Callout>
                      <p>
                        Final quality and compliance checks must be completed before publishing.
                      </p>
                      <p>Confirm the following:</p>
                      <ul>
                        <li>Review has been completed by the designated content reviewer</li>
                        <li>
                          Final approval has been provided by the appropriate content owner or
                          manager
                        </li>
                        <li>
                          All content was reviewed and approved according to agency publishing
                          procedures.
                        </li>
                      </ul>
                      <p>[ ] Yes</p>
                      <p>[ ] No</p>
                    </Callout>
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
                    <Callout>
                      <H3>Agency Website Owner</H3>
                      <p>
                        <strong>Full Name:</strong>
                        Test Name
                      </p>
                      <p>
                        <strong>Signature:</strong>_____________________
                      </p>
                      <p>
                        <strong>Date:</strong>______________________
                      </p>
                    </Callout>
                    <Callout>
                      <H3>Agency Website Manager</H3>
                      <p>
                        <strong>Full Name:</strong>
                        Test Name
                      </p>
                      <p>
                        <strong>Signature:</strong>_____________________
                      </p>
                      <p>
                        <strong>Date:</strong>______________________
                      </p>
                    </Callout>
                    <p>
                      The Agency&apos;s Information Security Office Representative signature
                      certifies that the information contained in this document has been reviewed
                      and that the site is appropriately configured to what is required for its
                      operation.
                    </p>
                    <p>[ ] The ATU for [Website Name] is approved.</p>
                    <p>[ ] The ATU for [Website Name] is not approved.</p>
                    <Callout>
                      <H3>Information Security Office Representative</H3>
                      <p>
                        <strong>Full Name:</strong>
                        Test Name
                      </p>
                      <p>
                        <strong>Signature:</strong>_____________________
                      </p>
                      <p>
                        <strong>Date:</strong>______________________
                      </p>
                    </Callout>
                    <Callout backgroundColorClass="bg-primary-lighter">
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
