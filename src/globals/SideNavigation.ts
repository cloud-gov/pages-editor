// payload/globals/SideNavigation.ts
import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

export const SideNavigation: GlobalConfig = {
  slug: 'side-navigation',
  label: 'Side Navigation',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Site Configuration',
    description: 'Configure sidebar navigation for single pages.',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Side Navigation',
      defaultValue: true,
      admin: {
        description: 'Turn side navigation on/off for single pages',
        className: 'margin-top-2',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Navigation Title',
      defaultValue: 'Page Navigation',
      admin: {
        description: 'The title that appears above the side navigation',
      },
    },
    {
      name: 'items',
      type: 'blocks',
      label: 'Navigation Items',
      admin: {
        description: 'Add and organize navigation items for the side navigation',
      },
      blocks: [
        {
          slug: 'pageLink',
          labels: {
            singular: 'Page Link',
            plural: 'Page Links',
          },
          fields: [
            {
              name: 'page',
              label: 'Select the single page the navigation link will link to',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
              admin: {
                isSortable: false,
              },
            },
            {
              name: 'label',
              label: 'The name used on the navigation link',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              label: 'Sort Order',
              admin: {
                description: 'Lower numbers appear first (optional)',
              },
            },
          ],
        },
        {
          slug: 'collectionLink',
          labels: {
            singular: 'Collection Link',
            plural: 'Collection Links',
          },
          fields: [
            {
              name: 'page',
              label: 'Select the content collection the navigation link will link to',
              type: 'select',
              dbName: 'sidenav_collection',
              options: [
                { label: 'Events', value: 'events' },
                { label: 'Leadership', value: 'leadership' },
                { label: 'News', value: 'news' },
                { label: 'Blog Posts', value: 'posts' },
                { label: 'Reports', value: 'reports' },
                { label: 'Resources', value: 'resources' },
              ],
              hasMany: false,
              required: true,
            },
            {
              name: 'label',
              label: 'The name used on the navigation link',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              label: 'Sort Order',
              admin: {
                description: 'Lower numbers appear first (optional)',
              },
            },
          ],
        },
        {
          slug: 'externalLink',
          labels: {
            singular: 'External Link',
            plural: 'External Links',
          },
          fields: [
            {
              name: 'url',
              label: 'External URL',
              type: 'text',
              required: true,
              admin: {
                description: 'Full URL including https://',
              },
            },
            {
              name: 'label',
              label: 'The name used on the navigation link',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              label: 'Sort Order',
              admin: {
                description: 'Lower numbers appear first (optional)',
              },
            },
          ],
        },
        {
          slug: 'dropdown',
          labels: {
            singular: 'Dropdown Section',
            plural: 'Dropdown Sections',
          },
          fields: [
            {
              name: 'label',
              label: 'The name used for the dropdown section',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              label: 'Sort Order',
              admin: {
                description: 'Lower numbers appear first (optional)',
              },
            },
            {
              name: 'subitems',
              type: 'blocks',
              label: 'Dropdown Navigation Links',
              blocks: [
                {
                  slug: 'pageLink',
                  labels: {
                    singular: 'Page Link',
                    plural: 'Page Links',
                  },
                  fields: [
                    {
                      name: 'page',
                      label: 'Select the single page the navigation link will link to',
                      type: 'relationship',
                      relationTo: 'pages',
                      required: true,
                      admin: {
                        isSortable: false,
                      },
                    },
                    {
                      name: 'label',
                      label: 'The name used on the navigation link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'order',
                      type: 'number',
                      label: 'Sort Order',
                      admin: {
                        description: 'Lower numbers appear first (optional)',
                      },
                    },
                  ],
                },
                {
                  slug: 'collectionLink',
                  labels: {
                    singular: 'Collection Link',
                    plural: 'Collection Links',
                  },
                  fields: [
                    {
                      name: 'page',
                      label: 'Select the content collection the navigation link will link to',
                      type: 'select',
                      dbName: 'sidenav_collection',
                      options: [
                        { label: 'Events', value: 'events' },
                        { label: 'Leadership', value: 'leadership' },
                        { label: 'News', value: 'news' },
                        { label: 'Blog Posts', value: 'posts' },
                        { label: 'Reports', value: 'reports' },
                        { label: 'Resources', value: 'resources' },
                      ],
                      hasMany: false,
                      required: true,
                    },
                    {
                      name: 'label',
                      label: 'The name used on the navigation link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'order',
                      type: 'number',
                      label: 'Sort Order',
                      admin: {
                        description: 'Lower numbers appear first (optional)',
                      },
                    },
                  ],
                },
                {
                  slug: 'externalLink',
                  labels: {
                    singular: 'External Link',
                    plural: 'External Links',
                  },
                  fields: [
                    {
                      name: 'url',
                      label: 'External URL',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Full URL including https://',
                      },
                    },
                    {
                      name: 'label',
                      label: 'The name used on the navigation link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'order',
                      type: 'number',
                      label: 'Sort Order',
                      admin: {
                        description: 'Lower numbers appear first (optional)',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'fallbackToAllPages',
      type: 'checkbox',
      label: 'Fallback to All Pages',
      defaultValue: false,
      admin: {
        description: 'If no navigation items are configured, automatically show all pages in alphabetical order',
      },
    },
  ],
}
