import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { colorOptions, imageField } from '@/fields'
import { validateRichTextRequired } from '@/utilities/validators/richText'
import { validateTextRequired } from '@/utilities/validators/text'
import { makeValidateRelationshipSingle, validatePage } from '@/utilities/validators/relationship'
import { validateSelectSingle } from '@/utilities/validators/select'


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
      validate: validateTextRequired,
    },
    {
      type: 'collapsible',
      label: 'Masthead (parent agencies’ description)',
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
          validate: validateRichTextRequired,
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
              validate: validateTextRequired,
            },
            {
              ...imageField,
              label: 'Logo image',
              admin: {
                description: 'The logo image to be displayed in the footer',
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
                  validate: validateTextRequired,
                },
                {
                  name: 'page',
                  label: 'Page',
                  type: 'relationship',
                  relationTo: 'pages',
                  required: true,
                  validate: validatePage,
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
                  validate: validateTextRequired,
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
                  validate: validateSelectSingle,
                },
              ],
            },
            {
              slug: 'customCollectionLink',
              dbName: 'custom_col_link',
              labels: {
                singular: 'Custom Collection Link',
                plural: 'Custom Collection Links',
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
                  validate: validateTextRequired,
                },
                {
                  name: 'customCollection',
                  label: 'Custom collection',
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
                  validate: validateTextRequired,
                },
                {
                  name: 'url',
                  label: 'Url',
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
