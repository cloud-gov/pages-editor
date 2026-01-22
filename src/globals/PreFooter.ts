import { GlobalConfig } from 'payload'
import { getAdminOrSiteUserGlobals } from '@/access/adminOrSite'
import { getGlobalPreviewUrl } from '@/utilities/previews'
import { validateTextRequired } from '@/utilities/validators/text';
import { makeValidateBlocksMin } from '@/utilities/validators/blocks';
import { makeValidateRelationshipSingle, validatePage } from '@/utilities/validators/relationship';
import { validateSelectSingle } from '@/utilities/validators/select';

function bigFooterCondition(data): true | false {
  return (data?.type === 'big') ? true : false;
}

function slimFooterCondition(data): true | false {
  return (data?.type === 'slim') ? true : false;
}

function preFooterTypeSelectedCondition(data): true | false {
  return (
    bigFooterCondition(data) ||
    slimFooterCondition(data)
  )
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
    group: 'Site Configuration',
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
        { label: 'Big - up to 4 named link groups, social media icons, and contact details (name, phone, email)', value: 'big'},
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
              required: true,
              validate: makeValidateBlocksMin(1),
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
          blocks: [
            {
              slug: 'slimPageLink',
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
              slug: 'slimCollectionLink',
              dbName: 'pre_footer_slim_collection_link',
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
              slug: 'slimExternalLink',
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
                  validate: validatePage,
                },
                {
                  name: 'url',
                  label: 'Url',
                  type: 'text',
                  required: true,
                  validate: validatePage,
                },
              ],
            },
          ],
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
    }
  }
}
