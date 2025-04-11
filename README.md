# Pages Editor

A customized [Payload CMS](https://github.com/payloadcms/payload) editor for creating and managing federal websites.

## Initial Goals

Content Editors can:
- Edit via WYSIWIG Editor
- Avoid login through Github
- Perform basic user management and editorial workflow functions

## Second Goals
- Basic asset management
- Access Modules/Blocks/Pre-configured units of content
- Edit non-Post pages

## Development

### Running Locally

```sh
docker compose build
docker compose run app npm ci
docker compose run app npm run seed
docker compose up
```

After this, the editor is available at localhost:3000/admin; the first load will take a few seconds while the app is compiled.

The database is seeded with the following for local development:
- Three sites, one of which is a "dummy" site for admins
- At least five users:
  - `admin@gsa.gov`: Global admin representing a Pages operator
  - `site1manager@gsa.gov`, `site2manager@gsa.gov`: Website managers with access to one site each.
  - `site1user@gsa.gov`, `site2user@gsa.gov`: Website users with access to one site each.
  - By default, sites create a `bot` user with read-only access to site data.
  - To login as a user, use the password `password`

If the database schema is changed in response to changes in the collections/globals, the development may prompt to accept certain changes (e.g. `Accept warnings and push schema to database?`). Developers can attach to the development server via:

```sh
docker attach <container_name> # pages-editor-app-1 by default
```

To detach without exiting the process: `ctrl + p`, then `ctrl + q`

### Infrastructure Notes
- Based on the Payload CMS [website template](https://github.com/payloadcms/payload/tree/main/templates/website)
- Written as a mult-tenant application similar to the [Payload example](https://github.com/payloadcms/payload/tree/main/examples/multi-tenant) but customized for certain necessary patterns:
  - Full tenant isolation (the payload example allows users to view the tenant access of other users)
  - Site managers can add users. Attempting to add existing users alters their `sites` property rather than erroring.
  - Custom site/roles display (ongoing)
  - ...
- Relies on [pages-site-gantry](https://github.com/cloud-gov/pages-site-gantry) for live previewing

### Cloud Foundry Setup

This repository's CI deploys the `pages-editor-((env))` application and [`pages-site-gantry`](https://github.com/cloud-gov/pages-site-gantry) deploys the preview application. There are four other services which are manually created per-environment:

| name                          | service                     | plan           | notes |
| ----------------------------- | --------------------------- | -------------- | ----- |
| pages-editor-((env))-rds      | aws-rds                     | micro-psql     | Primary database |
| pages-editor-((env))-deployer | cloud-gov-service-account   | space-deployer | [Create account](https://cloud.gov/docs/services/cloud-gov-service-account/). Add these credentials to cred-hub |
| pages-editor-((env)) -auth    | cloud-gov-identity-provider | oauth-client   | [Create the service](https://cloud.gov/docs/services/cloud-gov-identity-provider/). Add these credentials to `pages-editor-((env))-creds` |
| pages-editor-((env))-creds    | user-provided               |                |  Credentials here are captured in the `.profile` script for different applications  |

Each environment has a network access policy for sending email per [these instructions](https://github.com/cloud-gov/pages-mailer/?tab=readme-ov-file#usage) (make sure to specify additional ports if needed to match the `EMAIL_HOST` environment variable)

### Test framework and structure

#### DB Tests
We currently run a series of access controls tests against our database using various users. Access control is implement via [Payload properties](https://payloadcms.com/docs/access-control/overview) and custom functions we've written in `src/access`. A requirement of this application is that site data is made available only to appropriate users; these tests are essential to making that guarantee. Tests are located at `src/collections/**/access.test.ts`

Tests are run with `vitest` via:

```sh
npm run test
```

We make extensive use of [vitest context and fixtures](https://vitest.dev/guide/test-context.html) in our tests. Important notes:
- Each test runs as a [separate transaction](test/utils/test.ts#L6-10): all fixtures are scoped to that transaction, the transaction id is passed to the test, and all DB operations should use that transaction id to guarantee they are operating on the correct data and are correctly removed at the end of the test.
- The transaction id and `sites` are [automatic fixtures](https://vitest.dev/guide/test-context.html#automatic-fixture) and are available for every test. For other fixtures, ensure that the fixture variable is passed as part of the destructed test context for it to be initialized. E.g.

        ```ts
        test('my test needs posts', async ({ tid, posts }) => ...
        ```

    Currently available fixtures are shown at `test/utils/context.types.ts`.
    - These fixtures can be overwritten or modified for a given `describe` block by using `test.scoped`. Modified values will be passed down to any dependent fixtures (e.g. `defaultUserRole` will update `testUser` accordingly). Note that this is only available in a pre-release version of `vitest` (`"^3.1.0-beta.2"`).
- The test database is cleared (`test/utils/globalSetup.ts`) before and after each  test-suite run to ensure accurate fixtures.

#### UI Tests
TBD

#### API Tests
TBD
