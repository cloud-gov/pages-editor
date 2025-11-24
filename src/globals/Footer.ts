import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { colorOptions, imageField } from '@/fields'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    group: 'Site Configuration',
    description: 'Build and organize site footer',
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
      name: 'domain',
      type: 'text',
      label: 'Site domain',
      required: true,
    },
    {
      type: 'collapsible',
      label: "Masthead (parent agencies’ description)",
      required: true,
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'content',
          type: 'richText',
          label: ' ', // will add required to the field
          required: true,
          editor: lexicalEditor({
            features: [
              LinkFeature({
                enabledCollections: [], // No internal links to collections
              }),
            ],
          }),
          admin: {
            description: 'The highest-level agencies associated with a site or service.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: "Parent Agencies' Logos",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'logos',
          type: 'array',
          label: '',
          labels: {
            plural: 'Logo',
            singular: 'Logo',
          },
          required: false,
          admin: {
            isSortable: true,
            disableListFilter: true,
            initCollapsed: false,
          },
          fields: [
            {
              name: 'url',
              label: 'Logo link url',
              type: 'text',
              required: true,
            },
            {
              ...imageField,
              label: '',
              admin: {
                ...imageField.admin,
                description: '',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Required links',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'link',
          type: 'blocks',
          label: ' ',
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          required: false,
          blocks: [
            {
              slug: 'pageLink',
              labels: {
                singular: 'Page Link',
                plural: 'Page Links',
              },
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'page',
                  label: 'Page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  admin: {
                    allowCreate: false,
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
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'page',
                  label: 'Content collection',
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
              ],
            },
            {
              slug: 'externalLink',
              labels: {
                singular: 'External Link',
                plural: 'External Links',
              },
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  label: 'Url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Colors (default to site theme if none selected)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        colorOptions({
          name: 'identifierColor',
          label: 'Background',
          useDefaultValue: false,
        }),
        colorOptions({
          name: 'identityDomainColor',
          label: 'Text in the masthead section',
          defaultValue: 'blue-warm-vivid',
          useDefaultValue: false,
        }),
        colorOptions({
          name: 'primaryLinkColor',
          label: 'Links in the masthead section',
          defaultValue: 'gray',
          useDefaultValue: false,
        }),
        colorOptions({
          name: 'secondaryLinkColor',
          label: 'Site domain and links in the required links section',
          defaultValue: 'gray',
          useDefaultValue: false,
        }),
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
