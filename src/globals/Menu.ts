// payload/globals/Menu.ts
import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { validateTextRequired } from '@/utilities/validators/text'
import { validateSelectSingle } from '@/utilities/validators/select'
import { makeValidateRelationshipSingle, validatePage } from '@/utilities/validators/relationship'

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
              validate: validatePage,
            },
            {
              name: 'label',
              label: 'The name used on your menu link',
              type: 'text',
              required: true,
              validate: validateTextRequired,
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
              validate: validateSelectSingle,
            },
            {
              name: 'label',
              label: 'The name used on your menu link',
              type: 'text',
              required: true,
              validate: validateTextRequired,
            },
          ],
        },
        {
          slug: 'customCollectionLink',
          labels: {
            singular: 'Custom Collection Link',
            plural: 'Custom Collection Links',
          },
          fields: [
            {
              name: 'customCollection',
              label: 'Select the custom collection the menu link will link to',
              type: 'relationship',
              relationTo: 'custom-collections',
              required: true,
              validate: makeValidateRelationshipSingle({
                relationTo: 'custom-collections',
                requirePublished: false, // set to true if you want only published custom-collections to be selectable on publish
                messages: {
                  required: 'Please select a custom collection.',
                  notFound: 'Selected custom collection could not be found.',
                  notPublished: 'Selected custom collection is not published.',
                },
              }),
            },
            {
              name: 'label',
              label: 'The name used on your menu link',
              type: 'text',
              required: true,
              validate: validateTextRequired,
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
                      validate: validatePage,
                    },
                    {
                      name: 'label',
                      label: 'The name used on your menu link',
                      type: 'text',
                      required: true,
                      validate: validateTextRequired,
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
                      validate: validateSelectSingle,
                    },
                    {
                      name: 'label',
                      label: 'The name used on your menu link',
                      type: 'text',
                      required: true,
                      validate: validateTextRequired,
                    },
                  ],
                },
                {
                  slug: 'customCollectionLink',
                  labels: {
                    singular: 'Custom Collection Link',
                    plural: 'Custom Collection Links',
                  },
                  fields: [
                    {
                      name: 'customCollection',
                      label: 'Select the custom collection the menu link will link to',
                      type: 'relationship',
                      relationTo: 'custom-collections',
                      required: true,
                      validate: makeValidateRelationshipSingle({
                        relationTo: 'custom-collections',
                        requirePublished: false, // set to true if you want only published custom-collections to be selectable on publish
                        messages: {
                          required: 'Please select a custom collection.',
                          notFound: 'Selected custom collection could not be found.',
                          notPublished: 'Selected custom collection is not published.',
                        },
                      }),
                    },
                    {
                      name: 'label',
                      label: 'The name used on your menu link',
                      type: 'text',
                      required: true,
                      validate: validateTextRequired,
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
