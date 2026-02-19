import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { colorOptions, imageField } from '@/fields'
import { validateRichTextRequired } from '@/utilities/validators/richText'
import { validateTextRequired } from '@/utilities/validators/text'
import { commonLinkBlocks } from '@/fields/hyperlinks'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    // group: 'Site Configuration',
    description: 'Build and organize site footer content and links.',
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
          blocks: commonLinkBlocks,
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
