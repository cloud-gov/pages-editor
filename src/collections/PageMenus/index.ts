import { CollectionConfig } from 'payload'
import { getAdminOrSiteUser } from '@/access/adminOrSite'
import { siteField } from '@/fields/relationships'
import { addSite } from '@/hooks/addSite'
import { completeReview } from '@/hooks/completeReview'
import { publish } from '@/hooks/publish'

export const PageMenus: CollectionConfig = {
  slug: 'page-menus',
  labels: {
    singular: 'Page Menu',
    plural: 'Page Menus',
  },
  access: {
    create: getAdminOrSiteUser('reports'),
    delete: getAdminOrSiteUser('reports'),
    read: getAdminOrSiteUser('reports', ['manager', 'user', 'bot']),
    update: getAdminOrSiteUser('reports'),
  },
  admin: {
    group: 'Site Configuration',
    description: 'Create and manage multiple page menus for different page sections.',
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'enabled', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Menu Name',
      required: true,
      admin: {
        description: 'Internal name for this page menu (e.g., "About Us Menu")',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Menu Title',
      defaultValue: 'Page Navigation',
      admin: {
        description: 'The title that appears above the page menu',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Menu',
      defaultValue: true,
      admin: {
        description: 'Turn this page menu on/off',
      },
    },
    {
      name: 'items',
      type: 'blocks',
      label: 'Menu Items',
      admin: {
        description: 'Add and organize menu items for this page menu',
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
              name: 'label',
              type: 'text',
              label: 'Link Text',
              required: true,
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Page',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              label: 'Order',
              admin: {
                description: 'Lower numbers appear first',
              },
            },
            {
              name: 'subitems',
              type: 'blocks',
              label: 'Sub-items',
              admin: {
                description: 'Add sub-navigation items',
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
                      name: 'label',
                      type: 'text',
                      label: 'Link Text',
                      required: true,
                    },
                    {
                      name: 'page',
                      type: 'relationship',
                      relationTo: 'pages',
                      label: 'Page',
                      required: true,
                    },
                    {
                      name: 'order',
                      type: 'number',
                      label: 'Order',
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
                      name: 'label',
                      type: 'text',
                      label: 'Link Text',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      admin: {
                        placeholder: 'https://example.com',
                      },
                    },
                    {
                      name: 'order',
                      type: 'number',
                      label: 'Order',
                    },
                  ],
                },
              ],
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
              name: 'label',
              type: 'text',
              label: 'Link Text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
              admin: {
                placeholder: 'https://example.com',
              },
            },
            {
              name: 'order',
              type: 'number',
              label: 'Order',
              admin: {
                description: 'Lower numbers appear first',
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
              name: 'label',
              type: 'text',
              label: 'Link Text',
              required: true,
            },
            {
              name: 'page',
              type: 'select',
              label: 'Collection',
              required: true,
              options: [
                { label: 'Posts', value: 'posts' },
                { label: 'Events', value: 'events' },
                { label: 'News', value: 'news' },
                { label: 'Reports', value: 'reports' },
                { label: 'Resources', value: 'resources' },
                { label: 'Leadership', value: 'leadership' },
              ],
            },
            {
              name: 'order',
              type: 'number',
              label: 'Order',
              admin: {
                description: 'Lower numbers appear first',
              },
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
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    siteField,
  ],
  hooks: {
    afterChange: [publish],
    beforeChange: [addSite, completeReview],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
