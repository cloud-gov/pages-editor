// payload/globals/Menu.ts
import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'

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
    description: 'Build and organize site navigation for pages and content sections.',
    livePreview: {
      url: getGlobalPreviewUrl,
    },
    components: {
      // Replace the default PublishButton with custom user-aware publish button
      elements: {
        PublishButton: '@/components/CustomPublishButton',
      },
    },
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
              name: 'page',
              label: 'Select the single page the menu link will link to',
              type: 'relationship',
              relationTo: 'pages',
              required: true,
            },
            {
              name: 'label',
              label: 'The name used on your menu link',
              type: 'text',
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
              name: 'page',
              label: 'Select the content collection the menu link will link to',
              type: 'select',
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
              label: 'The name used on your menu link',
              type: 'text',
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
                      name: 'page',
                      label: 'Select the single page the menu link will link to',
                      type: 'relationship',
                      relationTo: 'pages',
                      required: true,
                    },
                    {
                      name: 'label',
                      label: 'The name used on your menu link',
                      type: 'text',
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
                      name: 'page',
                      label: 'Select the content collection the menu link will link to',
                      type: 'select',
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
                      label: 'The name used on your menu link',
                      type: 'text',
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
    {
      name: 'reviewReady',
      label: 'Ready for Review',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
