import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Table from '@/components/ui/table'
import { USWDSInit } from '@/components/utilities/USWDSInPageNavInit.client'
import { SetStepNav } from '@/components/utilities/SetStepNav.client'
import Callout from '@/components/ui/callout'
import { H2, H3, H4 } from '@/components/ui/prose-headings'
import { SlimAlert } from '@/components/ui/alert'
import Accordion from '@/components/ui/accordion'

const SignatureBlock = () => {
  return (
    <div>
      <br />
      <p className="font-sans-md">Name: John Doe</p>
      <br />
      <p className="font-sans-md">Signature: John Doe</p>
      <br />
      <p className="font-sans-md">Date: 1/1/1</p>
    </div>
  )
}

/**
 * User Roles & Permissions — Custom Root View (Server Component)
 * Wrapped in DefaultTemplate so the admin chrome (header, sidebar, breadcrumbs) renders.
 * The in-page nav aside + headings in <main> are picked up by USWDS JS initialized by the client component.
 */
export default function SiteCompliance(props: AdminViewServerProps) {
  const { initPageResult, params, searchParams } = props
  const { req, permissions, locale, visibleEntities } = initPageResult
  const user = req.user

  if (!user) {
    // redirect to login if not logged in
    redirect(`/admin/login`)
  }

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={visibleEntities}
    >
      {/* Initialize USWDS In-page nav, accordion on the client and fix breadcrumbs */}
      <USWDSInit />
      <SetStepNav />

      {/* Main content */}
      <Gutter>
        {/* In-page nav + content layout */}
        <div className="usa-in-page-nav-container">
          {/* USWDS JS auto-populates this aside based on headings inside <main> */}
          <aside
            className="usa-in-page-nav"
            data-title-text="On this page"
            data-title-heading-level="h4"
            data-scroll-offset="0"
            data-root-margin="0px 0px 0px 0px"
            data-threshold="1"
          />
          <main id="main-content">
            <section className="usa-section section section--white align-left">
              <div className="grid-container">
                <div className="grid-row">
                  <div className="tablet:grid-col-10">
                    <div className="section__container">
                      <div className="section__slot">
                        <div className="flex-column margin-bottom-5">
                          <h1>Authority to Use (ATU) Guide</h1>
                          <p className="margin-top-2">
                            Site Content Review Before Publication for external (non-GSA) agencies.
                            Complete the ATU template here.
                          </p>
                        </div>
                        <section className="usa-prose padding-bottom-8">
                          <H2>Overview</H2>
                          <H3>Revision History</H3>
                          <Table
                            columns={['Date', 'Version', 'Pages', 'Description', 'Author']}
                            rows={[
                              [
                                { column: 'Date', value: '08/2025' },
                                { column: 'Version', value: '1.0' },
                                { column: 'Pages', value: 'All' },
                                { column: 'Description', value: 'Initial Template' },
                                {
                                  column: 'Author',
                                  value: 'Cloud.gov Pages Security and Compliance Lead',
                                },
                              ],
                              [
                                { column: 'Date', value: '09/2025' },
                                { column: 'Version', value: '1.0' },
                                { column: 'Pages', value: 'All' },
                                { column: 'Description', value: 'Update Theme' },
                                { column: 'Author', value: 'Cloud.gov Design' },
                              ],
                              [
                                { column: 'Date', value: '01/2026' },
                                { column: 'Version', value: '1.0' },
                                { column: 'Pages', value: 'All' },
                                { column: 'Description', value: 'Reviewed and finalized' },
                                {
                                  column: 'Author',
                                  value: 'Cloud.gov Pages Security and Compliance Lead',
                                },
                              ],
                            ]}
                          />
                          <SlimAlert type="info">
                            This document was developed by the Cloud.gov Pages Compliance team as a
                            guideline and{' '}
                            <strong>
                              does not supersede any internal agency policies or procedures
                            </strong>
                            . Agencies may choose to follow the Cloud.gov Pages ATU process{' '}
                            <span className="text-underline">or</span> use their own existing
                            ATO/ATU processes.
                          </SlimAlert>
                          <H2>Purpose</H2>
                          <p>
                            This guide provides step-by-step instructions for website owners,
                            managers, and agencies security representatives to accurately and
                            efficiently complete the Authority to Use (ATU) Template for static
                            websites hosted on Cloud.gov Publisher.
                          </p>
                          <p>
                            Following these instructions ensure compliance with federal security,
                            privacy, and IT policies.
                          </p>
                          <SlimAlert type="info">
                            To begin, use the ATU template provided at the following link to
                            complete the documentation for your website:{' '}
                            <strong className="text-underline">
                              Authority to Use (ATU) Template
                            </strong>
                          </SlimAlert>
                          <H2>Hosting and Platform Overview</H2>
                          <p>
                            This section provides important information about our hosting platform,
                            including our leveraged FedRAMP authorizations.
                          </p>
                          <H3>Points of Contact (POCs)</H3>
                          <p>
                            Provide the required Points of Contact (POC) information on the
                            designated website.
                          </p>
                          <ul>
                            <li className="text-bold">Website Owner/Manager</li>
                            <li className="text-bold">
                              Agency Information Security Office Representative
                            </li>
                            <li className="text-bold">
                              Developer Organization/Company Representative(s)
                            </li>
                          </ul>
                          <H2>Website Information</H2>
                          <p>
                            Capture foundational information about the website, including mission,
                            audience, content type, sensitivity, and FIPS-199 Categorization.
                          </p>
                          <p>Complete the table on the template using the following guidance:</p>
                          <Table
                            columns={['Field', 'Instructions']}
                            rows={[
                              [
                                { column: 'Field', value: 'Site Name' },
                                {
                                  column: 'Instructions',
                                  value:
                                    'Enter the full name of the website. Example: Agency National Public Information Sharing',
                                },
                              ],
                              [
                                { column: 'Field', value: 'Telephone' },
                                {
                                  column: 'Instructions',
                                  value: 'Provide a shortened name or abbreviation. Example: ANPIS',
                                },
                              ],
                              [
                                {
                                  column: 'Field',
                                  value: 'Company/Agency, Program Office or Division',
                                },
                                {
                                  column: 'Instructions',
                                  value:
                                    'List the agency or office responsible for the website. Example: General Services Administration (GSA), Technology Transformation Services (TTS)',
                                },
                              ],
                            ]}
                          />
                          <H3>Site Description</H3>
                          <p>
                            Describe the website&apos;s purpose, audience, mission, and content
                            type.
                          </p>
                          <ul>
                            <li>Use 2–5 sentences.</li>
                            <li>
                              Mention whether the site provides information, tools, datasets, forms,
                              publications, event details, etc.
                            </li>
                            <li>
                              Include references to any federal programs or mandates the site
                              supports.
                            </li>
                            <li>Intended community, Audience of the site</li>
                          </ul>
                          <p>
                            <strong>EXAMPLE:</strong> The Agency Nation Public Information Sharing
                            website provides access to research, reports, and tools that support the
                            federal government&apos;s digital transformation. Its mission is to
                            share best practices, success stories, and technical guidance that
                            promote innovation across federal agencies. The website is publicly
                            accessible and serves both government employees and the public.
                          </p>
                          <H3>High-Level Site Architecture (Data flow diagram)</H3>
                          <p>
                            Below is a link to a Pages-hosted site diagram that illustrates how your
                            site fits within the Pages infrastructure, and the diagram has already
                            been included in the ATU template, so no further action is required on
                            your part.
                          </p>
                          <Link
                            className="padding-y-2 text-bold"
                            href={
                              'https://github.com/cloud-gov/system-diagrams/blob/main/source/diagrams/pages/editor-builds.mmd'
                            }
                          >
                            Flow Diagram of Publishing and Editing Site Architecture in Pages
                          </Link>
                          <H2>Website Content</H2>
                          <p>
                            Cloud.gov Publisher enables agencies to efficiently disseminate public
                            knowledge and information through static, public-facing websites. Using
                            the built-in site editor and pre-designed templates, customers or
                            agencies can easily create and manage content with consistency and
                            simplicity.
                          </p>
                          <p>
                            Since the platform is designed exclusively for non-Personally
                            Identifiable Information (PII), non-sensitive data, publicly accessible
                            information, site visitors do not need to authenticate. This ensures
                            streamlined access to content while maintaining a secure and controlled
                            publishing environment.
                          </p>
                          <H2>Site Categorization and Privacy</H2>
                          <SlimAlert type="info">
                            Do not make any changes to the Security Categorization (FIPS 199) or the
                            Privacy determination in the table below, on the ATU template. All
                            websites hosted on Cloud.gov Pages are specifically designed to handle
                            only non-Personally Identifiable Information (PII), non-sensitive data,
                            and publicly accessible content that does not require login from site
                            visitors.
                          </SlimAlert>
                          <Table
                            showHeader={false}
                            rows={[
                              [
                                { column: 'Col1', value: 'Security Categorization (FIPS 199)' },
                                {
                                  column: 'Col2',
                                  value: 'Low',
                                },
                              ],
                              [
                                { column: 'Col1', value: 'Privacy' },
                                {
                                  column: 'Col2',
                                  value: 'No Personally Identifiable Information (PII)',
                                },
                              ],
                            ]}
                          />
                          <H2>Content Review Process</H2>
                          <p>
                            This section of the document outlines a{' '}
                            <strong>Guide for Public Content Review Decision Tree</strong>, a{' '}
                            <strong>Review Workflow</strong>, and a{' '}
                            <strong>Review Checklist</strong>. Use them to assess whether content is
                            suitable for public release and aligns with your agency&apos;s security,
                            privacy, and compliance requirements.
                          </p>
                          <H3>Content Review Decision Tree</H3>
                          <p>
                            This is the first step in determining whether content or ideas are
                            suitable for public release on the Cloud.gov Pages static website.
                          </p>
                          <H4>How to use the Decision Tree?</H4>
                          <p>
                            Use the <strong>Decision Tree</strong> as a step-by-step guide to assess
                            whether content is ready for public release. Begin at the top and answer
                            each question as you move through the branches.
                          </p>
                          <p>
                            Your answers will guide you through a structured review process that
                            covers key areas, including:
                          </p>
                          <ul>
                            <li>Security</li>
                            <li>Privacy</li>
                            <li>Compliance</li>
                            <li>Accessibility</li>
                            <li>Alignment with your agency policy</li>
                          </ul>
                          <p>
                            At each decision point, follow the recommended action, such as revising,
                            the content, escalating it for further review, or approving it for
                            release.
                          </p>
                          <Link
                            className="padding-y-2 text-bold"
                            href={'/assets/guide_for_public_content_review_decision_tree.pdf'}
                          >
                            Guide for Public Content Review - Decision Tree
                          </Link>
                          <SlimAlert type="info">
                            If, after following the steps in the decision tree, it is evident that
                            the content clearly qualifies as public information, you can skip the
                            Content Review Workflow section and go straight to the Content Review
                            Checklist. Otherwise, If the content&apos;s status is unclear, continue
                            with the review workflow to ensure a thorough evaluation, so nothing is
                            overlooked.
                          </SlimAlert>
                          <H3>Content Review Workflow</H3>
                          <H4>Content Review Workflow Overview</H4>
                          <p>
                            Effective content management is critical to protecting the integrity,
                            security, and credibility of an organization&apos;s communications. A
                            clearly defined <strong>Content Review Workflow</strong> ensures that
                            all materials are thoroughly evaluated before publication.
                          </p>
                          <p>Cloud.gov Pages content review workflow process helps:</p>
                          <ul>
                            <li>
                              Identify and reduce risks related to accuracy, privacy, security, and
                              policy compliance
                            </li>
                            <li>
                              Maintain consistent quality and accountability across all published
                              content
                            </li>
                            <li>Streamline collaboration among team members</li>
                          </ul>
                          <SlimAlert type="info">
                            Notes: We have included example scenarios with each step to support your
                            understanding and make the process easier to follow.
                          </SlimAlert>
                          <H4>Step 1: Intentional Public Access</H4>
                          <Callout>
                            <p>
                              <strong>Is the content intended for public access?</strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, proceed to <strong>Step 2</strong>.
                              </li>
                              <li>
                                If{' '}
                                <strong>
                                  NO, the content is not suitable for hosting on Cloud.gov Pages
                                </strong>
                                but may be intended for internal use or a restricted-access site.
                                Please revise as needed or forward it to the relevant internal team
                                (such as your Privacy Office) for further processing.
                              </li>
                            </ul>
                          </Callout>
                          <Accordion title="Scenario One">
                            <p>
                              <em>
                                A federal agency wants to provide the public with easy, reliable
                                access to environmental data, regulatory updates, and educational
                                resources.
                              </em>
                            </p>{' '}
                            <p>
                              This content <strong>is intended for public access</strong>. It
                              provides information that supports public awareness and transparency
                              and therefore meets the criteria to <strong>proceed to Step 2</strong>
                              .
                            </p>
                          </Accordion>
                          <Accordion title="Scenario Two">
                            <p>
                              <em>
                                You are reviewing a document titled “Meeting Notes - Internal Use
                                Only.”
                              </em>
                            </p>{' '}
                            <p>
                              This content is <strong>not intended for public access</strong>. It is
                              labeled for <strong>&quot;internal use only&quot;</strong> and likely
                              contains sensitive or non-public information.{' '}
                              <strong>It must not be published</strong> on any Cloud.gov Pages
                              static websites. It should be stored on an internal or
                              restricted-access system or sent to the appropriate internal team for
                              handling.
                            </p>
                          </Accordion>
                          <H4>
                            Step 2: Absence of Personal Information about Individuals or Personally
                            Identifiable Information (PII)
                          </H4>
                          <SlimAlert type="info">
                            The Cloud.gov Pages is not intended to host content with PII
                            information. Pages sites may front other applications on Cloud.gov or
                            other systems, but PII should not be included in the content as all
                            information is public.
                          </SlimAlert>
                          <p>
                            <strong>Personally Identifiable Information (PII)</strong> refers to any
                            data that could be used to identify a specific individual. Examples
                            include, but are not limited to:
                          </p>
                          <ul>
                            <li>
                              <strong>Full Name:</strong> First, middle, and last names.
                            </li>
                            <li>
                              <strong>Date of Birth:</strong> The specific day, month, and year an
                              individual was born.
                            </li>
                            <li>
                              <strong>Address:</strong> Street address, city, state, and ZIP code.
                            </li>
                            <li>
                              <strong>Social Security Number (SSN):</strong> A unique number
                              assigned to each U.S. citizen and permanent resident.
                            </li>
                            <li>
                              <strong>Passport Number:</strong> A unique identifier issued by a
                              government for international travel.
                            </li>
                            <li>
                              <strong>Driver&apos;s License Number:</strong> A unique number
                              assigned to licensed drivers.
                            </li>
                            <li>
                              <strong>Phone Number:</strong> Personal or business phone numbers that
                              can be used to contact an individual.
                            </li>
                            <li>
                              <strong>Email Address:</strong> An online identifier used to
                              communicate with an individual.
                            </li>
                            <li>
                              <strong>Financial Information:</strong> Credit card numbers, bank
                              account details, and other financial data.
                            </li>
                            <li>
                              <strong>Health Information:</strong> Medical records, insurance
                              information, and other details related to an individual&apos;s health.
                            </li>
                          </ul>
                          <p>For more information:</p>
                          <ul>
                            <li className="text-bold">Your agency privacy policy</li>
                            <li className="text-bold">
                              National Archives and Records Administration{' '}
                              <Link href={'https://www.archives.gov/'}>(NARA)</Link>
                            </li>
                          </ul>
                          <Callout>
                            <p>
                              Reading from the above and other available resources, does the content
                              contain Personal Information or Personally Identifiable Information
                              (PII)?{' '}
                            </p>
                            <ul>
                              <li>
                                <strong>If YES, do not publish.</strong> Content containing PII must
                                not be publicly released. Work with your internal team (e.g., the
                                Privacy Office) to review, redact, or determine the proper handling
                                of the information.
                              </li>
                              <li>
                                <strong>If NO</strong>, proceed to <strong>Step 3.</strong>
                              </li>
                            </ul>
                          </Callout>
                          <H4>
                            Step 3: Explicitly approved Personal Information about Individuals or
                            Personally Identifiable Information (PII)
                          </H4>
                          <p>
                            If retaining the personal information in your content is necessary, has
                            its inclusion been explicitly approved for public release?
                          </p>
                          <p>
                            You can confirm this by checking if the content meets at least one of
                            the following conditions:
                          </p>
                          <ul className="add-list-reset">
                            <li>
                              &#10003; Is this PII already public and intended for disclosure (e.g.,
                              contact information for a public official which is already public)?
                            </li>
                            <li>
                              &#10003; Has the individual provided formal written consent for public
                              release?
                            </li>
                            <li>
                              &#10003; Has the agency explicitly cleared this PII for public release
                              under its privacy policy?
                            </li>
                          </ul>
                          <Callout>
                            <p>
                              <strong>
                                If retaining the personal information in your content is necessary,
                                has its inclusion been explicitly approved for public release?
                              </strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, proceed to <strong>Step 4.</strong>
                              </li>
                              <li>
                                If <strong>NO</strong>, stop here. Do not publish the content.
                                Redact the PII or escalate the issue to your legal or privacy team
                                for further review.
                              </li>
                            </ul>
                          </Callout>
                          <SlimAlert type="info">
                            Note: Under OMB guidance, along with other federal policies (such as
                            NIST SP800-122), Personally Identifiable Information (PII) refers to any
                            data that can be used to distinguish or trace an individual&apos;s
                            identity, either alone or in combination with other information.
                            However, for many government employees, especially those in
                            public-facing roles, work-related contact details such as name, office
                            email, phone number, and office address are typically considered public
                            information and not treated as sensitive.
                          </SlimAlert>
                          <H4>
                            Step 4: Absence of references to internal or sensitive government
                            information
                          </H4>
                          <p>
                            Before publishing, review the content for any references to{' '}
                            <strong>internal</strong> or
                            <strong>sensitive government information</strong>, which may not be
                            appropriate for public release.
                          </p>
                          <p>Check for any of the following examples:</p>
                          <ul>
                            <li>Draft policy documents</li>
                            <li>Procurement-sensitive or financial data</li>
                            <li>Internal URLs, email threads, or SharePoint/Drive links</li>
                            <li>System information (e.g., architecture diagrams, server names)</li>
                            <li>Law enforcement or homeland security-sensitive content</li>
                          </ul>
                          <Callout>
                            <p>
                              <strong>
                                Does the content reference internal or sensitive government
                                information?
                              </strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, this content may qualify as Controlled
                                Unclassified Information
                              </li>
                              <li>
                                <strong>(CUI)</strong> or otherwise violate your agency&apos;s
                                release policy. Escalate for internal clearance before proceeding.
                              </li>
                              <li>
                                If <strong>NO</strong>, proceed to <strong>Step 5.</strong>
                              </li>
                            </ul>
                          </Callout>
                          <H4>Step 5: Sanitized attached files</H4>
                          <p>
                            Before publishing, ensure that <strong>all attached files</strong> (such
                            as PDFs, images, spreadsheets, or other downloadable documents) are
                            properly reviewed and sanitized. Unchecked files may unintentionally
                            expose internal information or fail to meet accessibility and security
                            standards.
                          </p>
                          <p>Check for the following:</p>
                          <ul className="add-list-reset">
                            <li>
                              &#10003; Files do not contain hidden metadata or tracked changes
                            </li>
                            <li>
                              &#10003; No internal names, email addresses, or file paths are
                              embedded
                            </li>
                            <li>&#10003; No illicit or inappropriate content</li>
                            <li>&#10003; Files have been scanned for malware</li>
                            <li>
                              &#10003; PDFs are tagged and meet Section 508 accessibility standards
                            </li>
                            <li>&#10003; Images include appropriate alt text for accessibility</li>
                          </ul>
                          <Callout>
                            <p>
                              <strong>
                                Are all attached files (PDFs, images, etc.) reviewed and sanitized?
                              </strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, proceed to <strong>Step 6</strong>.
                              </li>
                              <li>
                                If <strong>NO</strong>, stop here. All files must be{' '}
                                <strong>reviewed, cleaned, and remediated</strong> before
                                publishing.
                              </li>
                            </ul>
                          </Callout>
                          <H4>
                            Step 6: Are all external links appropriate and safe for public use?
                          </H4>
                          <p>
                            Before publishing, carefully check all external links in your content to
                            ensure they are secure, trustworthy, and suitable for a public audience.
                          </p>
                          <p>
                            Confirm the following <strong>(These are just a few examples)</strong>:
                          </p>
                          <ul className="add-list-reset">
                            <li>
                              &#10003; Links do not lead to internal government systems or
                              authentication-required services
                            </li>
                            <li>
                              &#10003; All URLs point to official, publicly available, and trusted
                              sources (e.g., .gov, .mil, .edu, or reputable organizations)
                            </li>
                            <li>&#10003; There are no dead links or outdated content</li>
                            <li>
                              &#10003; All URLs have been tested to confirm they are safe and active
                            </li>
                          </ul>
                          <Callout>
                            <p>
                              <strong>
                                Are all external links appropriate and safe for public use?
                              </strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, proceed to <strong>Step 7</strong>.
                              </li>
                              <li>
                                If <strong>NO</strong>, Remove or replace problematic links before
                                continuing.
                              </li>
                            </ul>
                          </Callout>
                          <H4>Step 7: Accessible and professional content</H4>
                          <p>
                            (This step applies to uploaded documents, images, and media files...)
                          </p>
                          <p>
                            Before publishing, ensure that your content is{' '}
                            <strong>
                              accessible, clearly written, and professionally formatted
                            </strong>{' '}
                            to meet both federal and agency standards.
                          </p>
                          <p>
                            Confirm the following <strong>(These are just a few examples)</strong>:
                          </p>
                          <ul className="add-list-reset">
                            <li>&#10003; Language is plain, professional, and free of jargon</li>
                            <li>
                              &#10003; Content is structured with headings, alt text, and logical
                              formatting
                            </li>
                            <li>
                              &#10003; CAll documents meet Section 508 accessibility compliance
                            </li>
                            <li>
                              &#10003; Content has been reviewed for grammar, spelling, tone, and
                              clarity
                            </li>
                          </ul>
                          <Callout>
                            <p>
                              <strong>
                                Does the content meet accessibility and editorial standards?
                              </strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, proceed to <strong>Step 8</strong>.
                              </li>
                              <li>
                                If <strong>NO</strong>, Revise and update the content to ensure
                                clarity and compliance before continuing.
                              </li>
                            </ul>
                          </Callout>
                          <H4>Step 8: Approved by designated reviewer other than the author</H4>
                          <p>
                            Before publishing, confirm that the content has undergone a proper
                            review process by someone other than the{' '}
                            <strong>author (content creator, editor)</strong> and has received
                            official approval. The designated reviewer could be your site manager or
                            your agency&apos;s privacy personnel.
                          </p>
                          <p>Check the following:</p>
                          <ul className="add-list-reset">
                            <li>
                              &#10003; Has someone other than the author (content creator, editor)
                              performed the content review?
                            </li>
                            <li>
                              &#10003;Has the content been approved by a content manager,
                              communications lead, or sites owner, or your agency&apos;s privacy
                              personnel (if required)?
                            </li>
                          </ul>
                          <Callout>
                            <p>
                              <strong>
                                Has the content been reviewed and approved by the designated
                                reviewer?
                              </strong>
                            </p>
                            <ul>
                              <li>
                                If <strong>YES</strong>, the content is safe to publish.
                              </li>
                              <li>
                                If <strong>NO</strong>, route the content for approval before
                                posting it into any Cloud.gov Pages sites.
                              </li>
                            </ul>
                          </Callout>
                          <SlimAlert type="info">
                            Note: Keep logs of completed checklists to support audit and
                            accountability requirements.
                          </SlimAlert>
                          <H2>Content Review Checklist</H2>
                          <p>
                            Before any content is released to the public, complete this checklist to
                            confirm that it meets your agency&apos;s policies and standards. This is
                            the final step in the{' '}
                            <strong>Site Content Review Before Publication</strong> for the website
                            domain and serves as a quality assurance tool for accuracy, security,
                            privacy, compliance, and accessibility.
                          </p>
                          <p>Use this checklist to ensure:</p>
                          <ul className="add-list-reset">
                            <li>
                              &#10003; The content is appropriate and ready for public release
                            </li>
                            <li>
                              &#10003; All risks related to privacy, security, and compliance are
                              addressed
                            </li>
                            <li>
                              &#10003; Agency publishing procedures and Cloud.gov Pages guidance
                              have been followed
                            </li>
                          </ul>
                          <p>
                            The Authority to Use template includes a checklist in the{' '}
                            <strong>Website Content Review Process</strong> section, which must be
                            completed.
                          </p>
                          <H3>Content Review Checklist Instructions</H3>
                          <p>
                            Each section of the checklist highlights key items, but it is not
                            exhaustive. For each item, select <strong>Yes</strong> if the step has
                            been completed. If not, select <strong>No</strong> and include comments
                            explaining why.
                          </p>{' '}
                          <p>Repeat this process for all items in the checklist.</p>
                          <H2>Security Controls Review Summary</H2>
                          <p>
                            Complete all requirements outlined under the{' '}
                            <strong>Access Control (AC)</strong> and Identification and{' '}
                            <strong>Authentication (IA)</strong> control families and attach the
                            required artifacts.
                          </p>
                          <p>
                            For all other control families, review each control to identify any
                            agency-specific requirements that are not listed or have not yet been
                            implemented, and address them as needed.
                          </p>
                          <H3>Access Control (AC)</H3>
                          <p>
                            For AC controls family, below is an example of a basic account
                            management table that can be used as a reference or adapted as needed.
                          </p>
                          <p>
                            <strong>Personally Identifiable Information (PII)</strong> refers to any
                            data that could be used to identify a specific individual. Examples
                            include, but are not limited to:
                          </p>
                          <ul>
                            <li>
                              <strong>Email Address:</strong> Provide the user&apos;s official email
                              address.
                            </li>
                            <li>
                              <strong>Assigned Roles:</strong> Specify applicable roles such as
                              User, Manager.
                            </li>
                            <li>
                              <strong>Role Description:</strong> Outline the user&apos;s
                              permissions, including allowed and restricted actions.
                            </li>
                            <li>
                              <strong>Request Date:</strong> Indicate when the account was
                              requested: via email, form, or invitation by the site manager.
                            </li>
                            <li>
                              <strong>Approval Date:</strong> Record the date the site manager or
                              owner approved the account request.
                            </li>
                            <li>
                              <strong>Account Creation Date:</strong> Note when the account was
                              officially created by the site manager or Cloud.gov Pages.
                            </li>
                            <li>
                              <strong>Account Status:</strong> Specify whether the account is
                              currently Active or Inactive.
                            </li>
                            <li>
                              <strong>Admin:</strong> Admin is not Applicable to any website user
                              account
                            </li>
                          </ul>
                          <SlimAlert type="info">
                            Note: Insert additional rows as necessary. Once complete, copy and paste
                            the table into the appropriate section of the ATU template.
                          </SlimAlert>
                          <H4>User Access Management</H4>
                          <H3>Agency-specific Website Compliance Policies Requirements</H3>
                          <p>
                            Review this section of the template to ensure you have accounted for any
                            additional agency-specific requirements not included in the Cloud.gov
                            Publisher ATU process.
                          </p>
                          <H2>Final Review and Signature</H2>
                          <p>Confirm all publishing requirements are met before going live:</p>
                          <ul className="add-list-reset">
                            <li>&#10003; Publishing procedures followed</li>
                            <li>&#10003; Review is complete</li>
                            <li>&#10003; Final approval granted</li>
                          </ul>
                          <Callout>
                            <p>☐ Yes — All items above are confirmed complete</p>
                            <p>☐ No — Add comments:</p>
                          </Callout>
                          <H3>ATU Validity Conditions</H3>
                          <p>Review the ATU validity conditions below.</p>
                          <p>
                            This ATU remains valid <strong>unless</strong> any of the following
                            occur:
                          </p>
                          <ul>
                            <li>
                              A new third-party integration (not previously approved) is added
                            </li>
                            <li>Data types or content on the site change</li>
                            <li>A significant security incident occurs</li>
                            <li>
                              There are deviations from the ATU maintenance requirements,
                              specifically regarding content review and its alignment with the ATU
                              process.
                            </li>
                          </ul>
                          <H4>Collect the required signatures</H4>
                          <p>
                            The signatures of the Site Owner and Manager affirm that the information
                            presented in this document is an accurate and comprehensive
                            representation of your-website.gov.
                          </p>
                          <Callout>
                            <p>
                              <strong>Website Owner</strong>
                            </p>
                            <SignatureBlock />
                          </Callout>
                          <Callout>
                            <p>
                              <strong>Website Manager</strong>
                            </p>
                            <SignatureBlock />
                          </Callout>
                          <p>
                            The Agency&apos;s Information Security Office Representative signature
                            certifies that the information contained in this document has been
                            reviewed and that the site is appropriately configured to what is
                            required for its operation.
                          </p>
                          <Callout>
                            <fieldset className="usa-fieldset">
                              <legend className="usa-legend">Select site approval status</legend>
                              <div className="usa-radio">
                                <input
                                  disabled
                                  className="usa-radio__input"
                                  id="atu-is-approved"
                                  type="radio"
                                  name="site-atu-approval"
                                  value="The ATU for your-website.gov is approved."
                                />
                                <label className="usa-radio__label" htmlFor="atu-is-approved">
                                  The ATU for your-website.gov is approved.
                                </label>
                              </div>
                              <div className="usa-radio">
                                <input
                                  disabled
                                  className="usa-radio__input"
                                  id="atu-is-not-approved"
                                  type="radio"
                                  name="site-atu-approval"
                                  value="The ATU for your-website.gov is not approved."
                                />
                                <label className="usa-radio__label" htmlFor="atu-is-not-approved">
                                  The ATU for your-website.gov is not approved.
                                </label>
                              </div>
                            </fieldset>
                            <br />
                            <p>
                              <strong>Information Security Office Representative</strong>
                            </p>
                            <SignatureBlock />
                          </Callout>
                          <p>
                            <em>
                              Forward a copy of the signed ATU document to Pages Compliance for
                              filing. Email:{' '}
                              <a href="mailto:pages-support@cloud.gov">pages-support@cloud.gov</a>
                            </em>
                          </p>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
