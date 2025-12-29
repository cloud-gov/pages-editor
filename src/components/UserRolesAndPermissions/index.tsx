import React from "react";
import type { AdminViewServerProps } from "payload";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { USWDSInit } from "./USWDSInPageNavInit.client";
import { SetStepNav } from "./SetStepNav.client";
import { redirect } from "next/navigation";

/**
* User Roles & Permissions — Custom Root View (Server Component)
* Wrapped in DefaultTemplate so the admin chrome (header, sidebar, breadcrumbs) renders.
* The in-page nav aside + headings in <main> are picked up by USWDS JS initialized by the client component.
*/
export default function UserRolesAndPermissions(props: AdminViewServerProps) {
 const { initPageResult, params, searchParams } = props;
 const { req, permissions, locale, visibleEntities } = initPageResult;
 const user = req.user

 if(!user) {
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
                    <h1>Cloud.gov Publisher Sites Roles and Permissions</h1>
                    <p className="margin-top-2">Documentation on roles and permissions. <Link href="/admin/collections/users?limit=10">Manage who can access and edit the site here.</Link></p>
                  </div>
                  <section className="usa-prose">
                    <h2 className="source-sans-pro">Cloud.gov Publisher (Multi-Tenant) Roles</h2>
                    <p>When you add a user to a site, you assign them a <strong>role</strong>. The role determines which
                    actions they can perform on content, users, and automation workflows within that site.</p>
                    <p>If a user has roles across multiple sites, their permissions apply <strong>per site</strong>. The same
                    person may be a <strong>Manager</strong> on one site and a <strong>User</strong> on another.</p>
                    <p><strong>System Administrators</strong> (Cloud.gov Page&apos;s Engineers/Operators) have global access to
                    all sites and are not governed by site-level role permissions.</p>

                    <h2>Available Roles</h2>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th scope="col">Role</th>
                            <th scope="col">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Manager</td>
                            <td>Full control of site content and user management.</td>
                          </tr>
                          <tr>
                            <td>User</td>
                            <td>Contributor with limited publishing rights.</td>
                          </tr>
                          <tr>
                            <td>Bot</td>
                            <td>System-generated automation account for CI/CD and maintenance.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><strong>Notes</strong></p>
                    <ul>
                      <li>
                        A <strong>User</strong> has the least permissions, while a <strong>Manager</strong> has the most.
                      </li>
                      <li>
                        <strong>Bots</strong> are restricted to programmatic actions through the API.
                      </li>
                    </ul>

                    <h2>Role Definitions</h2>
                    <div className="usa-accordion usa-accordion--multiselectable" data-allow-multiple>
                      <h4 className="usa-accordion__heading">
                        <button
                          type="button"
                          className="usa-accordion__button bg-primary"
                          aria-expanded="true"
                          aria-controls="a1"
                        >
                          Manager (Site Manager)
                        </button>
                      </h4>
                      <div id="a1" className="usa-accordion__content usa-prose">
                        <h4>
                          Description
                        </h4>
                        <p className="margin-top-1">
                          Manages all content and users within a single site. Has full CRUD and publishing rights
                          but cannot modify system-level or infrastructure settings of the Cloud.gov Publisher.
                        </p>
                        <h4>
                          Capabilities
                        </h4>
                        <ul className="margin-top-1">
                          <li>Create, edit, and publish content.</li>
                          <li>Manage site users and assign roles.</li>
                          <li>Approve content from other users.</li>
                          <li>Edit site configuration.</li>
                        </ul>
                      </div>
                      <h4 className="usa-accordion__heading">
                        <button
                          type="button"
                          className="usa-accordion__button bg-primary"
                          aria-expanded="false"
                          aria-controls="a2"
                        >
                          User
                        </button>
                      </h4>
                      <div id="a2" className="usa-accordion__content usa-prose">
                        <h4>
                          Description
                        </h4>
                        <p className="margin-top-1">
                          Contributor role with limited permissions, can create and edit drafts but cannot
                          publish or manage users.
                        </p>
                        <h4>
                          Capabilities
                        </h4>
                        <ul className="margin-top-1">
                          <li>Create and update draft content.</li>
                          <li>Collaborate with Managers for publishing.</li>
                          <li>Maintain their own profile and access dashboard.</li>
                        </ul>
                      </div>
                      <h4 className="usa-accordion__heading">
                        <button
                          type="button"
                          className="usa-accordion__button bg-primary"
                          aria-expanded="false"
                          aria-controls="a3"
                        >
                          Bot
                        </button>
                      </h4>
                      <div id="a3" className="usa-accordion__content usa-prose">
                        <h4>
                          Description
                        </h4>
                        <p className="margin-top-1">
                          The bot role has read only access. It cannot update or delete content.
                        </p>
                        <h4>
                          Capabilities
                        </h4>
                        <ul className="margin-top-1">
                          <li>Run automated jobs or deploy published sites.</li>
                        </ul>
                      </div>
                    </div>

                    <h2>Feature Permission Matrix</h2>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Feature Area</th>
                            <th>Action</th>
                            <th>User</th>
                            <th>Manager</th>
                            <th>Bot</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td rowSpan={5}>Content Management</td>
                            <td>Create Drafts</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Users can create content;<br/>
                            Managers can edit any content</td>
                          </tr>
                          <tr>
                            <td>Read drafts</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td>All roles can read site content</td>
                          </tr>
                          <tr>
                            <td>Update drafts</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Managers can update<br/>published content; Users only drafts</td>
                          </tr>
                          <tr>
                            <td>Delete content</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Managers can delete content</td>
                          </tr>
                          <tr>
                            <td>Publish content</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Only Managers can publish</td>
                          </tr>
                          <tr>
                            <td rowSpan={3}>User Management</td>
                            <td>View site users</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Only Managers can view and manage users</td>
                          </tr>
                          <tr>
                            <td>Add new users</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Restricted to Managers</td>
                          </tr>
                          <tr>
                            <td>Edit or remove users</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Managers cannot assign Bot or Admin roles</td>
                          </tr>
                          <tr>
                            <td>Role Management</td>
                            <td>Assign roles</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Managers can assign User or Manager only</td>
                          </tr>
                          <tr>
                            <td rowSpan={2}>Site Access</td>
                            <td>Access site dashboard</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Managers and Users can access the site dashboard</td>
                          </tr>
                          <tr>
                            <td>Modify site configuration</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Restricted to Managers</td>
                          </tr>
                          <tr>
                            <td rowSpan={2}>Automation / API</td>
                            <td>Access via API key</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td>API authentication only</td>
                          </tr>
                          <tr>
                            <td>Trigger publish or deploy</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Used for scheduled releases</td>
                          </tr>
                          <tr>
                            <td rowSpan={2}>UI Access</td>
                            <td>Login to web app</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Bots cannot log in</td>
                          </tr>
                          <tr>
                            <td>Manage personal profile</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                            <td>Not applicable for Bots</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2>Permissions by Resource</h2>
                    <p>The following sections provide permission summaries for each key resource area.</p>
                    <h3><strong>Site Content</strong></h3>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless width-full">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Manager</th>
                            <th>Bot</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Create content</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Edit draft content</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Edit published content</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Delete content</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Publish or unpublish content</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>View all content</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><Check /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><strong>Notes</strong></p>
                    <ul>
                      <li>Managers can override or delete any content.</li>
                      <li>Users can only edit drafts they created.</li>
                    </ul>

                    <h3><strong>Site User and Role Management</strong></h3>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless width-full">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Manager</th>
                            <th>Bot</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>View site users</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Invite or add users</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Edit or remove users</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Assign user roles</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Assign Bot role</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Assign System Admin role</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><strong>Notes</strong></p>
                    <ul>
                      <li>Managers can assign only User and Manager roles.</li>
                      <li>Bots and Users cannot modify user lists or roles.</li>
                    </ul>

                    <h3><strong>Site Access and Configuration</strong></h3>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless width-full">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Manager</th>
                            <th>Bot</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Access dashboard</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Modify site configuration (Change template)</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Access other sites</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Manage site integrations</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><strong>Notes</strong></p>
                    <ul>
                      <li>Configuration edits are site-scoped; Managers cannot modify other sites.</li>
                      <li>Bots are isolated to API actions.</li>
                    </ul>

                    <h3><strong>Automation and API Permissions</strong></h3>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless width-full">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Manager</th>
                            <th>Bot</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Access API</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><Check /></td>
                          </tr>
                          <tr>
                            <td>Create or modify content via API</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Trigger CI/CD workflows</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Manage API keys</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Run scheduled publish tasks</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><X /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><strong>Notes</strong></p>
                    <ul>
                      <li>Bots authenticate using API keys.</li>
                      <li>API keys are managed at the system level by administrators.</li>
                    </ul>

                    <h3><strong>UI and Authentication</strong></h3>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless width-full">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Action</th>
                            <th>User</th>
                            <th>Manager</th>
                            <th>Bot</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Log in to web interface</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Manage personal profile</td>
                            <td><Check /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Access site admin panel</td>
                            <td><X /></td>
                            <td><Check /></td>
                            <td><X /></td>
                          </tr>
                          <tr>
                            <td>Use system credentials</td>
                            <td><X /></td>
                            <td><X /></td>
                            <td><Check /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p><strong>Notes</strong></p>
                    <ul>
                      <li>Bots do not have UI access.</li>
                      <li>Managers access site admin panels for content and user management.</li>
                    </ul>

                    <h2>Example: Authorization Table</h2>
                    <div className="usa-table-container--scrollable">
                      <table className="usa-table usa-table--borderless width-full">
                        <thead className="bg-base-lighter">
                          <tr>
                            <th>Site_id</th>
                            <th>Role</th>
                            <th>Resource</th>
                            <th>Action</th>
                            <th>Allowed</th>
                            <th>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>101</td>
                            <td>manager</td>
                            <td>content</td>
                            <td>create</td>
                            <td><Check /></td>
                            <td>site role</td>
                          </tr>
                          <tr>
                            <td>101</td>
                            <td>manager</td>
                            <td>content</td>
                            <td>publish</td>
                            <td><Check /></td>
                            <td>site role</td>
                          </tr>
                          <tr>
                            <td>101</td>
                            <td>manager</td>
                            <td>users</td>
                            <td>manage</td>
                            <td><Check /></td>
                            <td>site role</td>
                          </tr>
                          <tr>
                            <td>101</td>
                            <td>user</td>
                            <td>content</td>
                            <td>create</td>
                            <td><Check /></td>
                            <td>site role</td>
                          </tr>
                          <tr>
                            <td>101</td>
                            <td>user</td>
                            <td>content</td>
                            <td>publish</td>
                            <td><X /></td>
                            <td>site role</td>
                          </tr>
                          <tr>
                            <td>101</td>
                            <td>bot</td>
                            <td>api</td>
                            <td>access</td>
                            <td><X /></td>
                            <td>API key</td>
                          </tr>
                          <tr>
                            <td>101</td>
                            <td>bot</td>
                            <td>content</td>
                            <td>publish</td>
                            <td><Check /></td>
                            <td>automation</td>
                          </tr>
                          <tr>
                            <td>102</td>
                            <td>manager</td>
                            <td>content</td>
                            <td>publish</td>
                            <td><Check /></td>
                            <td>site role</td>
                          </tr>
                          <tr>
                            <td>102</td>
                            <td>user</td>
                            <td>content</td>
                            <td>edit</td>
                            <td><Check /></td>
                            <td>site role</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

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
 );
}
