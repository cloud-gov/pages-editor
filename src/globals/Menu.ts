// payload/globals/Menu.ts
import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'

export const Menu: GlobalConfig = {
  slug: 'menu',
  label: 'Main Navigation',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Site Configuration',
    description: 'Navigation menu configuration',
  },
  fields: [
    {
      name: 'items',
      type: 'blocks',
      label: 'Navigation Links',
      blocks: [
        {
          slug: 'pageLink',
          labels: {
            singular: 'Page Link',
            plural: 'Page Links',
          },
          fields: [
            {
              name: 'label',
              label: 'The name used on your menu link',
              type: 'text',
              required: true,
            },
            {
              name: 'page',
              label: 'Select the single page the menu link will link to',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
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
              name: 'label',
              label: 'The name used on your menu link',
              type: 'text',
              required: true,
            },
            {
              name: 'page',
              label: 'Select the content collection the menu link will link to',
              type: 'select',
              options: [
                { label: 'Events', value: 'events' },
                { label: 'Leadership', value: 'leadership' },
                { label: 'News', value: 'news' },
                { label: 'Blog Posts', value: 'posts' },
                { label: 'Reports', value: 'reports' },
              ],
              hasMany: false,
              required: true,
            },
          ],
        },
        {
          slug: 'dropdown',
          labels: {
            singular: 'Dropdown',
            plural: 'Dropdowns',
          },
          fields: [
            {
              name: 'label',
              label: 'The name used on your dropdown link label',
              type: 'text',
              required: true,
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
                      name: 'label',
                      label: 'The name used on your menu link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'page',
                      label: 'Select the single page the menu link will link to',
                      type: 'relationship',
                      relationTo: 'pages',
                      required: true,
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
                      name: 'label',
                      label: 'The name used on your menu link',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'page',
                      label: 'Select the content collection the menu link will link to',
                      type: 'select',
                      options: [
                        { label: 'Events', value: 'events' },
                        { label: 'Leadership', value: 'leadership' },
                        { label: 'News', value: 'news' },
                        { label: 'Blog Posts', value: 'posts' },
                        { label: 'Reports', value: 'reports' },
                      ],
                      hasMany: false,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
