# Pages Editor

A customized [Payload CMS](https://github.com/payloadcms/payload) editor for editing [Cloud.gov Pages](https://cloud.gov/pages) content.

## Initial Goals

Content Editors can:
- Edit via WYSIWIG Editor
- Avoid login through Github
- Perform basic user management and editorial workflow functions

## Second Goals
- Basic asset management
- Access Modules/Blocks/Pre-configured units of content
- Edit non-Post pages

## Infrastructure Notes
- Based on the Payload CMS [website template](https://github.com/payloadcms/payload/tree/main/templates/website)
- Currently deployed per-site, exploring [multi-tenancy](https://github.com/payloadcms/payload/tree/1.x/examples/multi-tenant)
- Relies on [pages-website-watcher](https://github.com/cloud-gov/pages-website-watcher) for live previewing
