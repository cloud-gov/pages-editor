## 0.7.0 (2026-09-02)

### Added

- add focus to modal submit

### Fixed

- formatting
- adds focus to content block when expanded, aria attributes
- add aria-expand to side nav buttons
- add account text to button
- correct comment

## 0.6.0 (2026-08-25)

### Added

- added process list inline block
- add review queue
- add pagination
- add published build status webhook
- add published build status webhook
- Add feature flag to gate forms in env
- Refine the admin view for form submissions
- Add forms collection to allow users to create forms for sites
- add published build status webhook

### Fixed

- remove inline styles from components
- clean up formatting and unused variable change
- remove typo
- remove typo
- add custom field group component
- remove unneeded import
- bug with validation
- styling on collapsable header buttons
- styles for collapsible header elements
- move remove button to collapsebar
- drag and drop at handles only
- Rich Text editor regression
- refactor CardGrid feature
- add content button styling
- upgrade payload to fix migration bug
- error with renamed imported module
- remove unneeded component
- type error with UploadField
- type error
- type errors
- remove no longer needed util
- remove old unsupported component call and enhance maximuRows barrier
- fix css
- fix importmap
- fix comments
- fix import map
- fix pipeline?
- fix svg file
- fix styling
- fix css styling
- apply different style and address multi and single select relationship
- fix headers styling
- add endpoint
- fix lint
- fix query
- fix lint
- fix parameters
- add startedAt to update on webhook
- fix headers styling
- add endpoint
- fix lint
- fix query
- fix lint
- fix parameters
- add startedAt to update on webhook
- remove module import
- remove moved test file
- include changes to Form component text field
- add startedAt to update on webhook
- add endpoint
- fix lint
- fix query
- fix lint
- fix parameters
- fix headers styling

### Maintenance

- move from payload cms dropdown
- add tests for custom group field
- remove inline styles from content input
- add block title to summary
- add reordering, preview to content cards
- added dynamic field changes. started adding rich text
- added field for lexical editor, rough in JSON in textarea
- added lexical hydration plugin. iterate on resolving content block
- add lexical plugins, set correct version for lexical util
- adds fix for lexical editor LinkNode in hydration plugin
- adds failsafe for content editor where links exist
- add toolbar buttons to custom rich text editor
- added toolbar controls for headings, paragraphs, lists
- add dynamic awareness to toolbar controls
- move list type to dropdown element
- add underline button and style
- remove inline styles from content editor main block
- enable link button in lexical editor
- fixes rehydration of links in editor
- add modal feature to link
- added strikethrough super and subscript buttons
- adds preformatted inline code formatting button
- preliminary work on adding Accordion content element to editor
- set blcok menu to optionally show
- make accordion item heading configurable
- add drag & drop to accordion items
- refactor utilities and add expand close all buttons
- realign content editor markup with stock payload elements
- map accordion style divs to stock markup
- optimize components files and fix accordion item styling
- set accordion and content block heading styles
- update rich text menu bar styles
- rough in work on Hero Section background image field
- add image browsing capability to Hero Section block
- choose existing image functionality
- implement Hero Background image upload + drag and drop
- fit Payload specific style and markup to custom media modal
- progress on adding Block Form and Card Block components
- add a feature flag to custom content input work
- resolve form field component
- adds card grid card rows
- add effective collapse/expand to card grid rows
- style updates for custom card grid block
- add reorder buttons to card grid cards
- cleanup parent component card grid code
- cleanup card grid field
- cleanup card row component
- add test for card grid row
- add process list block components
- remove inline css
- add import map
- create componenet from sctrach
- make componenets more reusable
- recreate drag and drop component
- add copy/past component
- add tests
- update payload inputs with custom field component
- revised RelationshipField and CustomTextField utilize a fieldwrapper
- revise modal component to dynamically render edit/create form
- add tests
- add logs
- add more logs
- add checks
- apply custom text field to hero text fields
- provide custom text field overrides for lexical editor fields, collections text fields
- add test for CustomTextField
- add tests
- add logs
- add more logs
- add checks
- align description css class with existing Payload markup
- add tests
- add logs
- add more logs
- add checks

## 0.5.0 (2026-06-01)

### Added

- Add theme group to site identity config
- Create Published Status Collection
- Create Published Status Collection
- remove card grid from rich text blocks
- remove card grid from rich text blocks
- add dropdown for user to select amount cards per row
- Add nince to CSP headers
- standardized content field
- Add validator to external link group
- add collections external link
- add collections item link

### Fixed

- bug with showing new tag label
- add tests and missing fields
- fix down migration
- bad character in test
- add tests and missing fields
- fix down migration
- edit link for collection types
- Trigger pipeline
- Trigger pipeline
- Rebased with main
- IFrame CSP headers to allow cloud.gov preview urls
- Payload config CSP headers and gravatar reference
- misapplication of typing
- Leaving EMAIL_HOST on .env.example empty
- Leaving EMAIL_HOST on .env.example empty
- refactor link field as a simple label + url array
- refactor externalLink schema
- Increase card grid max rows to 90 (https://github.com/cloud-gov/private/issues/2901)
- Leaving EMAIL_HOST on .env.example empty

### Maintenance

- Update to Nodejs v24 with NPM v11.10
- update related tags input removes inline style
- add testing to related collection component
- formatting cleanup
- Update ATU package with flow diagram
- Update ATU package with flow diagram
- refactor out support utilities from main ui component
- solve lint warnings
- add test case to check for style attributes
- move Modal to its own component
- Update ATU package with flow diagram
- update editor dependencies
- Update ATU package with flow diagram
- group tag collections under tag type
- add tag type ui to dashboard
- restore migrations
- add access test for TagTypes
- include card for ungrouped tags, allow for message in nav for no tag types
- Remove unused CSP source variable
- Add connect-src to self
- Adjusting CSP configs for built in component styles

## 0.4.0 (2026-04-14)

### Added

- Add layout type to collection types for list or card grid view
- Refine ATU package and dashboard
- add active state to admin nav links
- **ci**: Add access tests to SiteAuth collection and ATU package
- Add site ATU package for managers to download
- Add site auth global collection to manage ATU
- Add site compliance ATU Package and compliance section
- Add site compliance ATU docs page
- Add side nav collection to collection entries and pages
- Add collection type edit link in type card
- Add build site hook on record unpublish or delete

### Fixed

- call headers with await
- typescript errors
- Table heading width to allow the first heading to expand based on content
- Collection entry preview and dev site gantry version build

### Maintenance

- replace merged Nav components
- Remove security considerations action

## 0.3.0 (2026-03-11)

### Added

- Refactor admin dashboard #266

### Maintenance

- Deprecate unused collections for initial data model
- update user collection to mask bot users

## 0.2.0 (2026-03-03)

### Added

- Create CI pipeline to automate tags and releases

## 0.1.0 (2026-03-02)

### Added

- Update local dev seed data to refactored schema
- Refactor reused fields and standardize Pages collection
- Standardize hyperlink fields used by collections
- Simplify data model with collection types and entries
- Image size in lexical editor
- add image field to homepage text block
- create custom card grid component
- create user roles and permissions page
- add Roles and Permissions to User collection description
- add an accordion feature type
- Add 404 page
- Add related items component
- Add 404 page
- add process list feature to rich text editor
- Add afterDelete hook for site to call delete webhook to Pages core
- add table to lexical rich text editor (#189)
- Update Alert collection to remove publish date and add alignment option #184
- User generated content collections
- Create Footer collection for site global #135
- Create Footer collection for site global #135
- Add skip link to Payload
- Update Alert collection title and review ready checkbox 167
- implement roles based controls for site globals (#166)
- Update Alert collection to include the --slim and --no-icon Alert options #164
- Create an Alert collection to allow users to post site wide informational alerts #134
- Add in-page navigation
- Add Page Menus collection
- Add Side Navigation component to Single Pages
- Create a new content type to populate the prefooter #110
- add dap agency and sub agency code config migration (#139)
- Adding home page section to editor
- add search.gov affiliate and api key fields to config (#126)
- Create migration to remove subtitle and label from Page collection
- Updating events page per designs
- Adding Resources collection
- Update invite email template
- add description to editor cards
- Reorganizing admin dashboard
- Add two color and font theming from site config
- Add label text to menu subitems
- Add leadership collection to CMS
- Add dynamic menu items and refine existing collection fields
- Add S3 site media sync to site Pages bucket
- Simplify policies collection and record review completion
- Add policies collection
- Rename collection singlepages to pages
- Add singlepages collection for contact, history, about, careers
- Adjust reports to have excerpt field
- Add Reports and Categories collections
- Add Media collection type
- add site deletion webhook
- add very basic editorial features
- hit pages webhook on publish
- add event collection
- add site endpoint to accept pages info
- trigger actions on site creation and restore previews (#44)
- add site globals, site config
- add necessary user management functions
- add api keys, globals, pages, other previewer updates

### Fixed

- css in collection list view header buttons
- added ready to review field
- remove migrations
- html indention and readme text
- bug with custom collection links
- temp remove migrations
- replace migrations
- add link field for card grid component cards
- bug with nested fields in collections
- remove relationship validators from globals
- readd relationship validator
- Access permisions to allow site users to delete Pages and Policies
- Home Page card length from 6 to 24
- Slug hook useEffect error affecting title input
- remove unneeded whitepace rule, add missing table text
- revise slug to sites roles and permissions page
- accomodate grid-col for mobile
- unescaped apostrophe
- gate the page to logged in users, correct mainly bot-oriented table info
- All collection preview links to point to the correct url
- allow heading level selection in process list feature
- improve heading level and text ui
- set heading level to one field, update labels and description
- allow heading level selection in process list feature
- improve heading level and text ui
- set heading level to one field, update labels and description
- remove mis-merged migration files
- remove 404 global from merge
- Rename 404 collection to NotFoundPage to successfull create types and regenerate migrations
- Update check migrations task to error when incomplete migrations exist
- allow heading level selection in process list feature
- improve heading level and text ui
- set heading level to one field, update labels and description
- Editor forms padding
- Limit CODEOWNERS only to Pages team
- Seed datatsets for local dev
- collection preview config to match livePreview (#177)
- add adapter for collections preview
- rename function and add test
- add tests for other utility functions in preview
- set the collection slug to 'page-menus' (#172)
- refactor tests and remove console.log
- reapply migrations after rebase to main
- reorder migrations to fix build crash
- add conditional migration update
- User selectedSiteId to update to other site if selected site is deleted
- Add our custom lexical editor to Home Page rich text
- rename table for sub agency
- Slug field generates random string when title is null during draft
- Pages staging postfix deploy variable
- update docker npm scripts to match gantry service in Dockerfile
- Staging deploy pipeline
- typo in dc:gantry
- live preview in the editor for local development
- Pin Payload to v3.50.0 to fix lexical editor bug
- Preview site config file S3 bucket prefix
- Create site Pages webhook endpoint path
- get live previewing working again
- reload previews, check email
- use broader cookie domain

### Maintenance

- reorganize dashboard and update descriptions
- revise collection descriptions
- Update to Payload v3.75.0
- change branding from PayloadCMS to Cloud.gov publisher
- add documentation for limitations, workaround and feasibility
- enable breadcrumb workaround and title meta
- Add domain service config to README docs
- Upload PayloadCMS to v3.68.5
- Changing lexical description to textarea in Alerts
- Changing lexical description to textarea in Alerts
- Update node deps 2025-12-04
- Rename side navigation
- Updating README to inform on data seeding
- update headers for collection tables (#181)
- update collection tables headers db migration
- Adding focus state to card links on dashboard
- Adding focus state to card links on dashboard
- change email product name to cloud.gov pubvlisher (#175)
- remove temp migration and apply field to rest of the global collection
- carry over review changes to the remaining global collections
- add rudimentary test cases for SiteConfig and Menu
- Updating seed data for home page and navigation
- Unify live preview for collections based on site slug
- Update site create and delete hooks preview deploy config
- Add slug field to sites for preview deployments
- Add bootstrap script for payload instance
- Updating email logo
- small content changes
- Add routes to app deploy envs
- Remove auto image resizing from Media collection
- Fixing typos on dashboard
- Fixing duplicate alerts on dashboard
- Add additional npm install sharp step for CI app build
- Reorganizeing admin dashboard
- zscaler workaround for local development (#95)
- Adjust global menu collection to be related to a site
- Make local minio storage publically accessible
- Add seed data for local dev
- Set security considerations action to read only
- Replace CONTRIBUTING.md
- add agency name to demostrate site metadata
- improve test global setup
- add ci notifications
- accept s3 bucket name
- check for migrations, run on deploy
- add cascades to non-test db
- drop pages, add news, organize
- hide api tab
- add db seed script, update docs for local docker development
- add staging/prod to ci, refactor pipelines, docs
- add docker, ci tests, and documentation
- switch site selection from preference to user.selectedSiteId
- add access tests (#20)
- add test framework
- check uaa email for auth
- removed unused types
- add migrations
- commit types for now
- add sitemap
- update deploy
- copy over demo files, lightly abstract
