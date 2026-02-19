import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { validateTextRequired } from '@/utilities/validators/text'
import { commonLinkBlocks } from '@/fields/hyperlinks'

function bigFooterCondition(data): true | false {
  return data?.type === 'big' ? true : false
}

function slimFooterCondition(data): true | false {
  return data?.type === 'slim' ? true : false
}

function preFooterTypeSelectedCondition(data): true | false {
  return bigFooterCondition(data) || slimFooterCondition(data)
}

export const PreFooter: GlobalConfig = {
  slug: 'pre-footer',
  label: 'Pre-Footer',
  access: {
    read: getAdminOrSiteUserGlobals(['manager', 'user', 'bot']),
    update: getAdminOrSiteUserGlobals(),
    readVersions: getAdminOrSiteUserGlobals(),
  },
  admin: {
    // group: 'Site Configuration',
    description: 'Build and organize site pre-footer content and links.',
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
      name: 'type',
      type: 'select',
      label: 'Pre-Footer type',
      options: [
        {
          label:
            'Big - up to 4 named link groups, social media icons, and contact details (name, phone, email)',
          value: 'big',
        },
        { label: 'Slim - up to 4 links and contact details (phone end email)', value: 'slim' },
      ],
      required: true,
    },
    {
      type: 'collapsible',
      label: 'Link Groups',
      admin: {
        initCollapsed: false,
        condition: bigFooterCondition,
      },
      fields: [
        {
          name: 'groupCol',
          type: 'select',
          label: 'Number of columns in a link group',
          options: [
            { label: 'Single column - stacked vertically', value: '1' },
            { label: 'Two columns - split evenly', value: '2' },
            { label: 'Three columns - split evenly', value: '3' },
            { label: 'Four columns - split evenly', value: '4' },
          ],
          defaultValue: '1',
          required: true,
        },
        {
          name: 'linkGroup',
          type: 'array',
          maxRows: 4,
          label: '',
          labels: {
            plural: 'Link Groups',
            singular: 'Link Group',
          },
          required: false,
          admin: {
            isSortable: true,
            disableListFilter: true,
            initCollapsed: false,
          },
          fields: [
            {
              name: 'groupName',
              type: 'text',
              label: 'Group Name',
              required: true,
              validate: validateTextRequired,
            },
            {
              name: 'link',
              type: 'blocks',
              label: 'Links',
              labels: {
                singular: 'Link',
                plural: 'Links',
              },
              blocks: commonLinkBlocks,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Links',
      admin: {
        initCollapsed: false,
        condition: slimFooterCondition,
      },
      fields: [
        {
          name: 'slimLink',
          type: 'blocks',
          maxRows: 4,
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
      label: 'Connect Section',
      admin: {
        initCollapsed: false,
        condition: preFooterTypeSelectedCondition,
      },
      fields: [
        {
          name: 'connectSectionLocation',
          dbName: 'connect-section-location',
          type: 'radio',
          label: 'Location',
          options: [
            { label: 'Pre-Footer bottom', value: 'bottom' },
            { label: 'Pre-Footer right', value: 'right' },
          ],
          defaultValue: 'right',
          required: true,
          admin: {
            condition: bigFooterCondition,
          },
        },
        {
          name: 'contactCenter',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'Contact Center',
            singular: 'Contact Center',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/ContactCenterRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
          },
          fields: [
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              admin: {
                condition: bigFooterCondition,
              },
            },
            {
              name: 'phone',
              label: 'Phone',
              type: 'text',
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
            },
          ],
        },
        {
          name: 'facebook',
          type: 'array',
          maxRows: 1,
          label: ' ',
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/FacebookLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Url',
              required: true,
              validate: validateTextRequired,
            },
          ],
        },
        {
          name: 'platform_x',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'X',
            singular: 'X',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/XLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Url',
              required: true,
              validate: validateTextRequired,
            },
          ],
        },
        {
          name: 'youtube',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'YouTube',
            singular: 'YouTube',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/YoutubeLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Url',
              required: true,
              validate: validateTextRequired,
            },
          ],
        },
        {
          name: 'instagram',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'Instagram',
            singular: 'Instagram',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/InstagramLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Url',
              required: true,
              validate: validateTextRequired,
            },
          ],
        },
        {
          name: 'rssfeed',
          type: 'array',
          maxRows: 1,
          label: ' ',
          labels: {
            plural: 'RSS Feed',
            singular: 'RSS Feed',
          },
          required: false,
          admin: {
            isSortable: false,
            components: {
              RowLabel: '@/components/PreFooter/RssFeedLinkRowLabel',
            },
            disableListFilter: true,
            initCollapsed: false,
            condition: bigFooterCondition,
          },
          fields: [
            {
              name: 'url',
              type: 'text',
              label: 'Url',
              required: true,
              validate: validateTextRequired,
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
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
