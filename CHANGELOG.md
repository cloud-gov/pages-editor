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
